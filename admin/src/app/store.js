import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import salaryReducer from '../features/employee/salarySlice';
import productsReducer from '../features/products/productsSlice';
import maintenanceReducer  from '../features/maintenance/maintenanceSlice';

// Save cart state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    products: productsReducer,
    salary: salaryReducer,
    maintenance: maintenanceReducer,
  },
});

// Subscribe to store updates to save cart to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;