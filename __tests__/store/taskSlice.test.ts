import tasksReducer, {
    addTask,
    removeTask,
    clearTasks,
    Task,
} from '../../src/store/tasksSlice';

describe('tasksSlice', () => {
    const initialState = {
        tasks: [],
    };

    it('should return the initial state', () => {
        expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addTask', () => {
        const taskDescription = 'Test task';
        const action = addTask(taskDescription);
        const result = tasksReducer(initialState, action);

        expect(result.tasks).toHaveLength(1);
        expect(result.tasks[0].description).toBe(taskDescription);
        expect(result.tasks[0].id).toBeDefined();
        expect(result.tasks[0].createdAt).toBeDefined();
    });

    it('should handle multiple addTask actions', () => {
        let state = initialState;

        state = tasksReducer(state, addTask('First task'));
        state = tasksReducer(state, addTask('Second task'));

        expect(state.tasks).toHaveLength(2);
        expect(state.tasks[0].description).toBe('First task');
        expect(state.tasks[1].description).toBe('Second task');
        expect(state.tasks[0].id).not.toBe(state.tasks[1].id);
    });

    it('should handle removeTask', () => {
        const task1: Task = {
            id: '1',
            description: 'Task 1',
            createdAt: Date.now(),
        };
        const task2: Task = {
            id: '2',
            description: 'Task 2',
            createdAt: Date.now(),
        };

        const stateWithTasks = {
            tasks: [task1, task2],
        };

        const result = tasksReducer(stateWithTasks, removeTask('1'));

        expect(result.tasks).toHaveLength(1);
        expect(result.tasks[0].id).toBe('2');
        expect(result.tasks[0].description).toBe('Task 2');
    });

    it('should handle removeTask with non-existent id', () => {
        const task: Task = {
            id: '1',
            description: 'Task 1',
            createdAt: Date.now(),
        };

        const stateWithTask = {
            tasks: [task],
        };

        const result = tasksReducer(stateWithTask, removeTask('non-existent'));

        expect(result.tasks).toHaveLength(1);
        expect(result.tasks[0]).toEqual(task);
    });

    it('should handle clearTasks', () => {
        const tasksState = {
            tasks: [
                { id: '1', description: 'Task 1', createdAt: Date.now() },
                { id: '2', description: 'Task 2', createdAt: Date.now() },
            ],
        };

        const result = tasksReducer(tasksState, clearTasks());

        expect(result.tasks).toHaveLength(0);
        expect(result.tasks).toEqual([]);
    });

    it('should maintain task order when adding tasks', () => {
        let state = initialState;

        state = tasksReducer(state, addTask('First'));
        const firstTaskCreatedAt = state.tasks[0].createdAt;

        // Simulate some time passing
        jest.advanceTimersByTime(100);

        state = tasksReducer(state, addTask('Second'));

        expect(state.tasks[0].createdAt).toBeLessThanOrEqual(state.tasks[1].createdAt);
        expect(state.tasks[0].description).toBe('First');
        expect(state.tasks[1].description).toBe('Second');
    });
});

// Mock Date.now for consistent testing
beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
});

afterAll(() => {
    jest.useRealTimers();
});