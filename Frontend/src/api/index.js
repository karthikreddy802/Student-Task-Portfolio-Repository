import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/token/', credentials),
  register: (userData) => api.post('/register/', userData),
  refresh: (refresh) => api.post('/token/refresh/', { refresh }),
};

export const taskApi = {
  getAll: () => api.get('/tasks/'),
  getById: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post('/tasks/', data),
};

export const submissionApi = {
  getAll: () => api.get('/submissions/'),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/submissions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api;
