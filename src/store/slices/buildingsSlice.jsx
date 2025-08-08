import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API } from "../../config"

// Get initial userInfo from state inside thunks
const getAuthConfig = (getState) => {
  const { userLogin: { userInfo } } = getState()
  return {
    headers: { Authorization: `Bearer ${userInfo.token}` }
  }
}

// 🏗 Create Building
export const createBuilding = createAsyncThunk(
  'building/createBuilding',
  async (build, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.post(`${API}/building-create/${userInfo._id}`, build, config)
      return data
    } catch (error) {
      if (error.response?.data?.error?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

// 📄 List Buildings
export const listBuildings = createAsyncThunk(
  'building/listBuildings',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      const { data } = await axios.get(`${API}/building-list/${userInfo._id}`, config)
      return data
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ❌ Delete Building
export const deleteBuilding = createAsyncThunk(
  'building/deleteBuilding',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const config = getAuthConfig(getState)
      const { userLogin: { userInfo } } = getState()
      await axios.delete(`${API}/building-remove/${id}/${userInfo._id}`, config)
      return id
    } catch (error) {
      if (error.response?.data?.message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ✏️ Update Building
export const updateBuilding = createAsyncThunk(
  'building/updateBuilding',
  async (build, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` }
      }
      const { data } = await axios.put(
        `${API}/building-update/${build._id}/${userInfo._id}`, build, config
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

// 📌 Building Details
export const buildingsDetails = createAsyncThunk(
  'building/buildingsDetails',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { userLogin: { userInfo } } = getState()
      const config = getAuthConfig(getState)
      const { data } = await axios.get(`${API}/building-detail/${id}/${userInfo._id}`, config)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const buildingSlice = createSlice({
  name: 'building',
  initialState: {
    buildings: [],
    buildingDetails: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetBuildingState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createBuilding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBuilding.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.buildings.push(action.payload)
      })
      .addCase(createBuilding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    // List
      .addCase(listBuildings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listBuildings.fulfilled, (state, action) => {
        state.loading = false
        state.buildings = action.payload
      })
      .addCase(listBuildings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    // Delete
      .addCase(deleteBuilding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.loading = false
        state.buildings = state.buildings.filter(b => b._id !== action.payload)
      })
      .addCase(deleteBuilding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    // Update
      .addCase(updateBuilding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBuilding.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        const index = state.buildings.findIndex(b => b._id === action.payload._id)
        if (index !== -1) {
          state.buildings[index] = action.payload
        }
        state.buildingDetails = action.payload
      })
      .addCase(updateBuilding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    // Details
      .addCase(buildingsDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(buildingsDetails.fulfilled, (state, action) => {
        state.loading = false
        state.buildingDetails = action.payload
      })
      .addCase(buildingsDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetBuildingState } = buildingSlice.actions
export default buildingSlice.reducer
