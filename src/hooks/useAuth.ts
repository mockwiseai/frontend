import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '@/services/auth';
import { setUser, setToken, setError, setLoading } from '@/store/authSlice';
import { RootState } from '@/store';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string, loginType?: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await authService.login(email, password, loginType);
        if (response.success) {
          dispatch(setUser(response.data.user));
          dispatch(setToken(response.data.token));
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
          return true;
        }

        dispatch(setError('Registration failed'));
        // return false;
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

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(setUser(null));
      dispatch(setToken(null));
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
