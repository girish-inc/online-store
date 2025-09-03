import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Helper function to set user info in local storage
const setUserToStorage = (userData) => {
  localStorage.setItem('userInfo', JSON.stringify(userData));
};

// Helper function to remove user info from local storage
const removeUserFromStorage = () => {
  localStorage.removeItem('userInfo');
};

// Get user from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Async thunks for user actions
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        '/api/users/login',
        { email, password }
      );

      setUserToStorage(data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        '/api/users/register',
        { name, email, password }
      );

      setUserToStorage(data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users/profile');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/api/users/profile', userData);
      setUserToStorage(data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      
      // Check if userInfo exists
      if (!user.userInfo || !user.userInfo.refreshToken) {
        throw new Error('No refresh token available');
      }

      // We need to manually set the Authorization header for refresh token
      // since the api interceptor uses the access token by default
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo.refreshToken}`,
        },
      };

      const { data } = await api.post('/api/users/refresh-token', {}, config);
      
      // Update user info with new tokens
      const updatedUserInfo = {
        ...user.userInfo,
        token: data.token,
        refreshToken: data.refreshToken,
      };
      
      setUserToStorage(updatedUserInfo);
      return updatedUserInfo;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);


const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  userProfile: null,
  success: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      removeUserFromStorage();
      state.userInfo = null;
      state.userProfile = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.userProfile = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If token refresh fails, log the user out
        removeUserFromStorage();
        state.userInfo = null;
        state.userProfile = null;
      });
  },
});

export const { logout, clearError, resetSuccess } = userSlice.actions;
export default userSlice.reducer;