import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice'

// Helper to get auth header
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return {
    headers: { Authorization: `Bearer ${userInfo.token}` }
  }
}

// 📌 Create department
export const createDepart = createAsyncThunk(
  'department/createDepart',
  async (departs, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.post(`${API}/depart-create/${userInfo._id}`, departs, config)
      return data
    } catch (error) {
      if (error.response?.data?.error?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

// 📄 List departments
export const listDeparts = createAsyncThunk(
  'department/listDeparts',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/depart-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ❌ Delete department
export const deleteDeparts = createAsyncThunk(
  'department/deleteDeparts',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      await axios.delete(`${API}/depart-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ✏️ Update department
export const updateDeparts = createAsyncThunk(
  'department/updateDeparts',
  async (departm, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const { data } = await axios.put(`${API}/depart-update/${departm._id}/${userInfo._id}`, departm, config)
      return data
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// 📌 Department details
export const departDetails = createAsyncThunk(
  'department/departDetails',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/depart-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    departments: [],
    departmentDetails: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetDepartmentState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createDepart
      .addCase(createDepart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDepart.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.departments.push(action.payload)
      })
      .addCase(createDepart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // listDeparts
      .addCase(listDeparts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listDeparts.fulfilled, (state, action) => {
        state.loading = false
        state.departments = action.payload
      })
      .addCase(listDeparts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // deleteDeparts
      .addCase(deleteDeparts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDeparts.fulfilled, (state, action) => {
        state.loading = false
        state.departments = state.departments.filter(dep => dep._id !== action.payload)
      })
      .addCase(deleteDeparts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // updateDeparts
      .addCase(updateDeparts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDeparts.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        const index = state.departments.findIndex(dep => dep._id === action.payload._id)
        if (index !== -1) {
          state.departments[index] = action.payload
        }
        state.departmentDetails = action.payload
      })
      .addCase(updateDeparts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // departDetails
      .addCase(departDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(departDetails.fulfilled, (state, action) => {
        state.loading = false
        state.departmentDetails = action.payload
      })
      .addCase(departDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetDepartmentState } = departmentSlice.actions
export default departmentSlice.reducer
