import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    { id: 1, name: '20 Liters Bottle', price: 1800 },
    { id: 2, name: '5 Liters Bottle', price: 900 },
    { id: 3, name: '1500 Liters Bottle', price: 650 },
    { id: 4, name: 'High Octane Water', price: 550 },
    { id: 5, name: 'Water Dispenser', price: 7650 },
    { id: 6, name: '3 Taps Hot & Cold Water Dispenser', price: 3350 },
    { id: 7, name: 'Golden Combo', price: 29900 },
    { id: 8, name: 'Silver Combo', price: 9750 },
  ],
  cart: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
  },
});

export const { addToCart } = productsSlice.actions;
export default productsSlice.reducer;
