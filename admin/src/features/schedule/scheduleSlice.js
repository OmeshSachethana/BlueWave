import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for adding a schedule
export const addSchedule = createAsyncThunk(
  'schedules/addSchedule',
  async (schedule, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/schedule`, schedule);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Fetch all schedules
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/schedule`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update a schedule by ID
export const updateSchedule = createAsyncThunk(
  'schedules/updateSchedule',
  async ({ id, quantity, driver, duration }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/schedule/${id}`, { quantity, driver, duration });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete a schedule by ID
export const deleteSchedule = createAsyncThunk(
  'schedules/deleteSchedule',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/schedule/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState: {
    schedules: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.schedules = action.payload;
        state.loading = false;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch schedules';
      })

      // Add a new schedule
      .addCase(addSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload); // Add the new schedule to the state
        state.loading = false;
      })
      .addCase(addSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add schedule';
      })

      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const updatedSchedule = action.payload;
        const index = state.schedules.findIndex((s) => s._id === updatedSchedule._id);
        if (index !== -1) {
          state.schedules[index] = updatedSchedule; // Update the schedule in the state
        }
        state.loading = false;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update schedule';
      })

      // Delete schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter((s) => s._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete schedule';
      });
  }
});

export default scheduleSlice.reducer;
