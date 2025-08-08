import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'

// === Helper for auth header ===
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`
    }
  }
}

// === Thunks ===

// List vendors
export const listVendors = createAsyncThunk('vendors/list',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/vendor-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// Delete vendor by id
export const deleteVendors = createAsyncThunk('vendors/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      await axios.delete(`${API}/vendor-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// === Slice ===
const vendorsSlice = createSlice({
  name: 'vendors',
  initialState: {
    vendors: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetVendorsState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // List vendors
      .addCase(listVendors.pending, (state) => { state.loading = true })
      .addCase(listVendors.fulfilled, (state, action) => {
        state.loading = false; state.vendors = action.payload
      })
      .addCase(listVendors.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })

      // Delete vendor
      .addCase(deleteVendors.pending, (state) => { state.loading = true })
      .addCase(deleteVendors.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.vendors = state.vendors.filter(v => v._id !== action.payload)
      })
      .addCase(deleteVendors.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })
  }
})

export const { resetVendorsState } = vendorsSlice.actions
export default vendorsSlice.reducer
