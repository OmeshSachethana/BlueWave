import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    userDetails: {
      name: "",
      location: { lat: 40.748817, lng: -73.985428 }, // Default location
    },
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item._id === action.payload._id && item.type === action.payload.type
      );

      // Check if the item being added is a product or a subscription
      if (action.payload.type === "subscription") {
        // Add subscription to the cart (no quantity adjustment for subscriptions)
        if (!existingItem) {
          state.items.push({ ...action.payload, quantity: 1 }); // Add subscription without modifying quantity
        } else {
          console.warn("Subscription already in cart."); // Prevent duplicate subscriptions
        }
      } else if (action.payload.type === "product") {
        // Add product to the cart and handle quantity
        if (existingItem) {
          // If product already exists, increase quantity
          existingItem.quantity += 1;
        } else {
          // Add new product with initial quantity
          state.items.push({ ...action.payload, quantity: 1 });
        }
      } else {
        console.error(
          "Unknown item type. Must be 'product' or 'subscription'."
        );
      }
    },

    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload
      );
      if (index !== -1) {
        state.items.splice(index, 1); // Remove item from the cart
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.type === "product") {
        // Only increase quantity for products, not subscriptions
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.type === "product" && item.quantity > 1) {
        // Only decrease quantity for products, not subscriptions
        item.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = []; // Clear all items from the cart
    },

    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setUserDetails,
} = cartSlice.actions;

export default cartSlice.reducer;
