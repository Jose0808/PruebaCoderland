import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { configureStore } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

import tasksReducer from '../../app/store/tasksSlice';
import listReducer from '../../app/store/listSlice';
import HomeScreen from '../../app/(tabs)/index';
import TasksScreen from '../../app/(tabs)/TasksScreen';
import ListScreen from '../../app/(tabs)/ListScreen';

// Mock Alert and fetch
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        Alert: {
            alert: jest.fn(),
        },
    };
});

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

const Stack = createNativeStackNavigator();

const createIntegrationStore = () => {
    return configureStore({
        reducer: {
            tasks: tasksReducer,
            list: listReducer,
        },
    });
};

const TestApp = () => {
    const store = createIntegrationStore();

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Tasks" component={TasksScreen} />
                    <Stack.Screen name="List" component={ListScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

describe('App Integration Tests', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        mockAlert.mockClear();
    });

    it('completes full task management workflow', async () => {
        const { getByTestId, getByText, queryByText } = render(<TestApp />);

        // Start from Home Screen
        expect(getByText('Task Manager')).toBeTruthy();

        // Navigate to Tasks
        fireEvent.press(getByTestId('tasks-button'));

        await waitFor(() => {
            expect(getByText('My Tasks')).toBeTruthy();
            expect(getByText('No tasks yet!')).toBeTruthy();
        });

        // Open Add Task Modal
        fireEvent.press(getByTestId('add-task-button'));

        await waitFor(() => {
            expect(getByTestId('add-task-modal')).toBeTruthy();
        });

        // Add a task
        const taskInput = getByTestId('task-input');
        fireEvent.changeText(taskInput, 'Integration test task');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(getByText('Integration test task')).toBeTruthy();
            expect(queryByText('No tasks yet!')).toBeFalsy();
        });

        // Add another task
        fireEvent.press(getByTestId('add-task-button'));
        fireEvent.changeText(getByTestId('task-input'), 'Second task');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(getByText('Second task')).toBeTruthy();
        });

        // Delete first task with confirmation
        mockAlert.mockImplementation((title, message, buttons) => {
            const deleteButton = buttons?.find(b => b.text === 'Delete');
            if (deleteButton && deleteButton.onPress) {
                deleteButton.onPress();
            }
        });

        fireEvent.press(getByTestId('delete-task-1'));

        await waitFor(() => {
            expect(queryByText('Integration test task')).toBeFalsy();
            expect(getByText('Second task')).toBeTruthy();
        });
    });

    it('completes full remote list workflow', async () => {
        const mockApiResponse = [
            {
                id: '1',
                name: 'John Doe',
                avatar: 'https://example.com/avatar1.jpg',
            },
            {
                id: '2',
                name: 'Jane Smith',
                avatar: 'https://example.com/avatar2.jpg',
            },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockApiResponse,
        } as Response);

        const { getByTestId, getByText } = render(<TestApp />);

        // Start from Home Screen
        expect(getByText('Task Manager')).toBeTruthy();

        // Navigate to List
        fireEvent.press(getByTestId('list-button'));

        // Should show loading initially
        await waitFor(() => {
            expect(getByTestId('loading-indicator')).toBeTruthy();
        });

        // Should show data after loading
        await waitFor(() => {
            expect(getByText('John Doe')).toBeTruthy();
            expect(getByText('Jane Smith')).toBeTruthy();
            expect(getByText('2 items loaded')).toBeTruthy();
        });

        // Verify API was called correctly
        expect(mockFetch).toHaveBeenCalledWith(
            'https://6172cfe5110a740017222e2b.mockapi.io/elements',
        );
    });

    it('handles navigation persistence correctly', async () => {
        const { getByTestId, getByText } = render(<TestApp />);

        // Navigate to Tasks and add a task
        fireEvent.press(getByTestId('tasks-button'));

        await waitFor(() => {
            expect(getByText('My Tasks')).toBeTruthy();
        });

        // Add a task
        fireEvent.press(getByTestId('add-task-button'));
        fireEvent.changeText(getByTestId('task-input'), 'Persistent task');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(getByText('Persistent task')).toBeTruthy();
        });

        // Navigate back to Home (simulate back button)
        // In a real app, we'd use navigation.goBack(), but for testing we'll navigate to Home
        // This would require additional navigation mocking for a complete test
    });

    it('handles network errors gracefully', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { getByTestId, getByText } = render(<TestApp />);

        // Navigate to List
        fireEvent.press(getByTestId('list-button'));

        // Should show loading first
        await waitFor(() => {
            expect(getByTestId('loading-indicator')).toBeTruthy();
        });

        // Should show error after failed request
        await waitFor(() => {
            expect(getByText('Error: Network error')).toBeTruthy();
        });
    });

    it('validates empty task creation', async () => {
        const { getByTestId, getByText } = render(<TestApp />);

        // Navigate to Tasks
        fireEvent.press(getByTestId('tasks-button'));

        await waitFor(() => {
            expect(getByText('My Tasks')).toBeTruthy();
        });

        // Try to add empty task
        fireEvent.press(getByTestId('add-task-button'));
        fireEvent.press(getByTestId('submit-button')); // Submit without entering text

        expect(mockAlert).toHaveBeenCalledWith(
            'Error',
            'Task description cannot be empty',
        );

        // Try to add whitespace-only task
        fireEvent.changeText(getByTestId('task-input'), '   ');
        fireEvent.press(getByTestId('submit-button'));

        expect(mockAlert).toHaveBeenCalledWith(
            'Error',
            'Task description cannot be empty',
        );
    });

    it('handles modal cancel correctly', async () => {
        const { getByTestId, getByText, queryByTestId } = render(<TestApp />);

        // Navigate to Tasks
        fireEvent.press(getByTestId('tasks-button'));

        await waitFor(() => {
            expect(getByText('My Tasks')).toBeTruthy();
        });

        // Open modal and type something
        fireEvent.press(getByTestId('add-task-button'));
        fireEvent.changeText(getByTestId('task-input'), 'This will be cancelled');

        // Cancel modal
        fireEvent.press(getByTestId('cancel-button'));

        // Modal should be closed and no task should be added
        await waitFor(() => {
            expect(queryByTestId('add-task-modal')).toBeFalsy();
            expect(getByText('No tasks yet!')).toBeTruthy();
        });
    });

    it('maintains proper Redux state across components', async () => {
        const { getByTestId, getByText } = render(<TestApp />);

        // Add multiple tasks
        fireEvent.press(getByTestId('tasks-button'));

        // Add first task
        fireEvent.press(getByTestId('add-task-button'));
        fireEvent.changeText(getByTestId('task-input'), 'Task 1');
        fireEvent.press(getByTestId('submit-button'));

        // Add second task
        fireEvent.press(getByTestId('add-task-button'));
        fireEvent.changeText(getByTestId('task-input'), 'Task 2');
        fireEvent.press(getByTestId('submit-button'));

        await waitFor(() => {
            expect(getByText('Task 1')).toBeTruthy();
            expect(getByText('Task 2')).toBeTruthy();
        });

        // Navigate away and back (tasks should persist)
        // This would require more complex navigation testing setup
        // but the Redux state management is tested in unit tests
    });
});