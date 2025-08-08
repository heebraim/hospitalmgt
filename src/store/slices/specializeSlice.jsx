import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice'

// helper to get auth config
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return { headers: { Authorization: `Bearer ${userInfo.token}` } }
}

// Create specialization
export const createSpecialize = createAsyncThunk(
  'specialize/create',
  async (special, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/specialize-create/${userInfo._id}`, special, config)
      return data
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// List specializations
export const listSpecialize = createAsyncThunk(
  'specialize/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/specialize-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Delete specialization
export const deleteSpecialize = createAsyncThunk(
  'specialize/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      await axios.delete(`${API}/specialize-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Update specialization
export const updateSpecialize = createAsyncThunk(
  'specialize/update',
  async (speciali, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.put(`${API}/specialize-update/${speciali._id}/${userInfo._id}`, speciali, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Details specialization
export const detailsSpecialize = createAsyncThunk(
  'specialize/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/specialize-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const specializeSlice = createSlice({
  name: 'specialize',
  initialState: {
    specializations: [],
    specializationDetails: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetSpecializeState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createSpecialize
      .addCase(createSpecialize.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createSpecialize.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.specializations.push(action.payload)
      })
      .addCase(createSpecialize.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listSpecialize
      .addCase(listSpecialize.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listSpecialize.fulfilled, (state, action) => {
        state.loading = false
        state.specializations = action.payload
      })
      .addCase(listSpecialize.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // deleteSpecialize
      .addCase(deleteSpecialize.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteSpecialize.fulfilled, (state, action) => {
        state.loading = false
        state.specializations = state.specializations.filter(s => s._id !== action.payload)
      })
      .addCase(deleteSpecialize.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // updateSpecialize
      .addCase(updateSpecialize.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateSpecialize.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        const idx = state.specializations.findIndex(s => s._id === action.payload._id)
        if (idx !== -1) state.specializations[idx] = action.payload
        state.specializationDetails = action.payload
      })
      .addCase(updateSpecialize.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // detailsSpecialize
      .addCase(detailsSpecialize.pending, (state) => { state.loading = true; state.error = null })
      .addCase(detailsSpecialize.fulfilled, (state, action) => {
        state.loading = false
        state.specializationDetails = action.payload
      })
      .addCase(detailsSpecialize.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { resetSpecializeState } = specializeSlice.actions
export default specializeSlice.reducer
