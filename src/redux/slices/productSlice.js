import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add initial product state here
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Add product reducers here
  },
});

export default productSlice.reducer;
