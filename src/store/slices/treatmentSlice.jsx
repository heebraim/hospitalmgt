import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice'

// 🔐 Helper to get auth header
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return { headers: { Authorization: `Bearer ${userInfo.token}` } }
}

// === Async Thunks ===

export const treatCatCreate = createAsyncThunk('treatments/treatCatCreate',
  async (treatment, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/treatment-cat/create/${userInfo._id}`, treatment, config)
      return data
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
})

export const listTreatments = createAsyncThunk('treatments/listTreatments',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/treatment-cat-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
})

export const deleteTreatmentCat = createAsyncThunk('treatments/deleteTreatmentCat',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      await axios.delete(`${API}/treatment-cat/${id}`, config)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
})

export const treatmentDetails = createAsyncThunk('treatments/treatmentDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/treatment-cat-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
})

export const updateTreatmentCat = createAsyncThunk('treatments/updateTreatmentCat',
  async (cat, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.put(`${API}/treatment-cat-update/${cat._id}`, cat, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
})

// === Slice ===

const treatmentsSlice = createSlice({
  name: 'treatments',
  initialState: {
    loading: false,
    error: null,
    success: false,
    treatmentCategories: [],
    treatmentDetails: null
  },
  reducers: {
    resetTreatmentsState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(treatCatCreate.pending, (state) => { state.loading = true; state.success = false })
      .addCase(treatCatCreate.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.treatmentCategories.push(action.payload)
      })
      .addCase(treatCatCreate.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(listTreatments.pending, (state) => { state.loading = true })
      .addCase(listTreatments.fulfilled, (state, action) => {
        state.loading = false
        state.treatmentCategories = action.payload
      })
      .addCase(listTreatments.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(deleteTreatmentCat.pending, (state) => { state.loading = true })
      .addCase(deleteTreatmentCat.fulfilled, (state, action) => {
        state.loading = false
        state.treatmentCategories = state.treatmentCategories.filter(item => item._id !== action.payload)
      })
      .addCase(deleteTreatmentCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(treatmentDetails.pending, (state) => { state.loading = true })
      .addCase(treatmentDetails.fulfilled, (state, action) => {
        state.loading = false
        state.treatmentDetails = action.payload
      })
      .addCase(treatmentDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateTreatmentCat.pending, (state) => { state.loading = true })
      .addCase(updateTreatmentCat.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.treatmentDetails = action.payload
      })
      .addCase(updateTreatmentCat.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { resetTreatmentsState } = treatmentsSlice.actions
export default treatmentsSlice.reducer
