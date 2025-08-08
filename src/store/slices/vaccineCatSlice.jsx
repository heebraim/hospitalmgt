import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'

// === Helper for auth header ===
const getAuthConfig = (getState, json = false) => {
  const { userLogin: { userInfo } } = getState()
  return {
    headers: {
      ...(json && { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${userInfo.token}`
    }
  }
}

// === Thunks ===

// Create vaccine category
export const createVacCat = createAsyncThunk('vaccineCat/create',
  async (vac, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/vaccine-create/${userInfo._id}`, vac, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
})

// List vaccine categories
export const listVacCat = createAsyncThunk('vaccineCat/list',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/vaccine-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// Delete vaccine category
export const deleteVacCat = createAsyncThunk('vaccineCat/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      await axios.delete(`${API}/vaccine-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// Update vaccine category
export const updateVacCat = createAsyncThunk('vaccineCat/update',
  async (vac, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState, true)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.put(`${API}/vaccine-update/${vac._id}/${userInfo._id}`, vac, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// Get vaccine category details
export const detailsVacCat = createAsyncThunk('vaccineCat/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/vaccine-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// List type enums
export const listVacTypesEnums = createAsyncThunk('vaccineCat/listTypesEnums',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/vaccine/vaccine-type-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

// === Slice ===

const vaccineCategoriesSlice = createSlice({
  name: 'vaccineCategories',
  initialState: {
    categories: [],
    categoryDetails: null,
    typeEnums: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetVaccineCatState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createVacCat.pending, (state) => { state.loading = true })
      .addCase(createVacCat.fulfilled, (state, action) => {
        state.loading = false; state.success = true; state.categories.push(action.payload)
      })
      .addCase(createVacCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // List
      .addCase(listVacCat.pending, (state) => { state.loading = true })
      .addCase(listVacCat.fulfilled, (state, action) => {
        state.loading = false; state.categories = action.payload
      })
      .addCase(listVacCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // Delete
      .addCase(deleteVacCat.pending, (state) => { state.loading = true })
      .addCase(deleteVacCat.fulfilled, (state, action) => {
        state.loading = false
        state.categories = state.categories.filter(cat => cat._id !== action.payload)
      })
      .addCase(deleteVacCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // Update
      .addCase(updateVacCat.pending, (state) => { state.loading = true })
      .addCase(updateVacCat.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.categoryDetails = action.payload
        state.categories = state.categories.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        )
      })
      .addCase(updateVacCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // Details
      .addCase(detailsVacCat.pending, (state) => { state.loading = true })
      .addCase(detailsVacCat.fulfilled, (state, action) => {
        state.loading = false; state.categoryDetails = action.payload
      })
      .addCase(detailsVacCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // List type enums
      .addCase(listVacTypesEnums.pending, (state) => { state.loading = true })
      .addCase(listVacTypesEnums.fulfilled, (state, action) => {
        state.loading = false; state.typeEnums = action.payload
      })
      .addCase(listVacTypesEnums.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { resetVaccineCatState } = vaccineCategoriesSlice.actions
export default vaccineCategoriesSlice.reducer
