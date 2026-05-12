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
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.post('/submissions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => api.patch(`/submissions/${id}/`, data),
  delete: (id) => api.delete(`/submissions/${id}/`),
};
export const portfolioApi = {
  generate: (data) => api.post('/generate-portfolio/', data),
};
export const notificationApi = {
  getAll: (userId) => api.get(`/notifications/${userId ? `?user_id=${userId}` : ''}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/`, { is_read: true }),
};

export default api;
