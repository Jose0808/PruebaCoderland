import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddTaskModal from '../../components/AddTaskModal';

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

describe('AddTaskModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

    const defaultProps = {
        visible: true,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
    };

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnSubmit.mockClear();
        mockAlert.mockClear();
    });

    it('renders correctly when visible', () => {
        const { getByText, getByTestId } = render(
            <AddTaskModal {...defaultProps} />,
        );

        expect(getByText('Add New Task')).toBeTruthy();
        expect(getByText('Task Description')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Add Task')).toBeTruthy();
        expect(getByTestId('add-task-modal')).toBeTruthy();
        expect(getByTestId('task-input')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByTestId } = render(
            <AddTaskModal {...defaultProps} visible={false} />,
        );

        expect(queryByTestId('add-task-modal')).toBeFalsy();
    });

    it('shows character count', () => {
        const { getByText } = render(<AddTaskModal {...defaultProps} />);

        expect(getByText('0/200 characters')).toBeTruthy();
    });

    it('updates character count when typing', () => {
        const { getByText, getByTestId } = render(
            <AddTaskModal {...defaultProps} />,
        );

        const input = getByTestId('task-input');
        fireEvent.changeText(input, 'Hello');

        expect(getByText('5/200 characters')).toBeTruthy();
    });

    it('updates input value when typing', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        fireEvent.changeText(input, 'Test task description');

        expect(input.props.value).toBe('Test task description');
    });

    it('calls onClose when Cancel button is pressed', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const cancelButton = getByTestId('cancel-button');
        fireEvent.press(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('clears input when Cancel button is pressed', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        const cancelButton = getByTestId('cancel-button');

        fireEvent.changeText(input, 'Some text');
        fireEvent.press(cancelButton);

        expect(input.props.value).toBe('');
    });

    it('calls onSubmit with trimmed description when valid input is submitted', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        const submitButton = getByTestId('submit-button');

        fireEvent.changeText(input, '  Valid task description  ');
        fireEvent.press(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith('Valid task description');
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('shows alert when trying to submit empty input', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const submitButton = getByTestId('submit-button');
        fireEvent.press(submitButton);

        expect(mockAlert).toHaveBeenCalledWith(
            'Error',
            'Task description cannot be empty',
        );
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows alert when trying to submit whitespace only', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        const submitButton = getByTestId('submit-button');

        fireEvent.changeText(input, '   ');
        fireEvent.press(submitButton);

        expect(mockAlert).toHaveBeenCalledWith(
            'Error',
            'Task description cannot be empty',
        );
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('clears input after successful submission', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        const submitButton = getByTestId('submit-button');

        fireEvent.changeText(input, 'Valid task');
        fireEvent.press(submitButton);

        expect(input.props.value).toBe('');
    });

    it('clears input when modal becomes visible again', () => {
        const { getByTestId, rerender } = render(
            <AddTaskModal {...defaultProps} visible={false} />,
        );

        // Re-render with visible=true to simulate modal opening
        rerender(<AddTaskModal {...defaultProps} visible={true} />);

        const input = getByTestId('task-input');
        fireEvent.changeText(input, 'Some text');

        // Hide modal
        rerender(<AddTaskModal {...defaultProps} visible={false} />);

        // Show modal again
        rerender(<AddTaskModal {...defaultProps} visible={true} />);

        expect(input.props.value).toBe('');
    });

    it('handles maximum character limit', () => {
        const { getByTestId, getByText } = render(
            <AddTaskModal {...defaultProps} />,
        );

        const input = getByTestId('task-input');
        const longText = 'a'.repeat(250); // Exceeds 200 character limit

        fireEvent.changeText(input, longText);

        // The input should be limited to 200 characters by maxLength prop
        expect(getByText('200/200 characters')).toBeTruthy();
    });

    it('has correct input placeholder', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        expect(input.props.placeholder).toBe('Enter task description...');
    });

    it('has multiline input configuration', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        expect(input.props.multiline).toBe(true);
        expect(input.props.numberOfLines).toBe(3);
    });

    it('handles modal close on request', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const modal = getByTestId('add-task-modal');

        // Simulate modal request close (e.g., Android back button)
        if (modal.props.onRequestClose) {
            modal.props.onRequestClose();
        }

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('shows autofocus on input', () => {
        const { getByTestId } = render(<AddTaskModal {...defaultProps} />);

        const input = getByTestId('task-input');
        expect(input.props.autoFocus).toBe(true);
    });

    it('maintains input state during typing session', () => {
        const { getByTestId, getByText } = render(
            <AddTaskModal {...defaultProps} />,
        );

        const input = getByTestId('task-input');

        fireEvent.changeText(input, 'First');
        expect(getByText('5/200 characters')).toBeTruthy();

        fireEvent.changeText(input, 'First part');
        expect(getByText('10/200 characters')).toBeTruthy();

        fireEvent.changeText(input, 'First part of my task');
        expect(getByText('20/200 characters')).toBeTruthy();
    });
});