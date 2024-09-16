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
      .addCase(addMaintenance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.maintenanceList.push(action.payload);
      })
      .addCase(addMaintenance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default maintenanceSlice.reducer;
