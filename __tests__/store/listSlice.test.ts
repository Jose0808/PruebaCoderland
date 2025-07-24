import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import listReducer, {
    fetchListItems,
    clearList,
    ListItem,
} from '../../app/store/listSlice';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('listSlice', () => {
    const initialState = {
        items: [],
        loading: false,
        error: null,
    };

    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should return the initial state', () => {
        expect(listReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearList', () => {
        const stateWithData = {
            items: [
                { id: '1', name: 'Item 1', avatar: 'url1' },
                { id: '2', name: 'Item 2', avatar: 'url2' },
            ],
            loading: false,
            error: 'Some error',
        };

        const result = listReducer(stateWithData, clearList());

        expect(result.items).toEqual([]);
        expect(result.error).toBeNull();
        expect(result.loading).toBe(false);
    });

    describe('fetchListItems async thunk', () => {
        it('should handle fetchListItems.pending', () => {
            const action = { type: fetchListItems.pending.type };
            const result = listReducer(initialState, action);

            expect(result.loading).toBe(true);
            expect(result.error).toBeNull();
        });

        it('should handle fetchListItems.fulfilled', () => {
            const mockItems: ListItem[] = [
                { id: '1', name: 'John Doe', avatar: 'avatar1.jpg' },
                { id: '2', name: 'Jane Smith', avatar: 'avatar2.jpg' },
            ];

            const action = {
                type: fetchListItems.fulfilled.type,
                payload: mockItems,
            };

            const result = listReducer(
                { items: [], loading: true, error: null },
                action,
            );

            expect(result.loading).toBe(false);
            expect(result.items).toEqual(mockItems);
            expect(result.error).toBeNull();
        });

        it('should handle fetchListItems.rejected', () => {
            const errorMessage = 'Failed to fetch data';
            const action = {
                type: fetchListItems.rejected.type,
                error: { message: errorMessage },
            };

            const result = listReducer(
                { items: [], loading: true, error: null },
                action,
            );

            expect(result.loading).toBe(false);
            expect(result.error).toBe(errorMessage);
            expect(result.items).toEqual([]);
        });

        it('should handle fetchListItems.rejected with unknown error', () => {
            const action = {
                type: fetchListItems.rejected.type,
                error: {},
            };

            const result = listReducer(
                { items: [], loading: true, error: null },
                action,
            );

            expect(result.loading).toBe(false);
            expect(result.error).toBe('Unknown error');
        });
    });

    describe('fetchListItems thunk behavior', () => {
        it('should create correct actions when fetchListItems succeeds', async () => {
            const mockResponse: ListItem[] = [
                { id: '1', name: 'Test User', avatar: 'test.jpg' },
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            } as Response);

            const store = mockStore({ list: initialState });

            await store.dispatch(fetchListItems() as any);
            const actions = store.getActions();

            expect(actions[0].type).toBe(fetchListItems.pending.type);
            expect(actions[1].type).toBe(fetchListItems.fulfilled.type);
            expect(actions[1].payload).toEqual(mockResponse);
        });

        it('should create correct actions when fetchListItems fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            } as Response);

            const store = mockStore({ list: initialState });

            await store.dispatch(fetchListItems() as any);
            const actions = store.getActions();

            expect(actions[0].type).toBe(fetchListItems.pending.type);
            expect(actions[1].type).toBe(fetchListItems.rejected.type);
        });

        it('should create correct actions when network error occurs', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const store = mockStore({ list: initialState });

            await store.dispatch(fetchListItems() as any);
            const actions = store.getActions();

            expect(actions[0].type).toBe(fetchListItems.pending.type);
            expect(actions[1].type).toBe(fetchListItems.rejected.type);
        });

        it('should call the correct API endpoint', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            } as Response);

            const store = mockStore({ list: initialState });

            await store.dispatch(fetchListItems() as any);

            expect(mockFetch).toHaveBeenCalledWith(
                'https://6172cfe5110a740017222e2b.mockapi.io/elements',
            );
        });
    });
});