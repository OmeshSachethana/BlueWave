import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for adding a new maintenance record
export const addMaintenance = createAsyncThunk(
  'maintenance/addMaintenance',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/maintenance', maintenanceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add this in your Redux slice
export const fetchAllMaintenance = createAsyncThunk(
    'maintenance/fetchAllMaintenance',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('/api/maintenance');
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

// Async thunk for deleting a maintenance record
export const deleteMaintenance = createAsyncThunk(
    'maintenance/deleteMaintenance',
    async (id, { rejectWithValue }) => {
      try {
        await axios.delete(`/api/maintenance/${id}`);
        return id;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Async thunk to update the maintenance status
export const updateMaintenanceStatus = createAsyncThunk(
    'maintenance/updateMaintenanceStatus',
    async ({ id, status, date, priority, technician  }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`/api/maintenance/${id}`, { status, date, priority, technician });
        return response.data.data; // Assuming the response contains the updated record
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  
  const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: {
      maintenanceList: [],
      status: null,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch all maintenance records
        .addCase(fetchAllMaintenance.fulfilled, (state, action) => {
          state.maintenanceList = action.payload;
        })
        .addCase(fetchAllMaintenance.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(deleteMaintenance.fulfilled, (state, action) => {
          state.maintenanceList = state.maintenanceList.filter(
            (maintenance) => maintenance._id !== action.payload
          );
        })
        // Update the maintenance record status
        .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
        const index = state.maintenanceList.findIndex(
          (maintenance) => maintenance._id === action.payload._id
        );
        if (index !== -1) {
          state.maintenanceList[index] = action.payload; // Update the status
        }
      });
    },
  });
  
  export default maintenanceSlice.reducer;