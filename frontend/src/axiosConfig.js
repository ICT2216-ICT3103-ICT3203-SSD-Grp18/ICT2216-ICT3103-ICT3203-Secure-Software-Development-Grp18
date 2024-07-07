import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://ticketinghuat.ninja/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies with requests
});

// Request interceptor to add CSRF token
apiClient.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'delete'].includes(config.method)) {
      try {
        const csrfResponse = await axios.get('https://ticketinghuat.ninja/api/csrf-token', { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        config.headers['CSRF-Token'] = csrfToken;
      } catch (error) {
        console.error('Error fetching CSRF token', error);
        throw error;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      document.cookie = 'token=; Max-Age=0';
      if (typeof error.config.onSessionInvalidated === 'function') {
        error.config.onSessionInvalidated();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
