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





const categories = [
  {
    name: "Outfits",
    subcategories: [
      { name: "Boys Outfits", items: ["Boys Trouser sets", "Boys Short sets", "Trousers", "T-Shirts"] },
      { name: "Girls Outfits", items: ["Girls Trouser set", "Girls Short set", "Skirt set", "Dresses", "Fanay wear", "Trousers", "Tops", "Leggings"] },
      { name: "Swimming Wear", items: ["Boys Costumes", "Girls Costumes"] },
      { name: "Inner Wears", items: ["Vests", "Boxers", "Panties", "Boob Tops"] },
    ],
  },
  {
    name: "Bags",
    subcategories: [
      { name: "School Bags", items: ["3 in 1 Trolley Bag", "3 in 1 Backpack", "2 in 1 Backpack", "Single Backpack"] },
      { name: "Travelling Bags", items: ["3 in 1 Suitcase", "Single Suitcase"] },
      { name: "Girls Handbags", items: [] },
      { name: "Monkey Bags", items: [] },
      { name: "Lunch Bags", items: [] },
    ],
  },
  {
    name: "Shoes",
    subcategories: [
      { name: "Boys' Shoes", items: ["Boys Sneakers", "Converse", "Boys Open Shoes", "Boys School Shoes"] },
      { name: "Girls' Shoes", items: ["Girls Sneakers", "Doll Shoes", "Heels", "Girls Open Shoes", "Girls School Shoes"] },
    ],
  },
  {
    name: "Kids Hygiene",
    subcategories: [
      { name: "Perfumes", items: ["Boys Scents", "Girls Scents"] },
      { name: "Body Mists", items: ["Boys Scents", "Girls Scents"] },
      { name: "Body Wash", items: [] },
      { name: "Lotions", items: [] },
      { name: "Make Up Kit", items: [] },
    ],
  },
  {
    name: "Kids Accessories",
    subcategories: [
      { name: "Watches", items: [] },
      { name: "Hair Accessories", items: [] },
    ],
  },
  {
    name: "Others",
    subcategories: [
      { name: "Pencil Pouches", items: [] },
      { name: "Cosplay Costumes", items: [] },
      { name: "Raincoats", items: [] },
      { name: "Swimming Bags", items: [] },
    ],
  },
];
