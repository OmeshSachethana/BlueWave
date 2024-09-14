import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import salaryReducer from '../features/employee/salarySlice';
import productsReducer from '../features/products/productsSlice';

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
  },
});
