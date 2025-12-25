import axios from "axios";

// API URL Configuration for Vercel deployment
// In production (Vercel), use relative path to serverless functions
// In development, use localhost
const API_BASE_URL = import.meta.env.PROD 
  ? "/api"  // Production: relative path on Vercel
  : import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "http://localhost:5000/api"; // Development: localhost

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data)
};

// Users API
export const userAPI = {
  getAll: () => api.get("/users/public")
};

// Incidents API
export const incidentAPI = {
  create: (data) => api.post("/incidents", data),
  getAll: () => api.get("/incidents"),
  getMy: () => api.get("/incidents/my"),
  getPublic: () => api.get("/incidents/public"),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`)
};

// Events API
export const eventAPI = {
  create: (data) => api.post("/events", data),
  getAll: () => api.get("/events"),
  getPublic: () => api.get("/events/public"),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`)
};

// Guidelines API
export const guidelineAPI = {
  create: (data) => api.post("/guidelines", data),
  getAll: () => api.get("/guidelines"),
  getPublic: () => api.get("/guidelines/public"),
  delete: (id) => api.delete(`/guidelines/${id}`)
};

// Contact API
export const contactAPI = {
  send: (data) => api.post("/contact", data),
  getAll: () => api.get("/contact"),
  delete: (id) => api.delete(`/contact/${id}`)
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getUser: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

export default api;
