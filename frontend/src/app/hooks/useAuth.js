import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setUser, clearUser } from '../features/auth/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          dispatch(setUser(data.user));
          return data.user;
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        dispatch(clearUser());
      }
    }
    return null;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      dispatch(clearUser());
      navigate('/');
    }
  };

  const requireAuth = (redirectTo = '/login') => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  const requireRole = (role, redirectTo = '/') => {
    if (!isAuthenticated || user?.role !== role) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    checkAuth,
    logout,
    requireAuth,
    requireRole,
  };
};
