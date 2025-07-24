import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../app/store/tasksSlice';
import listReducer from '../../app/store/listSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        list: listReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;