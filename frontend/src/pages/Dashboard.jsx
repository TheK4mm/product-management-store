import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { productosAPI, exportAPI, descargarArchivo } from '../services/api';
import { useAuth } from '../services/AuthContext';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{value}</div>
        <div style={{ fontWeight: 600, color: '#0F172A' }}>{label}</div>
        {sub && <div style={{ fontSize: '.8125rem', color: '#64748B', marginTop: '.15rem' }}>{sub}</div>}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [{ data: all }, { data: activos }, { data: agotados }, { data: cats }] =
          await Promise.all([
            productosAPI.listar({ limite: 1000 }),
            productosAPI.listar({ estado: 'activo', limite: 1000 }),
            productosAPI.listar({ estado: 'agotado', limite: 1000 }),
            productosAPI.categorias(),
          ]);

        const valorInventario = all.productos.reduce((s, p) => s + p.precio * p.stock, 0);
        const precioPromedio  = all.total > 0
          ? all.productos.reduce((s, p) => s + p.precio, 0) / all.total
          : 0;

        // Top 5 por precio
        const top5 = [...all.productos]
          .sort((a, b) => b.precio - a.precio)
          .slice(0, 5);

        // Por categoría
        const porCategoria = {};
        all.productos.forEach(p => {
          porCategoria[p.categoria] = (porCategoria[p.categoria] || 0) + 1;
        });

        setStats({
          total:       all.total,
          activos:     activos.total,
          agotados:    agotados.total,
          categorias:  cats.categorias.length,
          valorInventario,
          precioPromedio,
          top5,
          porCategoria,
          recientes: [...all.productos]
            .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
            .slice(0, 5),
        });
      } catch {
        toast.error('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async (tipo) => {
    setExportLoading(tipo);
    try {
      const { data } = tipo === 'xlsx' ? await exportAPI.xlsx() : await exportAPI.pdf();
      const ext  = tipo === 'xlsx' ? 'xlsx' : 'pdf';
      const mime = tipo === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
      descargarArchivo(new Blob([data], { type: mime }), `reporte_${Date.now()}.${ext}`);
      toast.success(`Reporte ${ext.toUpperCase()} descargado`);
    } catch {
      toast.error('Error al exportar');
    } finally {
      setExportLoading('');
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              👋 Bienvenido, {usuario?.nombre}
            </h1>
            <p style={{ color: '#64748B', marginTop: '.25rem' }}>
              Panel de control — {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <button className="btn btn-outline"
              onClick={() => handleExport('pdf')} disabled={!!exportLoading}>
              {exportLoading === 'pdf' ? '...' : '📄 Exportar PDF'}
            </button>
            <button className="btn btn-primary"
              onClick={() => handleExport('xlsx')} disabled={!!exportLoading}>
              {exportLoading === 'xlsx' ? '...' : '📊 Exportar Excel'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-center"><div className="spinner spinner-lg" /></div>
        ) : stats && (
          <>
            {/* KPIs */}
            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <StatCard icon="📦" label="Total Productos"  value={stats.total}          color="#6366F1" sub="en inventario" />
              <StatCard icon="✅" label="Activos"          value={stats.activos}        color="#16A34A" sub="disponibles" />
              <StatCard icon="🔴" label="Agotados"         value={stats.agotados}       color="#DC2626" sub="sin stock" />
              <StatCard icon="🏷️" label="Categorías"       value={stats.categorias}     color="#D97706" sub="diferentes" />
              <StatCard icon="💰" label="Valor Inventario" value={`$${stats.valorInventario.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`} color="#0EA5E9" sub="precio × stock" />
              <StatCard icon="📈" label="Precio Promedio"  value={`$${stats.precioPromedio.toFixed(2)}`} color="#8B5CF6" sub="por producto" />
            </div>

            <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'start' }}>
              {/* Productos por categoría */}
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📊 Por Categoría</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {Object.entries(stats.porCategoria)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([cat, count]) => {
                      const pct = Math.round((count / stats.total) * 100);
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem' }}>
                            <span style={{ fontSize: '.875rem', fontWeight: 500 }}>{cat}</span>
                            <span style={{ fontSize: '.8125rem', color: '#64748B' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ background: '#F1F5F9', borderRadius: 4, height: 8 }}>
                            <div style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#6366F1,#8B5CF6)', height: '100%', borderRadius: 4, transition: 'width .5s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Top productos por precio */}
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🏆 Top 5 por Precio</h3>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  {stats.top5.map((p, i) => (
                    <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.875rem 1.25rem', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#FEF3C7' : '#F1F5F9', color: i === 0 ? '#D97706' : '#64748B', fontWeight: 800, fontSize: '.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{p.nombre}</div>
                        <div style={{ fontSize: '.775rem', color: '#64748B' }}>{p.categoria}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#6366F1' }}>${p.precio.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recientes */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🕐 Productos Recientes</h3>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recientes.map(p => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                        <td><span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '.2rem .65rem', borderRadius: 20, fontSize: '.75rem', fontWeight: 600 }}>{p.categoria}</span></td>
                        <td style={{ fontWeight: 700, color: '#6366F1' }}>${p.precio.toFixed(2)}</td>
                        <td>{p.stock}</td>
                        <td><span className={`badge badge-${p.estado}`}>{p.estado}</span></td>
                        <td style={{ fontSize: '.8rem', color: '#64748B' }}>{new Date(p.fechaRegistro).toLocaleDateString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;
