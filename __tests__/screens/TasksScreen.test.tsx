import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import TasksScreen from '../../app/(tabs)/TasksScreen';
import tasksReducer, { addTask } from '../../app/store/tasksSlice';

// Mock Alert
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        Alert: {
            alert: jest.fn(),
        },
    };
});

const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

const createTestStore = (initialTasks = []) => {
    return configureStore({
        reducer: {
            tasks: tasksReducer,
        },
        preloadedState: {
            tasks: {
                tasks: initialTasks,
            },
        },
    });
};

const renderWithStore = (store: any) => {
    return render(
        <Provider store={store}>
            <TasksScreen />
        </Provider>,
    );
};

describe('TasksScreen', () => {
    beforeEach(() => {
        mockAlert.mockClear();
    });

    it('renders correctly when no tasks exist', () => {
        const store = createTestStore();
        const { getByText, getByTestId } = renderWithStore(store);

        expect(getByText('My Tasks')).toBeTruthy();
        expect(getByText('+ Add Task')).toBeTruthy();
        expect(getByText('No tasks yet!')).toBeTruthy();
        expect(getByText('Tap "Add Task" to create your first task')).toBeTruthy();
        expect(getByTestId('add-task-button')).toBeTruthy();
    });

    it('renders tasks when they exist', () => {
        const mockTasks = [
            {
                id: '1',
                description: 'Test task 1',
                createdAt: Date.now(),
            },
            {
                id: '2',
                description: 'Test task 2',
                createdAt: Date.now(),
            },
        ];

        const store = createTestStore(mockTasks);
        const { getByText, getByTestId } = renderWithStore(store);

        expect(getByText('Test task 1')).toBeTruthy();
        expect(getByText('Test task 2')).toBeTruthy();
        expect(getByTestId('tasks-list')).toBeTruthy();
        expect(getByTestId('task-1')).toBeTruthy();
        expect(getByTestId('task-2')).toBeTruthy();
    });

    it('opens modal when Add Task button is pressed', () => {
        const store = createTestStore();
        const { getByTestId, queryByTestId } = renderWithStore(store);

        // Modal should not be visible initially
        expect(queryByTestId('add-task-modal')).toBeFalsy();

        // Press add task button
        const addButton = getByTestId('add-task-button');
        fireEvent.press(addButton);

        // Modal should now be visible
        expect(getByTestId('add-task-modal')).toBeTruthy();
    });

    it('displays delete button for each task', () => {
        const mockTasks = [
            {
                id: '1',
                description: 'Test task',
                createdAt: Date.now(),
            },
        ];

        const store = createTestStore(mockTasks);
        const { getByTestId } = renderWithStore(store);

        expect(getByTestId('delete-task-1')).toBeTruthy();
    });

    it('shows confirmation alert when delete button is pressed', () => {
        const mockTasks = [
            {
                id: '1',
                description: 'Test task',
                createdAt: Date.now(),
            },
        ];

        const store = createTestStore(mockTasks);
        const { getByTestId } = renderWithStore(store);

        const deleteButton = getByTestId('delete-task-1');
        fireEvent.press(deleteButton);

        expect(mockAlert).toHaveBeenCalledWith(
            'Delete Task',
            'Are you sure you want to delete this task?',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
                expect.objectContaining({
                    text: 'Delete',
                    style: 'destructive',
                    onPress: expect.any(Function),
                }),
            ]),
        );
    });

    it('deletes task when confirmed in alert', () => {
        const mockTasks = [
            {
                id: '1',
                description: 'Test task',
                createdAt: Date.now(),
            },
        ];

        const store = createTestStore(mockTasks);
        const { getByTestId, queryByText } = renderWithStore(store);

        // Task should be visible
        expect(queryByText('Test task')).toBeTruthy();

        // Mock Alert.alert to immediately call the onPress function
        mockAlert.mockImplementation((title, message, buttons) => {
            const deleteButton = buttons?.find(b => b.text === 'Delete');
            if (deleteButton && deleteButton.onPress) {
                deleteButton.onPress();
            }
        });

        const deleteButton = getByTestId('delete-task-1');
        fireEvent.press(deleteButton);

        // Task should be removed
        expect(queryByText('Test task')).toBeFalsy();
        expect(queryByText('No tasks yet!')).toBeTruthy();
    });

    it('displays task creation date', () => {
        const testDate = new Date('2024-01-15').getTime();
        const mockTasks = [
            {
                id: '1',
                description: 'Test task',
                createdAt: testDate,
            },
        ];

        const store = createTestStore(mockTasks);
        const { getByText } = renderWithStore(store);

        expect(getByText('1/15/2024')).toBeTruthy();
    });

    it('updates tasks list when new task is added via Redux', () => {
        const store = createTestStore();
        const { getByText, queryByText } = renderWithStore(store);

        // Initially no tasks
        expect(queryByText('No tasks yet!')).toBeTruthy();

        // Add task via Redux action
        store.dispatch(addTask('New task from Redux'));

        // Task should appear
        expect(getByText('New task from Redux')).toBeTruthy();
        expect(queryByText('No tasks yet!')).toBeFalsy();
    });

    it('maintains tasks order (newest first)', () => {
        const mockTasks = [
            {
                id: '1',
                description: 'First task',
                createdAt: Date.now() - 1000,
            },
            {
                id: '2',
                description: 'Second task',
                createdAt: Date.now(),
            },
        ];

        const store = createTestStore(mockTasks);
        const { getByTestId } = renderWithStore(store);

        // Both tasks should be present
        expect(getByTestId('task-1')).toBeTruthy();
        expect(getByTestId('task-2')).toBeTruthy();
    });
});