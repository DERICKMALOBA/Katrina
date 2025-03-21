import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch search results
export const fetchSearchResults = createAsyncThunk(
    'search/fetchSearchResults',
    async (searchParams, { rejectWithValue }) => {
        try {
            // Convert searchParams to a query string
            const queryString = new URLSearchParams(searchParams).toString();
            const response = await fetch(`/api/products/search?${queryString}`);

            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            // Parse the JSON response
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state
const initialState = {
    searchParams: {
        name: '',
        category: '',
        subcategory: '',
    },
    results: [],
    loading: false,
    error: null,
};

// Create slice
const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        // Action to update search parameters
        setSearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        // Action to clear search results
        clearSearchResults: (state) => {
            state.results = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle fetchSearchResults lifecycle
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { setSearchParams, clearSearchResults } = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;