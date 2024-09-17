import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for adding a schedule
export const addSchedule = createAsyncThunk('schedules/addSchedule', async (schedule) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/schedule`, schedule);
    return response.data.data;
  });  

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
      .addCase(addSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
        state.loading = false;
      })
      .addCase(addSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default scheduleSlice.reducer;
