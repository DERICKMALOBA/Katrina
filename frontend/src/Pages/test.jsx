import { createSlice } from "@reduxjs/toolkit";

// Function to calculate the discounted price
const calculateDiscountedPrice = (product) => {
  if (!product || !product.price) return 0;

  const discountPercentage = parseFloat(product.discount) || 0;
  const originalPrice = parseFloat(product.price) || 0;
  const discountAmount = (discountPercentage / 100) * originalPrice;
  return Math.round((originalPrice - discountAmount) * 100) / 100; // Round to 2 decimal places
};

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);
};

// Redux slice for the cart
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const discountedPrice = calculateDiscountedPrice(newItem);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          discountedPrice,
        });
      }

      state.totalQuantity++;
      state.totalPrice = calculateTotalPrice(state.items);
    },

    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }

      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = calculateTotalPrice(state.items);
    },

    removeProduct: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = calculateTotalPrice(state.items);
    },
  },
});

export const { addItem, removeItem, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
