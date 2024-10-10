import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  entries: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Fetch all entries from the backend
export const fetchEntries = createAsyncThunk('pettyCash/fetchEntries', async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pettyCash`);
  return response.data; // Assuming the response is an array of entries
});

// Add an entry to the backend
export const addEntry = createAsyncThunk('pettyCash/addEntry', async (newEntry) => {
  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pettyCash`, newEntry);
  return response.data;
});

// Delete an entry from the backend
export const deleteEntry = createAsyncThunk('pettyCash/deleteEntry', async (id) => {
  await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/pettyCash/${id}`);
  return id;
});

// Update an entry in the backend
export const updateEntry = createAsyncThunk('pettyCash/updateEntry', async ({ id, updatedEntry }) => {
  const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/pettyCash/${id}`, updatedEntry);
  return response.data;
});


const pettyCashSlice = createSlice({
  name: 'pettyCash',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add entries to the state
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        // Add new entry to the state
        state.entries.push(action.payload);
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        // Remove deleted entry from the state
        state.entries = state.entries.filter((entry) => entry._id !== action.payload);
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex((entry) => entry._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      });
  },
});

export default pettyCashSlice.reducer;
