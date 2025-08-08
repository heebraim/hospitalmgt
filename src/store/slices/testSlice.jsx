import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../config';
import { logout } from './userSlice';

// Helper to get auth config
const getAuthConfig = (getState, json = false) => {
  const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
  console.log('userInfo in getAuthConfig (tests):', userInfo);
  if (!userInfo || !userInfo.token) {
    console.error('No userInfo or token in getAuthConfig (tests)');
    throw new Error('User not authenticated');
  }
  return {
    headers: {
      ...(json && { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

// List paid enums
export const listPaidEnums = createAsyncThunk(
  'tests/listPaidEnums',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listPaidEnums (tests) thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listPaidEnums:', userInfo);
      console.log('listPaidEnums config:', config);
      const { data } = await axios.get(`${API}/test/paid-values/${userInfo._id}`, config);
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

// Create test category
export const createCatTest = createAsyncThunk(
  'tests/createCatTest',
  async (cat, { getState, rejectWithValue, dispatch }) => {
    console.log('createCatTest thunk called:', cat);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in createCatTest:', userInfo);
      console.log('createCatTest config:', config);
      const { data } = await axios.post(`${API}/test-category/create/${userInfo._id}`, cat, config);
      console.log('createCatTest response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      console.error('createCatTest error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// List test categories
export const listCatTests = createAsyncThunk(
  'tests/listCatTests',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listCatTests thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listCatTests:', userInfo);
      console.log('listCatTests config:', config);
      const { data } = await axios.get(`${API}/test-categories/${userInfo._id}`, config);
      console.log('listCatTests response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listCatTests error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Delete test category
export const deleteTestCat = createAsyncThunk(
  'tests/deleteTestCat',
  async (id, { getState, rejectWithValue, dispatch }) => {
    console.log('deleteTestCat thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      console.log('deleteTestCat config:', config);
      await axios.delete(`${API}/test-category/${id}`, config);
      console.log('deleteTestCat success:', id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('deleteTestCat error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Update test category
export const updateTestCat = createAsyncThunk(
  'tests/updateTestCat',
  async (cat, { getState, rejectWithValue, dispatch }) => {
    console.log('updateTestCat thunk called:', cat);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in updateTestCat:', userInfo);
      console.log('updateTestCat config:', config);
      const { data } = await axios.put(`${API}/test-category-update/${cat._id}`, cat, config);
      console.log('updateTestCat response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('updateTestCat error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Test category details
export const cateTestDetails = createAsyncThunk(
  'tests/cateTestDetails',
  async (id, { getState, rejectWithValue }) => {
    console.log('cateTestDetails thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in cateTestDetails:', userInfo);
      console.log('cateTestDetails config:', config);
      const { data } = await axios.get(`${API}/test-category-detail/${id}/${userInfo._id}`, config);
      console.log('cateTestDetails response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('cateTestDetails error:', message);
      return rejectWithValue(message);
    }
  }
);

// List test results
export const listTestsResults = createAsyncThunk(
  'tests/listTestsResults',
  async (_, { getState, rejectWithValue, dispatch }) => {
    console.log('listTestsResults thunk called');
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in listTestsResults:', userInfo);
      console.log('listTestsResults config:', config);
      const { data } = await axios.get(`${API}/test-list/${userInfo._id}`, config);
      console.log('listTestsResults response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('listTestsResults error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Delete test
export const deleteTests = createAsyncThunk(
  'tests/deleteTests',
  async (id, { getState, rejectWithValue, dispatch }) => {
    console.log('deleteTests thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      console.log('deleteTests config:', config);
      await axios.delete(`${API}/test-remove/${id}`, config);
      console.log('deleteTests success:', id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('deleteTests error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Update test
export const updateTest = createAsyncThunk(
  'tests/updateTest',
  async (test, { getState, rejectWithValue, dispatch }) => {
    console.log('updateTest thunk called:', test);
    try {
      const config = getAuthConfig(getState, true);
      console.log('updateTest config:', config);
      const { data } = await axios.put(`${API}/test-update/${test._id}`, test, config);
      console.log('updateTest response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('updateTest error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Create test
export const createTest = createAsyncThunk(
  'tests/createTest',
  async (test, { getState, rejectWithValue, dispatch }) => {
    console.log('createTest thunk called:', test);
    try {
      const config = getAuthConfig(getState, true);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in createTest:', userInfo);
      console.log('createTest config:', config);
      const { data } = await axios.post(`${API}/test-create/${userInfo._id}`, test, config);
      console.log('createTest response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      console.error('createTest error:', message);
      if (message === 'Not authorized, token failed') dispatch(logout());
      return rejectWithValue(message);
    }
  }
);

// Test details
export const testsDetails = createAsyncThunk(
  'tests/testsDetails',
  async (id, { getState, rejectWithValue }) => {
    console.log('testsDetails thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in testsDetails:', userInfo);
      console.log('testsDetails config:', config);
      const { data } = await axios.get(`${API}/test-detail/${id}/${userInfo._id}`, config);
      console.log('testsDetails response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('testsDetails error:', message);
      return rejectWithValue(message);
    }
  }
);

// Test details (user)
export const testsDetailsUser = createAsyncThunk(
  'tests/testsDetailsUser',
  async (id, { getState, rejectWithValue }) => {
    console.log('testsDetailsUser thunk called:', id);
    try {
      const config = getAuthConfig(getState);
      const { users: { userInfo } } = getState(); // Fixed to access state.users.userInfo
      console.log('userInfo in testsDetailsUser:', userInfo);
      console.log('testsDetailsUser config:', config);
      const { data } = await axios.get(`${API}/test-detail-user/${id}/${userInfo._id}`, config);
      console.log('testsDetailsUser response:', data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('testsDetailsUser error:', message);
      return rejectWithValue(message);
    }
  }
);

const testsSlice = createSlice({
  name: 'tests',
  initialState: {
    loading: false,
    error: null,
    success: false,
    testCategories: [],
    testCategoryDetails: null,
    tests: [],
    testDetails: null,
    paidEnums: [],
    testUserDetails: null,
  },
  reducers: {
    resetTestsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createCatTest.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createCatTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.testCategories.push(action.payload);
        console.log('createCatTest.fulfilled:', action.payload);
      })
      .addCase(createCatTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('createCatTest.rejected error:', action.payload);
      })
      .addCase(listCatTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listCatTests.fulfilled, (state, action) => {
        state.loading = false;
        state.testCategories = action.payload;
        console.log('listCatTests.fulfilled:', action.payload);
      })
      .addCase(listCatTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listCatTests.rejected error:', action.payload);
      })
      .addCase(deleteTestCat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestCat.fulfilled, (state, action) => {
        state.loading = false;
        state.testCategories = state.testCategories.filter(cat => cat._id !== action.payload);
        console.log('deleteTestCat.fulfilled:', action.payload);
      })
      .addCase(deleteTestCat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('deleteTestCat.rejected error:', action.payload);
      })
      .addCase(updateTestCat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestCat.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.testCategoryDetails = action.payload;
        console.log('updateTestCat.fulfilled:', action.payload);
      })
      .addCase(updateTestCat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('updateTestCat.rejected error:', action.payload);
      })
      .addCase(cateTestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cateTestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.testCategoryDetails = action.payload;
        console.log('cateTestDetails.fulfilled:', action.payload);
      })
      .addCase(cateTestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('cateTestDetails.rejected error:', action.payload);
      })
      .addCase(listTestsResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listTestsResults.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
        console.log('listTestsResults.fulfilled:', action.payload);
      })
      .addCase(listTestsResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('listTestsResults.rejected error:', action.payload);
      })
      .addCase(deleteTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = state.tests.filter(test => test._id !== action.payload);
        console.log('deleteTests.fulfilled:', action.payload);
      })
      .addCase(deleteTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('deleteTests.rejected error:', action.payload);
      })
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.testDetails = action.payload;
        console.log('updateTest.fulfilled:', action.payload);
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('updateTest.rejected error:', action.payload);
      })
      .addCase(createTest.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tests.push(action.payload);
        console.log('createTest.fulfilled:', action.payload);
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('createTest.rejected error:', action.payload);
      })
      .addCase(testsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.testDetails = action.payload;
        console.log('testsDetails.fulfilled:', action.payload);
      })
      .addCase(testsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('testsDetails.rejected error:', action.payload);
      })
      .addCase(testsDetailsUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testsDetailsUser.fulfilled, (state, action) => {
        state.loading = false;
        state.testUserDetails = action.payload;
        console.log('testsDetailsUser.fulfilled:', action.payload);
      })
      .addCase(testsDetailsUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('testsDetailsUser.rejected error:', action.payload);
      });
  },
});

export const { resetTestsState } = testsSlice.actions;
export default testsSlice.reducer;