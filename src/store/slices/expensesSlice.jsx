import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../config';
import { logout } from './userSlice';

// Helper to get auth config
const getAuthConfig = (getState, json = false) => {
  const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
  console.log('userInfo in getAuthConfig (expenses):', userInfo);
  if (!userInfo || !userInfo.token) {
    console.error('No userInfo or token in getAuthConfig (expenses)');
    throw new Error('User not authenticated');
  }
  return {
    headers: {
      ...(json && { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

// Create expense
export const createExpenses = createAsyncThunk(
  'expenses/create',
  async (expense, { getState, rejectWithValue, dispatch }) => {
    console.log('createExpenses thunk called:', expense);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in createExpenses:', userInfo);
      console.log('createExpenses config:', config);
      const { data } = await axios.post(`${API}/expenses-create/${userInfo._id}`, expense, config);
      console.log('createExpenses response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      console.error('createExpenses error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// List expenses
export const listExpenses = createAsyncThunk(
  'expenses/list',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listExpenses thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listExpenses:', userInfo);
      console.log('listExpenses config:', config);
      const { data } = await axios.get(`${API}/expenses-list/${userInfo._id}`, config);
      console.log('listExpenses response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listExpenses error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Delete expense
export const deleteExpenses = createAsyncThunk(
  'expenses/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    console.log('deleteExpenses thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in deleteExpenses:', userInfo);
      console.log('deleteExpenses config:', config);
      await axios.delete(`${API}/expenses-remove/${id}/${userInfo._id}`, config);
      console.log('deleteExpenses success:', id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('deleteExpenses error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  'expenses/update',
  async (expe, { getState, rejectWithValue, dispatch }) => {
    console.log('updateExpense thunk called:', expe);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in updateExpense:', userInfo);
      console.log('updateExpense config:', config);
      const { data } = await axios.put(`${API}/expenses-update/${expe._id}/${userInfo._id}`, expe, config);
      console.log('updateExpense response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('updateExpense error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Expense details
export const expensesDetails = createAsyncThunk(
  'expenses/details',
  async (id, { getState, rejectWithValue }) => {
    console.log('expensesDetails thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in expensesDetails:', userInfo);
      console.log('expensesDetails config:', config);
      const { data } = await axios.get(`${API}/expenses-detail/${id}/${userInfo._id}`, config);
      console.log('expensesDetails response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('expensesDetails error:', message);
      return rejectWithValue(message);
    }
  }
);

// List paid enums
export const listPaidEnums = createAsyncThunk(
  'expenses/listPaidEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listPaidEnums (expenses) thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listPaidEnums:', userInfo);
      console.log('listPaidEnums config:', config);
      const { data } = await axios.get(`${API}/expenses/paid-values/${userInfo._id}`, config);
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

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    expenseDetails: null,
    paidEnums: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetExpensesState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // createExpenses
      .addCase(createExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.expenses.push(action.payload);
        console.log('createExpenses.fulfilled:', action.payload);
      })
      .addCase(createExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('createExpenses.rejected error:', action.payload);
      })
      // listExpenses
      .addCase(listExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        console.log('listExpenses.fulfilled:', action.payload);
      })
      .addCase(listExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listExpenses.rejected error:', action.payload);
      })
      // deleteExpenses
      .addCase(deleteExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(e => e._id !== action.payload);
        console.log('deleteExpenses.fulfilled:', action.payload);
      })
      .addCase(deleteExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('deleteExpenses.rejected error:', action.payload);
      })
      // updateExpense
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const idx = state.expenses.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) state.expenses[idx] = action.payload;
        state.expenseDetails = action.payload;
        console.log('updateExpense.fulfilled:', action.payload);
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('updateExpense.rejected error:', action.payload);
      })
      // expensesDetails
      .addCase(expensesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(expensesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseDetails = action.payload;
        console.log('expensesDetails.fulfilled:', action.payload);
      })
      .addCase(expensesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('expensesDetails.rejected error:', action.payload);
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
      });
  },
});

export const { resetExpensesState } = expensesSlice.actions;
export default expensesSlice.reducer;