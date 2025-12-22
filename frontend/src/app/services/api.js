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

    console.log('=== API INTERCEPTOR DEBUG ===');
    console.log('Error status:', error.response?.status);
    console.log('Request URL:', originalRequest?.url);
    console.log('Full URL:', originalRequest?.baseURL + originalRequest?.url);

    // Check if this is an auth endpoint - be more flexible with the check
    const url = originalRequest?.url || '';
    const isAuthEndpoint = 
      url.includes('login') ||
      url.includes('signup') ||
      url.includes('verify-email') ||
      url.endsWith('/auth/login') ||
      url.endsWith('/auth/signup');

    console.log('Is auth endpoint?', isAuthEndpoint);

    // Only handle token refresh for non-auth endpoints
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
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
        console.log('REFRESH FAILED, PATH =', window.location.pathname);
        localStorage.removeItem('accessToken');

        // Only redirect if not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          console.log('REDIRECTING TO /login FROM INTERCEPTOR');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    console.log('Skipping interceptor, passing error through');
    // For auth endpoints or other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
