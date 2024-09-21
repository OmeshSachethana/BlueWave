import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/products/cartSlice';
import paymentReducer from '../features/payment/paymentSlice';

// Load cart state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save cart state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const preloadedState = {
  cart: loadState(),
};

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    products: productsReducer,
    cart: cartReducer,
    payment: paymentReducer,
  },
  preloadedState,
});

// Subscribe to store updates to save cart to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
