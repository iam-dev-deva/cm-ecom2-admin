import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProductCategory } from '../../api/productApi'

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductCategory()
      return response.Data || []
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch categories')
    }
  }
)

const initialState = {
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categories = []
      state.lastFetched = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
        state.lastFetched = new Date().getTime()
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCategories } = categorySlice.actions
export default categorySlice.reducer
