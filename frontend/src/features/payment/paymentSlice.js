import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const updatePaymentStatus = createAsyncThunk(
  'payment/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${backendUrl}/api/payments/${orderId}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updatePaymentStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
