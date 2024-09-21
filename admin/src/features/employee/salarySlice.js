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

// Async thunk to fetch all employee salaries
export const fetchEmployeeSalaries = createAsyncThunk(
  'salary/fetchEmployeeSalaries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/api/employeesSalary`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to update employee salary
export const updateEmployeeSalary = createAsyncThunk(
  'salary/updateEmployeeSalary',
  async (salaryData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/api/employeesSalary/${salaryData.employeeID}`, salaryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete employee salary
export const deleteEmployeeSalary = createAsyncThunk(
  'salary/deleteEmployeeSalary',
  async (employeeID, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/api/employeesSalary/${employeeID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    salaryList: [],  // Store a list of all salaries
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeSalaries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployeeSalaries.fulfilled, (state, action) => {
        state.salaryList = action.payload; // Assuming payload is an array of salaries
        state.status = 'succeeded';
      })
      .addCase(fetchEmployeeSalaries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(createEmployeeSalary.fulfilled, (state, action) => {
        state.salaryList.push(action.payload.salary);
      })
      .addCase(updateEmployeeSalary.fulfilled, (state, action) => {
        const index = state.salaryList.findIndex((salary) => salary.employeeID === action.payload.salary.employeeID);
        if (index !== -1) {
          state.salaryList[index] = action.payload.salary;
        }
      })
      .addCase(deleteEmployeeSalary.fulfilled, (state, action) => {
        state.salaryList = state.salaryList.filter((salary) => salary.employeeID !== action.payload.employeeID);
      });
  },
});

export default salarySlice.reducer;
