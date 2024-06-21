import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5500/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies with requests
});

// Request interceptor to add common headers if needed
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 403) {
      // Clear the cookies
      document.cookie = 'token=; Max-Age=0'; 
      
      // Update the isLoggedIn state to false
      if (typeof window.updateLoginStatus === 'function') {
        window.updateLoginStatus(false);
      }

      // Redirect to the login page or landing page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
