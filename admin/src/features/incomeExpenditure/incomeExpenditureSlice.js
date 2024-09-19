import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api/incomeExpenditure';

export const fetchRecords = createAsyncThunk('incomeExpenditure/fetchRecords', async () => {
    const response = await axios.get(BASE_URL);
    return response.data.data;
});

export const addRecord = createAsyncThunk('incomeExpenditure/addRecord', async (record) => {
    const response = await axios.post(BASE_URL, record);
    return response.data.data;
});

export const updateRecord = createAsyncThunk('incomeExpenditure/updateRecord', async ({ id, updatedRecord }) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedRecord);
    return response.data.data;
});

export const deleteRecord = createAsyncThunk('incomeExpenditure/deleteRecord', async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
});

const incomeExpenditureSlice = createSlice({
    name: 'incomeExpenditure',
    initialState: {
        records: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchRecords.fulfilled, (state, action) => {
                state.records = action.payload;
            })
            .addCase(addRecord.fulfilled, (state, action) => {
                state.records.push(action.payload);
            })
            .addCase(updateRecord.fulfilled, (state, action) => {
                const index = state.records.findIndex(record => record._id === action.payload._id);
                state.records[index] = action.payload;
            })
            .addCase(deleteRecord.fulfilled, (state, action) => {
                state.records = state.records.filter(record => record._id !== action.payload);
            });
    }
});

export default incomeExpenditureSlice.reducer;
