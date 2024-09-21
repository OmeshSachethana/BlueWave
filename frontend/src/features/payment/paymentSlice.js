// src/features/payment/paymentSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api/payments";

// Async Thunk for creating a payment
export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for fetching all payments
export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for updating a payment
export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${paymentData.id}`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for deleting a payment
export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (paymentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${paymentId}`);
      return { id: paymentId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(payment => payment._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter(payment => payment._id !== action.payload.id);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
