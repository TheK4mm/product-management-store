import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]     = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';

    if (!form.email.trim()) e.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';

    if (!form.password) e.password = 'La contraseña es obligatoria';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';

    if (!form.confirmar) e.confirmar = 'Confirma tu contraseña';
    else if (form.password !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await authAPI.register({
        nombre:   form.nombre,
        email:    form.email,
        password: form.password,
      });
      login(data);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/productos');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrarse';
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
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🛍️</div>
          <h1 style={styles.brandTitle}>VenditaApp</h1>
          <p style={styles.brandSub}>Crea tu cuenta gratuita</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className={`form-control ${errors.nombre ? 'error' : ''}`}
              autoFocus
            />
            {errors.nombre && <span className="form-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              className={`form-control ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mín. 6 caracteres"
                className={`form-control ${errors.password ? 'error' : ''}`}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar</label>
              <input
                type="password"
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className={`form-control ${errors.confirmar ? 'error' : ''}`}
              />
              {errors.confirmar && <span className="form-error">{errors.confirmar}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '.5rem' }}
          >
            {loading
              ? <><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: 2 }} /> Creando cuenta...</>
              : '✓ Crear Cuenta'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={styles.link}>Inicia sesión</Link>
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
    background: '#fff', borderRadius: 20,
    padding: '2.5rem', width: '100%', maxWidth: 480,
    boxShadow: '0 25px 60px rgba(0,0,0,.3)',
  },
  brand: { textAlign: 'center', marginBottom: '1.5rem' },
  brandIcon: { fontSize: '2.5rem', marginBottom: '.4rem' },
  brandTitle: {
    fontSize: '1.6rem', fontWeight: 800, margin: 0,
    background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  brandSub: { color: '#64748B', fontSize: '.875rem', marginTop: '.2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#64748B', fontSize: '.9rem' },
  link: { color: '#6366F1', textDecoration: 'none', fontWeight: 600 },
};

export default Register;
