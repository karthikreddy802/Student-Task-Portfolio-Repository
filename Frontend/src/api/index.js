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
  passwordReset: (data) => api.post('/password-reset/', data),
};

export const taskApi = {
  getAll: () => api.get('/tasks/'),
  getById: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post('/tasks/', data),
  suggestDescription: (data) => api.post('/suggest-task-description/', data),
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
  getMine: (userId) => api.get(`/portfolios/?user_id=${userId}`),
  update: (id, data) => {
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
    return api.patch(`/portfolios/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getPublic: (username) => api.get(`/public-portfolio/${username}/`),
};
export const notificationApi = {
  getAll: (userId) => api.get(`/notifications/${userId ? `?user_id=${userId}` : ''}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/`, { is_read: true }),
};

export const userApi = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  update: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

export default api;
