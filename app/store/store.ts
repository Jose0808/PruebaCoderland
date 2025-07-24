import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import listReducer from './listSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        list: listReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
