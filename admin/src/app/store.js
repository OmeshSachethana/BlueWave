import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import salaryReducer from '../features/employee/salarySlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    salary: salaryReducer
  },
});
