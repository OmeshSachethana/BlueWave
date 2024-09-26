import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../features/employee/employeeSlice";
import productsReducer from "../features/products/productsSlice";
import cartReducer from "../features/products/cartSlice";
import paymentReducer from "../features/payment/paymentSlice";
import subscriptionCartReducer from "../features/subscription/subscriptionCartSlice"; // Import subscriptionCartReducer 

// Load cart and subscription cart state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    const serializedSubscriptionState =
      localStorage.getItem("subscriptionCart");

    const cartState = serializedState ? JSON.parse(serializedState) : undefined;
    const subscriptionCartState = serializedSubscriptionState
      ? JSON.parse(serializedSubscriptionState)
      : undefined;

    return {
      cart: cartState,
      subscriptionCart: subscriptionCartState,
    };
  } catch (err) {
    return undefined;
  }
};

// Save cart and subscription cart state to localStorage
const saveState = (state) => {
  try {
    const serializedCartState = JSON.stringify(state.cart);
    const serializedSubscriptionCartState = JSON.stringify(
      state.subscriptionCart
    );

    localStorage.setItem("cart", serializedCartState);
    localStorage.setItem("subscriptionCart", serializedSubscriptionCartState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const preloadedState = loadState() || {
  cart: undefined,
  subscriptionCart: undefined,
};

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    products: productsReducer,
    cart: cartReducer,
    subscriptionCart: subscriptionCartReducer,
    payment: paymentReducer,
  },
  preloadedState,
});

// Subscribe to store updates to save cart and subscription cart to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
