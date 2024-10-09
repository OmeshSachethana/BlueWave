import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL + '/api/pettycash';

// Async actions
export const fetchEntries = createAsyncThunk('pettyCash/fetchEntries', async () => {
  const response = await axios.get(apiUrl);
  return response.data;
});

export const addEntry = createAsyncThunk('pettyCash/addEntry', async (entry) => {
  const response = await axios.post(apiUrl, entry);
  return response.data;
});

export const deleteEntry = createAsyncThunk('pettyCash/deleteEntry', async (id) => {
  await axios.delete(`${apiUrl}/${id}`);
  return id;
});

const pettyCashSlice = createSlice({
  name: 'pettyCash',
  initialState: {
    entries: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(entry => entry._id !== action.payload);
      });
  },
});

export default pettyCashSlice.reducer;
