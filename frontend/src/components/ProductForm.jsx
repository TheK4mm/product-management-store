import React, { useState, useEffect } from 'react';

const CATEGORIAS_DEFAULT = [
  'Electrónica', 'Ropa y Moda', 'Hogar', 'Alimentos', 'Deportes',
  'Juguetes', 'Libros', 'Salud y Belleza', 'Automotriz', 'Otro',
];

const initialForm = {
  nombre: '', descripcion: '', categoria: '',
  precio: '', stock: '0', estado: 'activo', imagenUrl: '',
};

const ProductForm = ({ visible, producto, onClose, onSave }) => {
  const [form, setForm]     = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!producto;

  useEffect(() => {
    if (visible) {
      setForm(producto
        ? { ...producto, precio: String(producto.precio), stock: String(producto.stock) }
        : initialForm
      );
      setErrors({});
    }
  }, [visible, producto]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Nombre obligatorio';
    if (!form.categoria.trim()) e.categoria = 'Categoría obligatoria';
    if (form.precio === '' || isNaN(Number(form.precio))) e.precio = 'Precio inválido';
    else if (Number(form.precio) < 0) e.precio = 'El precio no puede ser negativo';
    if (form.stock !== '' && isNaN(Number(form.stock))) e.stock = 'Stock inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({
        ...form,
        precio: parseFloat(form.precio),
        stock:  parseInt(form.stock || '0', 10),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">Nombre del Producto *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                className={`form-control ${errors.nombre ? 'error' : ''}`}
                placeholder="Ej: Camiseta Polo Premium" />
              {errors.nombre && <span className="form-error">{errors.nombre}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                className="form-control" rows={3}
                placeholder="Describe el producto..."
                style={{ resize: 'vertical', minHeight: 80 }} />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select name="categoria" value={form.categoria} onChange={handleChange}
                className={`form-control ${errors.categoria ? 'error' : ''}`}>
                <option value="">— Selecciona —</option>
                {CATEGORIAS_DEFAULT.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria && <span className="form-error">{errors.categoria}</span>}
            </div>

            {/* Precio y Stock */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Precio (USD) *</label>
                <input type="number" name="precio" value={form.precio} onChange={handleChange}
                  className={`form-control ${errors.precio ? 'error' : ''}`}
                  placeholder="0.00" step="0.01" min="0" />
                {errors.precio && <span className="form-error">{errors.precio}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  className={`form-control ${errors.stock ? 'error' : ''}`}
                  placeholder="0" min="0" step="1" />
                {errors.stock && <span className="form-error">{errors.stock}</span>}
              </div>
            </div>

            {/* Estado */}
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="form-control">
                <option value="activo">✅ Activo</option>
                <option value="inactivo">⚫ Inactivo</option>
                <option value="agotado">🔴 Agotado</option>
              </select>
            </div>

            {/* URL de imagen */}
            <div className="form-group">
              <label className="form-label">URL de Imagen (opcional)</label>
              <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange}
                className="form-control" placeholder="https://ejemplo.com/imagen.jpg" />
            </div>

            {/* Preview imagen */}
            {form.imagenUrl && (
              <div style={{ textAlign: 'center' }}>
                <img src={form.imagenUrl} alt="preview"
                  style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: '.9rem', height: '.9rem', borderWidth: 2 }} /> Guardando...</>
                : isEdit ? '💾 Actualizar' : '✓ Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
