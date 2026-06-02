import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add initial order state here
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Add order reducers here
  },
});

export default orderSlice.reducer;
