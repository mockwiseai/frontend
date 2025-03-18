import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '@/services/auth';
import { setUser, setToken, setError, setLoading, logout } from '@/store/authSlice';
import { RootState } from '@/store';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Only try to load user data if we have a token but no user yet
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (storedToken && !user && !isLoading) {
        dispatch(setLoading(true));
        try {
          const response = await authService.getProfile();
          if (response.success) {
            dispatch(setUser(response.data.user));
            // Token is already set in the initialState
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            dispatch(setToken(null));
          }
        } catch (err) {
          console.error('Failed to initialize auth:', err);
          localStorage.removeItem('token');
          dispatch(setToken(null));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    initializeAuth();
  }, []); // Only run on mount

  const login = useCallback(
    async (email: string, password: string, loginType?: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await authService.login(email, password, loginType);
        if (response.success) {
          dispatch(setUser(response.data.user));
          dispatch(setToken(response.data.token));
          localStorage.setItem('token', response.data.token);
          return true;
        }
        dispatch(setError('Invalid credentials'));
        return false;
      } catch (err: any) {
        dispatch(setError(err.response?.data?.message || 'Login failed'));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password?: string,
      loginType?: string
    ) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await authService.register(
          name,
          email,
          password,
          loginType
        );
        if (response.success) {
          dispatch(setUser(response.data.user));
          dispatch(setToken(response.data.token));
          localStorage.setItem('token', response.data.token);
          return true;
        }
        dispatch(setError('Registration failed'));
        return false;
      } catch (err: any) {
        dispatch(
          setError(err.response?.data?.message || 'Registration failed')
        );
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear the state even if the API call fails
      dispatch(logout());
    }
  }, [dispatch]);

  const getProfile = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await authService.getProfile();
      if (response.success) {
        dispatch(setUser(response.data.user));
        return true;
      }
      dispatch(setError('Profile not found'));
      return false;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Profile not found'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
    getProfile,
  };
}