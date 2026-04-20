import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Interceptor: adjuntar JWT ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor: manejar errores globales ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  perfil:   ()     => api.get('/auth/perfil'),
};

// ── Productos ─────────────────────────────────────────────────────────────
export const productosAPI = {
  listar:     (params) => api.get('/productos', { params }),
  obtener:    (id)     => api.get(`/productos/${id}`),
  crear:      (data)   => api.post('/productos', data),
  actualizar: (id, data) => api.put(`/productos/${id}`, data),
  eliminar:   (id)     => api.delete(`/productos/${id}`),
  categorias: ()       => api.get('/productos/categorias'),
};

// ── Exportación ───────────────────────────────────────────────────────────
export const exportAPI = {
  xlsx: () => api.get('/export/xlsx', { responseType: 'blob' }),
  pdf:  () => api.get('/export/pdf',  { responseType: 'blob' }),
};

// Helper: descargar blob
export const descargarArchivo = (blob, nombreArchivo) => {
  const url = window.URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default api;
