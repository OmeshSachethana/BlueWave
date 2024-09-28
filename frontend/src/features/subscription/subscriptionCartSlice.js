import { createSlice } from "@reduxjs/toolkit";

const subscriptionCartSlice = createSlice({
  name: "subscriptionCart",
  initialState: {
    plans: [],
  },
  reducers: {
    addToSubscriptionCart: (state, action) => {
      console.log("Adding to cart:", action.payload);
      // Ensure state.plans is an array
      if (!Array.isArray(state.plans)) {
        state.plans = []; // Initialize as an empty array if undefined or not an array
      }

      const existingPlan = state.plans.find(
        (plan) => plan._id === action.payload._id
      );
      if (!existingPlan) {
        state.plans.push(action.payload); // Add the plan if it doesn't exist
      }
    },

    removeFromSubscriptionCart: (state, action) => {
      const index = state.plans.findIndex(
        (plan) => plan._id === action.payload
      );
      if (index !== -1) {
        state.plans.splice(index, 1); // Remove the selected subscription plan
      }
    },
    clearSubscriptionCart: (state) => {
      state.plans = []; // Clear all subscription plans
    },
  },
});

export const {
  addToSubscriptionCart,
  removeFromSubscriptionCart,
  clearSubscriptionCart,
} = subscriptionCartSlice.actions;

export default subscriptionCartSlice.reducer;
