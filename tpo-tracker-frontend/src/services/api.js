import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Students endpoints
export const studentsAPI = {
  getAllStudents: (filters = {}) => api.get('/students', { params: filters }),
  getStudentById: (id) => api.get(`/students/${id}`),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  createStudent: (data) => api.post('/students', data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

// Applications endpoints
export const applicationsAPI = {
  getAllApplications: (filters = {}) => api.get('/applications', { params: filters }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  createApplication: (data) => api.post('/applications', data),
  updateApplication: (id, data) => api.put(`/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
  getCompanyStats: () => api.get('/applications/company-stats'),
};

// Job posting endpoints
export const jobPostingsAPI = {
  getAllJobPostings: (filters = {}) => api.get('/job-postings', { params: filters }),
  createJobPosting: (data) => api.post('/job-postings', data),
  applyToJobPosting: (id) => api.post(`/job-postings/${id}/apply`),
  updateJobPosting: (id, data) => api.put(`/job-postings/${id}`, data),
  deleteJobPosting: (id) => api.delete(`/job-postings/${id}`),
};

export default api;
