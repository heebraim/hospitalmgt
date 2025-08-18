  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import axios from 'axios';
  import { API } from '../../config';

  // === Helper to get auth header ===
  const getAuthConfig = (getState, json = false) => {
    const { users: { userInfo } } = getState(); // Access state.users.userInfo
    console.log('userInfo in getAuthConfig:', userInfo); // Log userInfo
    if (!userInfo || !userInfo.token) {
      console.error('No userInfo or token in getAuthConfig');
      throw new Error('User not authenticated');
    }
    return {
      headers: {
        ...(json && { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
  };

  // === Thunks ===

  // Login user
  export const login = createAsyncThunk('users/login',
    async ({ email, password }, { rejectWithValue }) => {
      console.log('login thunk called:', { email, password });
      try {
        const { data } = await axios.post(`${API}/signin`, { email, password }, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('login response:', data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('login error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Logout
  export const logout = createAsyncThunk('users/logout',
    async () => {
      console.log('logout thunk called');
      localStorage.removeItem('userInfo');
      document.location.href = '/signin';
    }
  );

  // Register new user
  export const register = createAsyncThunk('users/register',
    async ({ name, email, password }, { rejectWithValue }) => {
      console.log('register thunk called:', { name, email });
      try {
        const { data } = await axios.post(`${API}/signup`, { name, email, password }, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('register response:', data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('register error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Get current user details
  export const getUserDetails = createAsyncThunk('users/getUserDetails',
    async (userId, { getState, rejectWithValue }) => {
      console.log('getUserDetails thunk called:', userId);
      try {
        const config = getAuthConfig(getState);
        console.log('getUserDetails config:', config);
        const { data } = await axios.get(`${API}/user/${userId}`, config);
        console.log('getUserDetails response:', data);
        return data;
      } catch (error) {
        console.error('getUserDetails error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Update own profile
  export const updateUserProfile = createAsyncThunk('users/updateUserProfile',
    async (user, { getState, rejectWithValue }) => {
      console.log('updateUserProfile thunk called:', user);
      try {
        const config = getAuthConfig(getState, true);
        const { users: { userInfo } } = getState(); // Access state.users.userInfo
        console.log('userInfo in updateUserProfile:', userInfo);
        console.log('updateUserProfile config:', config);
        const { data } = await axios.put(`${API}/user/${userInfo._id}`, user, config);
        console.log('updateUserProfile response:', data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('updateUserProfile error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // List all users (admin)
  export const listUsers = createAsyncThunk('users/listUsers',
    async (_, { getState, rejectWithValue }) => {
      console.log('listUsers thunk called');
      try {
        const config = getAuthConfig(getState);
        console.log('listUsers config:', config);
        const { data } = await axios.get(`${API}/users/get`, config);
        console.log('listUsers response:', data);
        return data;
      } catch (error) {
        console.error('listUsers error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Delete user (admin)
  export const deleteUser = createAsyncThunk('users/deleteUser',
    async (id, { getState, rejectWithValue }) => {
      console.log('deleteUser thunk called:', id);
      try {
        const config = getAuthConfig(getState);
        console.log('deleteUser config:', config);
        await axios.delete(`${API}/users/delete/${id}`, config);
        console.log('deleteUser success:', id);
        return id;
      } catch (error) {
        console.error('deleteUser error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Admin update other user's profile
  export const updateUsersProfile = createAsyncThunk('users/updateUsersProfile',
    async (user, { getState, rejectWithValue }) => {
      console.log('updateUsersProfile thunk called:', user);
      try {
        const config = getAuthConfig(getState, true);
        const { users: { userInfo } } = getState(); // Access state.users.userInfo
        console.log('userInfo in updateUsersProfile:', userInfo);
        console.log('updateUsersProfile config:', config);
        const { data } = await axios.put(`${API}/users/update/${user._id}/${userInfo._id}`, user, config);
        console.log('updateUsersProfile response:', data);
        return data;
      } catch (error) {
        console.error('updateUsersProfile error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Admin register new user
  export const usersRegister = createAsyncThunk('users/usersRegister',
    async (details, { getState, rejectWithValue }) => {
      console.log('usersRegister thunk called:', details);
      try {
        const config = getAuthConfig(getState, true);
        const { users: { userInfo } } = getState(); // Access state.users.userInfo
        console.log('userInfo in usersRegister:', userInfo);
        console.log('usersRegister config:', config);
        const { data } = await axios.post(`${API}/register-users/${userInfo._id}`, details, config);
        console.log('usersRegister response:', data);
        return data;
      } catch (error) {
        console.error('usersRegister error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // Admin get other user details
  export const getUsersDetails = createAsyncThunk('users/getUsersDetails',
    async (id, { getState, rejectWithValue }) => {
      console.log('getUsersDetails thunk called:', id);
      try {
        const config = getAuthConfig(getState, true);
        const { users: { userInfo } } = getState(); // Access state.users.userInfo
        console.log('userInfo in getUsersDetails:', userInfo);
        console.log('getUsersDetails config:', config);
        const { data } = await axios.get(`${API}/users/other/${id}/${userInfo._id}`, config);
        console.log('getUsersDetails response:', data);
        return data;
      } catch (error) {
        console.error('getUsersDetails error:', error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

  // === Slice ===

  const usersSlice = createSlice({
    name: 'users',
    initialState: {
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      usersList: [],
      currentUserDetails: null,
      otherUserDetails: null,
      loading: false,
      error: null,
      success: false,
    },
    reducers: {
      resetUsersState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
    },
    extraReducers: (builder) => {
      builder
        // login
        .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
          console.log('userInfo in login.fulfilled:', state.userInfo);
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('login.rejected error:', action.payload);
        })
        // logout
        .addCase(logout.fulfilled, (state) => {
          state.userInfo = null;
          console.log('userInfo in logout.fulfilled:', state.userInfo);
        })
        // register
        .addCase(register.pending, (state) => { state.loading = true; })
        .addCase(register.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
          console.log('userInfo in register.fulfilled:', state.userInfo);
        })
        .addCase(register.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('register.rejected error:', action.payload);
        })
        // get own details
        .addCase(getUserDetails.pending, (state) => { state.loading = true; })
        .addCase(getUserDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.currentUserDetails = action.payload;
          console.log('getUserDetails.fulfilled:', action.payload);
        })
        .addCase(getUserDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('getUserDetails.rejected error:', action.payload);
        })
        // update profile
        .addCase(updateUserProfile.pending, (state) => { state.loading = true; })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
          state.success = true;
          console.log('userInfo in updateUserProfile.fulfilled:', state.userInfo);
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('updateUserProfile.rejected error:', action.payload);
        })
        // list users
        .addCase(listUsers.pending, (state) => { state.loading = true; })
        .addCase(listUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.usersList = action.payload;
          console.log('listUsers.fulfilled:', action.payload);
        })
        .addCase(listUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('listUsers.rejected error:', action.payload);
        })
        // delete user
        .addCase(deleteUser.pending, (state) => { state.loading = true; })
        .addCase(deleteUser.fulfilled, (state, action) => {
          state.loading = false;
          state.usersList = state.usersList.filter(u => u._id !== action.payload);
          console.log('deleteUser.fulfilled:', action.payload);
        })
        .addCase(deleteUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('deleteUser.rejected error:', action.payload);
        })
        // update other user
        .addCase(updateUsersProfile.pending, (state) => { state.loading = true; })
        .addCase(updateUsersProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          console.log('updateUsersProfile.fulfilled:', action.payload); // Fixed typo
        })
        .addCase(updateUsersProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('updateUsersProfile.rejected error:', action.payload);
        })
        // admin register user
        .addCase(usersRegister.pending, (state) => { state.loading = true; })
        .addCase(usersRegister.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          console.log('usersRegister.fulfilled:', action.payload);
        })
        .addCase(usersRegister.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('usersRegister.rejected error:', action.payload);
        })
        // get other user details
        .addCase(getUsersDetails.pending, (state) => { state.loading = true; })
        .addCase(getUsersDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.otherUserDetails = action.payload;
          console.log('getUsersDetails.fulfilled:', action.payload);
        })
        .addCase(getUsersDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.log('getUsersDetails.rejected error:', action.payload);
        });
    },
  });

  export const { resetUsersState } = usersSlice.actions;
  export default usersSlice.reducer;