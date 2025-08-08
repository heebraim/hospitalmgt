import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice'  // adjust import if path differs

// Helper
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return { headers: { Authorization: `Bearer ${userInfo.token}` } }
}

// ✅ create doctor
export const createDoctor = createAsyncThunk(
  'doctor/create',
  async (doctor, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/doctor-create/${userInfo._id}`, doctor, config)
      return data
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// 📄 list doctors
export const listDoctors = createAsyncThunk(
  'doctor/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/doctor-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// ❌ delete doctor
export const deleteDoctors = createAsyncThunk(
  'doctor/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      await axios.delete(`${API}/doctor-remove/${id}`, config)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// ✏️ update doctor
export const updateDoctors = createAsyncThunk(
  'doctor/update',
  async (doc, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.put(`${API}/doctor-update/${doc._id}/${userInfo._id}`, doc, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// 🔍 doctor details
export const doctorDetails = createAsyncThunk(
  'doctor/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/doctor-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ENUMS
export const listGenderEnums = createAsyncThunk(
  'doctor/listGenderEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/doctor/gender-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

export const listDaysEnums = createAsyncThunk(
  'doctor/listDaysEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/doctor/days-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

export const listDutyEnums = createAsyncThunk(
  'doctor/listDutyEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/doctor/duty-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    doctors: [],
    doctorDetails: null,
    genderEnums: [],
    daysEnums: [],
    dutyEnums: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetDoctorState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createDoctor
      .addCase(createDoctor.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.doctors.push(action.payload)
      })
      .addCase(createDoctor.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      // listDoctors
      .addCase(listDoctors.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload
      })
      .addCase(listDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      // deleteDoctors
      .addCase(deleteDoctors.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = state.doctors.filter(doc => doc._id !== action.payload)
      })
      .addCase(deleteDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      // updateDoctors
      .addCase(updateDoctors.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateDoctors.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        const index = state.doctors.findIndex(doc => doc._id === action.payload._id)
        if (index !== -1) state.doctors[index] = action.payload
        state.doctorDetails = action.payload
      })
      .addCase(updateDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      // doctorDetails
      .addCase(doctorDetails.pending, (state) => { state.loading = true; state.error = null })
      .addCase(doctorDetails.fulfilled, (state, action) => {
        state.loading = false
        state.doctorDetails = action.payload
      })
      .addCase(doctorDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      // enums
      .addCase(listGenderEnums.fulfilled, (state, action) => { state.genderEnums = action.payload })
      .addCase(listDaysEnums.fulfilled, (state, action) => { state.daysEnums = action.payload })
      .addCase(listDutyEnums.fulfilled, (state, action) => { state.dutyEnums = action.payload })
      
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => { state.loading = false; state.error = action.payload }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => { state.loading = false }
      )
  }
})

export const { resetDoctorState } = doctorSlice.actions
export default doctorSlice.reducer
