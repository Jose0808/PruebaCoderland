import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        description: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateTask: (state, action: PayloadAction<{ id: string; description: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.description = action.payload.description;
      }
    },
  },
});

export const { addTask, removeTask, toggleTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;