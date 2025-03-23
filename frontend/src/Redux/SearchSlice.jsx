// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async thunk for fetching search results
// export const fetchSearchResults = createAsyncThunk(
//   "search/fetchSearchResults",
//   async (searchParams, { rejectWithValue }) => {
//     try {
//       const queryString = new URLSearchParams(searchParams).toString();
//       console.log("Fetching search results with:", queryString);

//       const response = await fetch(
//         `/api/products/search?${queryString}`
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API Fetch Error:", errorText);
//         throw new Error(errorText || "Failed to fetch search results");
//       }

//       const data = await response.json();
//       console.log("Fetched Data:", data);
//   dispatch(setItem(data));
//       return data; // This will be handled in the `fulfilled` case
//     } catch (error) {
//       console.error("Fetch Error:", error.message);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const searchSlice = createSlice({
//   name: "search",
//   initialState: {
//     results: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {}, // No manual setSearchResults needed
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSearchResults.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSearchResults.fulfilled, (state, action) => {
//         state.loading = false;
//         state.results = action.payload; // Update the search results state
//       })
//       .addCase(fetchSearchResults.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default searchSlice.reducer;
