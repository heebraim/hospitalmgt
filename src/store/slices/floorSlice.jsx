import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice' // adjust path

const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return { headers: { Authorization: `Bearer ${userInfo.token}` } }
}

// Create floor
export const createFloor = createAsyncThunk(
  'floor/create',
  async (floor, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/floor-create/${userInfo._id}`, floor, config)
      return data
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// List floors
export const listFloors = createAsyncThunk(
  'floor/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/floor-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Delete floor
export const deleteFloors = createAsyncThunk(
  'floor/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      await axios.delete(`${API}/floor-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Update floor
export const updateFloor = createAsyncThunk(
  'floor/update',
  async (flor, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.put(`${API}/floor-update/${flor._id}/${userInfo._id}`, flor, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Floor details
export const floorsDetails = createAsyncThunk(
  'floor/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/floor-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const floorSlice = createSlice({
  name: 'floor',
  initialState: {
    floors: [],
    floorDetails: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetFloorState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createFloor
      .addCase(createFloor.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createFloor.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.floors.push(action.payload)
      })
      .addCase(createFloor.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listFloors
      .addCase(listFloors.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listFloors.fulfilled, (state, action) => {
        state.loading = false
        state.floors = action.payload
      })
      .addCase(listFloors.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // deleteFloors
      .addCase(deleteFloors.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteFloors.fulfilled, (state, action) => {
        state.loading = false
        state.floors = state.floors.filter(f => f._id !== action.payload)
      })
      .addCase(deleteFloors.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // updateFloor
      .addCase(updateFloor.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateFloor.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        const idx = state.floors.findIndex(f => f._id === action.payload._id)
        if (idx !== -1) state.floors[idx] = action.payload
        state.floorDetails = action.payload
      })
      .addCase(updateFloor.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // floorsDetails
      .addCase(floorsDetails.pending, (state) => { state.loading = true; state.error = null })
      .addCase(floorsDetails.fulfilled, (state, action) => {
        state.loading = false
        state.floorDetails = action.payload
      })
      .addCase(floorsDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { resetFloorState } = floorSlice.actions
export default floorSlice.reducer
