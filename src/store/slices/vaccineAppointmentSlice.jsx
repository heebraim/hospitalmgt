import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../config';
import { logout } from './userSlice';

// Helper for auth header
const getAuthConfig = (getState, json = false) => {
  const { users: { userInfo } } = getState(); // Already correct
  console.log('userInfo in getAuthConfig (vaccine):', userInfo);
  if (!userInfo || !userInfo.token) {
    console.error('No userInfo or token in getAuthConfig (vaccine)');
    throw new Error('User not authenticated');
  }
  return {
    headers: {
      ...(json && { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

// Create appointment
export const createVacApp = createAsyncThunk(
  'vaccine/create',
  async (app, { getState, rejectWithValue, dispatch }) => {
    console.log('createVacApp thunk called:', app);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in createVacApp:', userInfo);
      console.log('createVacApp config:', config);
      const { data } = await axios.post(`${API}/vaccine-app-create/${userInfo._id}`, app, config);
      console.log('createVacApp response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      console.error('createVacApp error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// List appointments
export const listVacApp = createAsyncThunk(
  'vaccine/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listVacApp thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listVacApp:', userInfo);
      console.log('listVacApp config:', config);
      const { data } = await axios.get(`${API}/vaccine-app-list/${userInfo._id}`, config);
      console.log('listVacApp response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listVacApp error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }

);

// Delete appointment
export const deleteVacApp = createAsyncThunk(
  'vaccine/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    console.log('deleteVacApp thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in deleteVacApp:', userInfo);
      console.log('deleteVacApp config:', config);
      await axios.delete(`${API}/vaccine-app-remove/${id}/${userInfo._id}`, config);
      console.log('deleteVacApp success:', id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('deleteVacApp error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Update appointment
export const updateVacApp = createAsyncThunk(
  'vaccine/update',
  async (appVacc, { getState, rejectWithValue, dispatch }) => {
    console.log('updateVacApp thunk called:', appVacc);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in updateVacApp:', userInfo);
      console.log('updateVacApp config:', config);
      const { data } = await axios.put(`${API}/vaccine-app-update/${appVacc._id}/${userInfo._id}`, appVacc, config);
      console.log('updateVacApp response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('updateVacApp error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Get appointment details
export const detailsVacApp = createAsyncThunk(
  'vaccine/details',
  async (id, { getState, rejectWithValue }) => {
    console.log('detailsVacApp thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in detailsVacApp:', userInfo);
      console.log('detailsVacApp config:', config);
      const { data } = await axios.get(`${API}/vaccine-app-detail/${id}/${userInfo._id}`, config);
      console.log('detailsVacApp response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('detailsVacApp error:', message);
      return rejectWithValue(message);
    }
  }
);

// List day enums
export const listVacDaysEnums = createAsyncThunk(
  'vaccine/listDaysEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listVacDaysEnums thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listVacDaysEnums:', userInfo);
      console.log('listVacDaysEnums config:', config);
      const { data } = await axios.get(`${API}/vaccine/vaccine-day-values/${userInfo._id}`, config);
      console.log('listVacDaysEnums response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listVacDaysEnums error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// List taken enums
export const listVacTakenEnums = createAsyncThunk(
  'vaccine/listTakenEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listVacTakenEnums thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listVacTakenEnums:', userInfo);
      console.log('listVacTakenEnums config:', config);
      const { data } = await axios.get(`${API}/vaccine/vaccine-taken-values/${userInfo._id}`, config);
      console.log('listVacTakenEnums response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listVacTakenEnums error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

const vaccineAppointmentsSlice = createSlice({
  name: 'vaccineAppointments',
  initialState: {
    appointments: [],
    appointmentDetails: null,
    dayEnums: [],
    takenEnums: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetVaccineState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createVacApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVacApp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.appointments.push(action.payload);
        console.log('createVacApp.fulfilled:', action.payload);
      })
      .addCase(createVacApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('createVacApp.rejected error:', action.payload);
      })
      // List
      .addCase(listVacApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listVacApp.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        console.log('listVacApp.fulfilled:', action.payload);
      })
      .addCase(listVacApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listVacApp.rejected error:', action.payload);
      })
      // Delete
      .addCase(deleteVacApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVacApp.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(app => app._id !== action.payload);
        console.log('deleteVacApp.fulfilled:', action.payload);
      })
      .addCase(deleteVacApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('deleteVacApp.rejected error:', action.payload);
      })
      // Update
      .addCase(updateVacApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVacApp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.appointmentDetails = action.payload;
        state.appointments = state.appointments.map(app =>
          app._id === action.payload._id ? action.payload : app
        );
        console.log('updateVacApp.fulfilled:', action.payload);
      })
      .addCase(updateVacApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('updateVacApp.rejected error:', action.payload);
      })
      // Details
      .addCase(detailsVacApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detailsVacApp.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentDetails = action.payload;
        console.log('detailsVacApp.fulfilled:', action.payload);
      })
      .addCase(detailsVacApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('detailsVacApp.rejected error:', action.payload);
      })
      // List day enums
      .addCase(listVacDaysEnums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listVacDaysEnums.fulfilled, (state, action) => {
        state.loading = false;
        state.dayEnums = action.payload;
        console.log('listVacDaysEnums.fulfilled:', action.payload);
      })
      .addCase(listVacDaysEnums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listVacDaysEnums.rejected error:', action.payload);
      })
      // List taken enums
      .addCase(listVacTakenEnums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listVacTakenEnums.fulfilled, (state, action) => {
        state.loading = false;
        state.takenEnums = action.payload;
        console.log('listVacTakenEnums.fulfilled:', action.payload);
      })
      .addCase(listVacTakenEnums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listVacTakenEnums.rejected error:', action.payload);
      });
  },
});

export const { resetVaccineState } = vaccineAppointmentsSlice.actions;
export default vaccineAppointmentsSlice.reducer;