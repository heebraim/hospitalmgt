import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice' // adjust path if needed

const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return { headers: { Authorization: `Bearer ${userInfo.token}` } }
}

// Create medicine
export const createMedicine = createAsyncThunk(
  'medicine/create',
  async (med, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/medicine-create/${userInfo._id}`, med, config)
      return data
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// List medicines
export const listMedicines = createAsyncThunk(
  'medicine/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/medicine-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Delete medicine
export const deleteMedicine = createAsyncThunk(
  'medicine/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      await axios.delete(`${API}/medicine-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Update medicine
export const updateMedicine = createAsyncThunk(
  'medicine/update',
  async (med, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.put(`${API}/medicine-update/${med._id}/${userInfo._id}`, med, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

// Medicine details
export const detailsMedicine = createAsyncThunk(
  'medicine/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/medicine-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// List type enums
export const listTypesEnums = createAsyncThunk(
  'medicine/listTypesEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/medicine/medicine-type-values/${userInfo._id}`, config)
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      if (message === 'Not authorized, token failed') dispatch(logout())
      return rejectWithValue(message)
    }
  }
)

const medicineSlice = createSlice({
  name: 'medicine',
  initialState: {
    medicines: [],
    medicineDetails: null,
    typeEnums: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetMedicineState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createMedicine
      .addCase(createMedicine.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        state.medicines.push(action.payload)
      })
      .addCase(createMedicine.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listMedicines
      .addCase(listMedicines.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listMedicines.fulfilled, (state, action) => {
        state.loading = false
        state.medicines = action.payload
      })
      .addCase(listMedicines.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // deleteMedicine
      .addCase(deleteMedicine.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false
        state.medicines = state.medicines.filter(m => m._id !== action.payload)
      })
      .addCase(deleteMedicine.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // updateMedicine
      .addCase(updateMedicine.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.loading = false; state.success = true
        const idx = state.medicines.findIndex(m => m._id === action.payload._id)
        if (idx !== -1) state.medicines[idx] = action.payload
        state.medicineDetails = action.payload
      })
      .addCase(updateMedicine.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // detailsMedicine
      .addCase(detailsMedicine.pending, (state) => { state.loading = true; state.error = null })
      .addCase(detailsMedicine.fulfilled, (state, action) => {
        state.loading = false
        state.medicineDetails = action.payload
      })
      .addCase(detailsMedicine.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // listTypesEnums
      .addCase(listTypesEnums.pending, (state) => { state.loading = true; state.error = null })
      .addCase(listTypesEnums.fulfilled, (state, action) => {
        state.loading = false
        state.typeEnums = action.payload
      })
      .addCase(listTypesEnums.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { resetMedicineState } = medicineSlice.actions
export default medicineSlice.reducer
