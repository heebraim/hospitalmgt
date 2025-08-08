import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from '../../config'
import { logout } from './userSlice'  // adjust import if needed

// Helper to get auth header
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return {
    headers: { Authorization: `Bearer ${userInfo.token}` }
  }
}

// 📌 Create designation
export const createDesignate = createAsyncThunk(
  'designate/createDesignate',
  async (designate, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.post(`${API}/designate-create/${userInfo._id}`, designate, config)
      return data
    } catch (error) {
      if (error.response?.data?.error?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

// 📄 List designations
export const listDesignate = createAsyncThunk(
  'designate/listDesignate',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/designate-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ❌ Delete designation
export const deleteDesignate = createAsyncThunk(
  'designate/deleteDesignate',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      await axios.delete(`${API}/designate-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ✏️ Update designation
export const updateDesignate = createAsyncThunk(
  'designate/updateDesignate',
  async (desig, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const { data } = await axios.put(
        `${API}/designate-update/${desig._id}/${userInfo._id}`, desig, config
      )
      return data
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// 📌 Designate details
export const detailsDesignate = createAsyncThunk(
  'designate/detailsDesignate',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/designate-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const designateSlice = createSlice({
  name: 'designate',
  initialState: {
    designations: [],
    designationDetails: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetDesignateState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // createDesignate
      .addCase(createDesignate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDesignate.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.designations.push(action.payload)
      })
      .addCase(createDesignate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // listDesignate
      .addCase(listDesignate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listDesignate.fulfilled, (state, action) => {
        state.loading = false
        state.designations = action.payload
      })
      .addCase(listDesignate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // deleteDesignate
      .addCase(deleteDesignate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDesignate.fulfilled, (state, action) => {
        state.loading = false
        state.designations = state.designations.filter(item => item._id !== action.payload)
      })
      .addCase(deleteDesignate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // updateDesignate
      .addCase(updateDesignate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDesignate.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        const index = state.designations.findIndex(item => item._id === action.payload._id)
        if (index !== -1) {
          state.designations[index] = action.payload
        }
        state.designationDetails = action.payload
      })
      .addCase(updateDesignate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // detailsDesignate
      .addCase(detailsDesignate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(detailsDesignate.fulfilled, (state, action) => {
        state.loading = false
        state.designationDetails = action.payload
      })
      .addCase(detailsDesignate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetDesignateState } = designateSlice.actions
export default designateSlice.reducer
