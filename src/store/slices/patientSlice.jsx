import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice'

// Helper: get auth config
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return { headers: { Authorization: `Bearer ${userInfo.token}` } }
}

// Create patient
export const createPatient = createAsyncThunk(
  'patient/create',
  async (patient, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/patient-create/${userInfo._id}`, patient, config)
      return data
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// List patients
export const listPatients = createAsyncThunk(
  'patient/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/patient-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Delete patient
export const deletePatients = createAsyncThunk(
  'patient/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      await axios.delete(`${API}/patient-remove/${id}`, config)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Status enums
export const listStatusEnums = createAsyncThunk(
  'patient/statusEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/patient/status-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Gender enums
export const listGenderEnums = createAsyncThunk(
  'patient/genderEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/patient/gender-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Type enums
export const listTypeEnums = createAsyncThunk(
  'patient/typeEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/patient/patient-type-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Update patient
export const updatePatients = createAsyncThunk(
  'patient/update',
  async (pat, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.put(`${API}/patient-update/${pat._id}/${userInfo._id}`, pat, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Patient details (admin)
export const patientsDetails = createAsyncThunk(
  'patient/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/patient-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Patient details (user)
export const patientsDetailsUser = createAsyncThunk(
  'patient/detailsUser',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/patient-detail-user/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],
    patientDetails: null,
    patientDetailsUser: null,
    statusEnums: [],
    genderEnums: [],
    typeEnums: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetPatientState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createPatient
      .addCase(createPatient.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.patients.push(action.payload)
      })
      .addCase(createPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listPatients
      .addCase(listPatients.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listPatients.fulfilled, (state, action) => {
        state.loading = false
        state.patients = action.payload
      })
      .addCase(listPatients.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // deletePatients
      .addCase(deletePatients.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deletePatients.fulfilled, (state, action) => {
        state.loading = false
        state.patients = state.patients.filter(p => p._id !== action.payload)
      })
      .addCase(deletePatients.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listStatusEnums
      .addCase(listStatusEnums.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listStatusEnums.fulfilled, (state, action) => {
        state.loading = false
        state.statusEnums = action.payload
      })
      .addCase(listStatusEnums.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listGenderEnums
      .addCase(listGenderEnums.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listGenderEnums.fulfilled, (state, action) => {
        state.loading = false
        state.genderEnums = action.payload
      })
      .addCase(listGenderEnums.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listTypeEnums
      .addCase(listTypeEnums.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listTypeEnums.fulfilled, (state, action) => {
        state.loading = false
        state.typeEnums = action.payload
      })
      .addCase(listTypeEnums.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // updatePatients
      .addCase(updatePatients.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updatePatients.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        const idx = state.patients.findIndex(p => p._id === action.payload._id)
        if (idx !== -1) state.patients[idx] = action.payload
        state.patientDetails = action.payload
      })
      .addCase(updatePatients.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // patientsDetails
      .addCase(patientsDetails.pending, (state) => { state.loading = true; state.error = null })
      .addCase(patientsDetails.fulfilled, (state, action) => {
        state.loading = false
        state.patientDetails = action.payload
      })
      .addCase(patientsDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // patientsDetailsUser
      .addCase(patientsDetailsUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(patientsDetailsUser.fulfilled, (state, action) => {
        state.loading = false
        state.patientDetailsUser = action.payload
      })
      .addCase(patientsDetailsUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { resetPatientState } = patientSlice.actions
export default patientSlice.reducer
