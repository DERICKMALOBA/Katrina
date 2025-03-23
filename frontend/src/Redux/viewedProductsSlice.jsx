import { createSlice } from '@reduxjs/toolkit';

const viewedProductsSlice = createSlice({
  name: 'viewedProducts',
  initialState: {
    products: [], // Array to store viewed products
  },
  reducers: {
    addViewedProduct: (state, action) => {
      const product = action.payload;
      console.log('Adding product to viewed products:', product); // Debug: Log the product being added

      // Check if the product is already in the list
      const existingProductIndex = state.products.findIndex((p) => p.id === product.id);
      if (existingProductIndex !== -1) {
        // Remove the existing product to avoid duplicates
        state.products.splice(existingProductIndex, 1);
      }
      // Add the product to the beginning of the list
      state.products.unshift(product);
      // Limit the list to the last 5 or 10 products
      if (state.products.length > 10) {
        state.products.pop(); // Remove the oldest product
      }
    },
    removeViewedProduct: (state, action) => {
      const productId = action.payload;
      console.log('Removing product from viewed products:', productId); // Debug: Log the product ID being removed

      state.products = state.products.filter((p) => p.id !== productId);
    },
    clearViewedProducts: (state) => {
      console.log('Clearing all viewed products'); // Debug: Log when clearing all products
      state.products = [];
    },
  },
});

export const { addViewedProduct, removeViewedProduct, clearViewedProducts } = viewedProductsSlice.actions;
export default viewedProductsSlice.reducer;