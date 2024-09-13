import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/products/cartSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});
