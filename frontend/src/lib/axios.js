import axios from 'axios';
import { mapApiError } from './apiErrors';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shortify_access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(mapApiError(error))
);

export default api;
