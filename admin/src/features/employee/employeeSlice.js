import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base URL from .env
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Async Thunks with error handling
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${backendUrl}/api/employees`);
    return response.data.employees;
  } catch (error) {
    // Return custom error message
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees.');
  }
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (newEmployee, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${backendUrl}/api/employees`, newEmployee);
    return response.data.employee;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add employee.');
  }
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, updatedEmployee }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${backendUrl}/api/employees/${id}`, updatedEmployee);
    return response.data.employee;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || `Failed to update employee with ID: ${id}.`);
  }
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${backendUrl}/api/employees/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || `Failed to delete employee with ID: ${id}.`);
  }
});

// Employee Slice with error handling
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while fetching employees.';
      })
      
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while adding the employee.';
      })
      
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(employee => employee._id === action.payload._id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while updating the employee.';
      })
      
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = state.employees.filter(employee => employee._id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while deleting the employee.';
      });
  },
});

// Export clearError action to allow error clearing in components
export const { clearError } = employeeSlice.actions;

export default employeeSlice.reducer;
