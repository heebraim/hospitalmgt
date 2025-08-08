import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../config';
import { logout } from './userSlice';

// Helper to get auth config
const getAuthConfig = (getState, json = false) => {
  const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
  console.log('userInfo in getAuthConfig (prescription):', userInfo);
  if (!userInfo || !userInfo.token) {
    console.error('No userInfo or token in getAuthConfig (prescription)');
    throw new Error('User not authenticated');
  }
  return {
    headers: {
      ...(json && { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

// Create prescription
export const createPrescription = createAsyncThunk(
  'prescription/create',
  async (prescrp, { getState, rejectWithValue, dispatch }) => {
    console.log('createPrescription thunk called:', prescrp);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in createPrescription:', userInfo);
      console.log('createPrescription config:', config);
      const { data } = await axios.post(`${API}/pres-create/${userInfo._id}`, prescrp, config);
      console.log('createPrescription response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      console.error('createPrescription error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// List prescriptions
export const listPrescriptions = createAsyncThunk(
  'prescription/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listPrescriptions thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listPrescriptions:', userInfo);
      console.log('listPrescriptions config:', config);
      const { data } = await axios.get(`${API}/pres-list/${userInfo._id}`, config);
      console.log('listPrescriptions response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listPrescriptions error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Delete prescription
export const deletePrescription = createAsyncThunk(
  'prescription/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    console.log('deletePrescription thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      console.log('deletePrescription config:', config);
      await axios.delete(`${API}/pres-remove/${id}`, config);
      console.log('deletePrescription success:', id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('deletePrescription error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Update prescription
export const updatePrescription = createAsyncThunk(
  'prescription/update',
  async (pres, { getState, rejectWithValue, dispatch }) => {
    console.log('updatePrescription thunk called:', pres);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in updatePrescription:', userInfo);
      console.log('updatePrescription config:', config);
      const { data } = await axios.put(`${API}/pres-update/${pres._id}/${userInfo._id}`, pres, config);
      console.log('updatePrescription response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('updatePrescription error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Prescription details (admin)
export const prescriptionDetails = createAsyncThunk(
  'prescription/details',
  async (id, { getState, rejectWithValue }) => {
    console.log('prescriptionDetails thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in prescriptionDetails:', userInfo);
      console.log('prescriptionDetails config:', config);
      const { data } = await axios.get(`${API}/pres-detail/${id}/${userInfo._id}`, config);
      console.log('prescriptionDetails response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('prescriptionDetails error:', message);
      return rejectWithValue(message);
    }
  }
);

// Prescription details (user)
export const prescriptionUsersDetails = createAsyncThunk(
  'prescription/detailsUser',
  async (id, { getState, rejectWithValue }) => {
    console.log('prescriptionUsersDetails thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in prescriptionUsersDetails:', userInfo);
      console.log('prescriptionUsersDetails config:', config);
      const { data } = await axios.get(`${API}/pres-detail-user/${id}/${userInfo._id}`, config);
      console.log('prescriptionUsersDetails response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('prescriptionUsersDetails error:', message);
      return rejectWithValue(message);
    }
  }
);

// Enums
export const listPaidEnums = createAsyncThunk(
  'prescription/paidEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listPaidEnums (prescription) thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listPaidEnums:', userInfo);
      console.log('listPaidEnums config:', config);
      const { data } = await axios.get(`${API}/pres/paid-values/${userInfo._id}`, config);
      console.log('listPaidEnums response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listPaidEnums error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

export const listEnumsPrescriptions = createAsyncThunk(
  'prescription/takeEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listEnumsPrescriptions thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listEnumsPrescriptions:', userInfo);
      console.log('listEnumsPrescriptions config:', config);
      const { data } = await axios.get(`${API}/pres/take-values/${userInfo._id}`, config);
      console.log('listEnumsPrescriptions response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listEnumsPrescriptions error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState: {
    prescriptions: [],
    prescriptionDetails: null,
    prescriptionDetailsUser: null,
    paidEnums: [],
    takeEnums: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPrescriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // createPrescription
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.prescriptions.push(action.payload);
        console.log('createPrescription.fulfilled:', action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('createPrescription.rejected error:', action.payload);
      })
      // listPrescriptions
      .addCase(listPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
        console.log('listPrescriptions.fulfilled:', action.payload);
      })
      .addCase(listPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listPrescriptions.rejected error:', action.payload);
      })
      // deletePrescription
      .addCase(deletePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = state.prescriptions.filter(p => p._id !== action.payload);
        console.log('deletePrescription.fulfilled:', action.payload);
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('deletePrescription.rejected error:', action.payload);
      })
      // updatePrescription
      .addCase(updatePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const idx = state.prescriptions.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.prescriptions[idx] = action.payload;
        state.prescriptionDetails = action.payload;
        console.log('updatePrescription.fulfilled:', action.payload);
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('updatePrescription.rejected error:', action.payload);
      })
      // prescriptionDetails
      .addCase(prescriptionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(prescriptionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptionDetails = action.payload;
        console.log('prescriptionDetails.fulfilled:', action.payload);
      })
      .addCase(prescriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('prescriptionDetails.rejected error:', action.payload);
      })
      // prescriptionUsersDetails
      .addCase(prescriptionUsersDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(prescriptionUsersDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptionDetailsUser = action.payload;
        console.log('prescriptionUsersDetails.fulfilled:', action.payload);
      })
      .addCase(prescriptionUsersDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('prescriptionUsersDetails.rejected error:', action.payload);
      })
      // listPaidEnums
      .addCase(listPaidEnums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPaidEnums.fulfilled, (state, action) => {
        state.loading = false;
        state.paidEnums = action.payload;
        console.log('listPaidEnums.fulfilled:', action.payload);
      })
      .addCase(listPaidEnums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listPaidEnums.rejected error:', action.payload);
      })
      // listEnumsPrescriptions
      .addCase(listEnumsPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listEnumsPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.takeEnums = action.payload;
        console.log('listEnumsPrescriptions.fulfilled:', action.payload);
      })
      .addCase(listEnumsPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listEnumsPrescriptions.rejected error:', action.payload);
      });
  },
});

export const { resetPrescriptionState } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;