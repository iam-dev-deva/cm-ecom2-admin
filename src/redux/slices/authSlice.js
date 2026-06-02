import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add initial auth state here
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Add auth reducers here
  },
});

export default authSlice.reducer;
