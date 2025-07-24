import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ListItem {
    id: string;
    name: string;
    avatar?: string;
}

interface ListState {
    items: ListItem[];
    loading: boolean;
    error: string | null;
}

const initialState: ListState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchListItems = createAsyncThunk(
    'list/fetchItems',
    async (): Promise<ListItem[]> => {
        const response = await fetch(
            'https://6172cfe5110a740017222e2b.mockapi.io/elements',
        );
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    },
);

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        clearList: state => {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchListItems.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchListItems.fulfilled,
                (state, action: PayloadAction<ListItem[]>) => {
                    state.loading = false;
                    state.items = action.payload;
                },
            )
            .addCase(fetchListItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error';
            });
    },
});

export const { clearList } = listSlice.actions;
export default listSlice.reducer;