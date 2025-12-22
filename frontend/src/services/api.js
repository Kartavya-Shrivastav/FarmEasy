import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log('=== API INTERCEPTOR ===');
    console.log('Status:', error.response?.status);
    console.log('Skip refresh?', originalRequest.skipAuthRefresh);

    // Check custom flag to skip refresh for auth endpoints
    if (originalRequest.skipAuthRefresh) {
      console.log('Skipping refresh due to skipAuthRefresh flag');
      return Promise.reject(error);
    }

    // Only handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        console.log('Token refresh successful');
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log('REFRESH FAILED');
        localStorage.removeItem('accessToken');

        // Only redirect if not already on auth pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/signup') {
          console.log('Redirecting to /login');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
