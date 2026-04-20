import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        {/* Logo */}
        <Link to="/productos" style={styles.logo}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>VenditaApp</span>
        </Link>

        {/* Links desktop */}
        <div style={styles.links}>
          <Link
            to="/productos"
            style={{ ...styles.link, ...(isActive('/productos') ? styles.linkActive : {}) }}
          >
            📦 Productos
          </Link>
          <Link
            to="/dashboard"
            style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}
          >
            📊 Dashboard
          </Link>
        </div>

        {/* Usuario */}
        <div style={styles.userArea}>
          <div style={styles.userChip}>
            <div style={styles.avatar}>{usuario?.nombre?.[0]?.toUpperCase() || 'U'}</div>
            <span style={styles.userName}>{usuario?.nombre}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Salir
          </button>
        </div>

        {/* Menú hamburguesa (mobile) */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/productos" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>📦 Productos</Link>
          <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
          <button onClick={handleLogout} style={styles.mobileLinkBtn}>🚪 Cerrar Sesión</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: '#0F172A',
    boxShadow: '0 2px 12px rgba(0,0,0,.25)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '.5rem',
    textDecoration: 'none', color: '#fff',
    fontSize: '1.125rem', fontWeight: 800,
  },
  logoIcon: { fontSize: '1.5rem' },
  logoText: { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  links: { display: 'flex', gap: '.25rem' },
  link: {
    padding: '.5rem .875rem', borderRadius: 8,
    textDecoration: 'none', color: '#94A3B8',
    fontSize: '.875rem', fontWeight: 500,
    transition: 'all .2s',
  },
  linkActive: { background: 'rgba(99,102,241,.2)', color: '#818CF8' },
  userArea: { display: 'flex', alignItems: 'center', gap: '.75rem' },
  userChip: { display: 'flex', alignItems: 'center', gap: '.5rem' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    color: '#fff', fontWeight: 700, fontSize: '.875rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  userName: { color: '#CBD5E1', fontSize: '.875rem', fontWeight: 500 },
  logoutBtn: {
    background: 'rgba(220,38,38,.15)', color: '#FCA5A5',
    border: '1px solid rgba(220,38,38,.3)', borderRadius: 8,
    padding: '.4rem .875rem', cursor: 'pointer',
    fontSize: '.8125rem', fontWeight: 600, transition: 'all .2s',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: '#fff', fontSize: '1.5rem', cursor: 'pointer',
    '@media(max-width:768px)': { display: 'block' },
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column',
    background: '#1E293B', borderTop: '1px solid #334155',
    padding: '.75rem 1.5rem',
  },
  mobileLink: {
    color: '#94A3B8', textDecoration: 'none',
    padding: '.75rem 0', borderBottom: '1px solid #334155',
    fontSize: '.9375rem',
  },
  mobileLinkBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#FCA5A5', textAlign: 'left', padding: '.75rem 0',
    fontSize: '.9375rem',
  },
};

export default Navbar;
