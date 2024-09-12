// src/features/employee/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await axios.get('/api/employees');
  return response.data.employees;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (newEmployee) => {
  const response = await axios.post('/api/employees', newEmployee);
  return response.data.employee;
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, updatedEmployee }) => {
  const response = await axios.put(`/api/employees/${id}`, updatedEmployee);
  return response.data.employee;
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
  await axios.delete(`/api/employees/${id}`);
  return id;
});

// Employee Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(employee => employee._id === action.payload._id);
        state.employees[index] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(employee => employee._id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
