import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import productsReducer from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    products: productsReducer,
  },
});
