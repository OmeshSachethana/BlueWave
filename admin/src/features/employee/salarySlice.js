// src/features/salarySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

// Async thunk to create employee salary
export const createEmployeeSalary = createAsyncThunk(
  'salary/createEmployeeSalary',
  async (salaryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/employeesSalary`, salaryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    salary: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeSalary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEmployeeSalary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salary = action.payload.salary;
      })
      .addCase(createEmployeeSalary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export default salarySlice.reducer;
