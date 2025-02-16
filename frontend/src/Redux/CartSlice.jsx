import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const calculateDiscountedPrice = (product) => {
  if (!product || !product.price) return 0;

  const discountPercentage = parseFloat(product.discount) || 0;
  const originalPrice = parseFloat(product.price) || 0;
  const discountAmount = (discountPercentage / 100) * originalPrice;
  const discountedPrice = originalPrice - discountAmount;

  return Math.round(discountedPrice * 100) / 100; 
};

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
        if (existingItem.quantity < newItem.stock) {
          existingItem.quantity++;
          state.totalQuantity++;
          state.totalPrice = Math.round((state.totalPrice + discountedPrice) * 100) / 100;
          toast.success(`${newItem.name} added to cart!`);
        } else {
          toast.error("Cannot add more than available stock!");
        }
      } else {
        if (newItem.stock > 0) {
          state.items.push({
            ...newItem,
            quantity: 1,
            discountedPrice,
          });
          state.totalQuantity++;
          state.totalPrice = Math.round((state.totalPrice + discountedPrice) * 100) / 100;
          toast.success(`${newItem.name} added to cart!`);
        } else {
          toast.error("This item is out of stock!");
        }
      }
    },

    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity--;
        state.totalPrice = Math.round((state.totalPrice - existingItem.discountedPrice) * 100) / 100;

        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
          toast.info(`${existingItem.name} removed from cart.`);
        } else {
          existingItem.quantity--;
          toast.info(`Reduced ${existingItem.name} quantity.`);
        }
      }
    },

    removeProduct: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice = Math.round((state.totalPrice - existingItem.discountedPrice * existingItem.quantity) * 100) / 100;
        state.items = state.items.filter((item) => item.id !== id);
        toast.warning(`${existingItem.name} removed from cart.`);
      }
    },
  },
});

export const { addItem, removeItem, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
