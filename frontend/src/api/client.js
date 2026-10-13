import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';

const client = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if not already on login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const authApi = {
  login: (email, password) => client.post('/auth/login-json', { email, password }),
  register: (userData) => client.post('/auth/register', userData),
  getMe: () => client.get('/auth/me'),
  updateMe: (userData) => client.put('/auth/me', userData),
};

export const applicationsApi = {
  getAll: (params) => client.get('/applications', { params }),
  getStats: () => client.get('/applications/stats/summary'),
  getById: (id) => client.get(`/applications/${id}`),
  create: (data) => client.post('/applications', data),
  update: (id, data) => client.put(`/applications/${id}`, data),
  delete: (id) => client.delete(`/applications/${id}`),
};

export const prepApi = {
  getDSA: (params) => client.get('/prep/dsa', { params }),
  updateDSAProgress: (problemId, data) => client.put(`/prep/dsa/problems/${problemId}/progress`, data),
  
  getSQL: (params) => client.get('/prep/sql', { params }),
  updateSQLProgress: (problemId, data) => client.put(`/prep/sql/problems/${problemId}/progress`, data),

  getAptitude: (params) => client.get('/prep/aptitude', { params }),
  updateAptitudeProgress: (topicId, data) => client.put(`/prep/aptitude/topics/${topicId}/progress`, data),

  getCore: (params) => client.get('/prep/core', { params }),
  updateCoreProgress: (topicId, data) => client.put(`/prep/core/topics/${topicId}/progress`, data),
};

export const dashboardApi = {
  getStats: () => client.get('/dashboard/stats'),
};

export default client;
