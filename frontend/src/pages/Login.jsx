import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'La contraseña es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      toast.success(`¡Bienvenido, ${data.usuario.nombre}!`);
      navigate('/productos');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Branding */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🛍️</div>
          <h1 style={styles.brandTitle}>VenditaApp</h1>
          <p style={styles.brandSub}>Sistema de Gestión de Productos</p>
        </div>

        <h2 style={styles.title}>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@correo.com"
              className={`form-control ${errors.email ? 'error' : ''}`}
              autoFocus
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className={`form-control ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '.5rem' }}
          >
            {loading ? <><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: 2 }} /> Ingresando...</> : '→ Ingresar'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={styles.link}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F172A 100%)',
    padding: '2rem 1rem',
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '2.5rem',
    width: '100%', maxWidth: 420,
    boxShadow: '0 25px 60px rgba(0,0,0,.3)',
  },
  brand: { textAlign: 'center', marginBottom: '1.75rem' },
  brandIcon: { fontSize: '3rem', marginBottom: '.5rem' },
  brandTitle: {
    fontSize: '1.75rem', fontWeight: 800, margin: 0,
    background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  brandSub: { color: '#64748B', fontSize: '.875rem', marginTop: '.25rem' },
  title: { fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem', color: '#0F172A' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#64748B', fontSize: '.9rem' },
  link: { color: '#6366F1', textDecoration: 'none', fontWeight: 600 },
};

export default Login;
