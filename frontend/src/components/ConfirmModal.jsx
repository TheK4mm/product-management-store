import React from 'react';

const ConfirmModal = ({ visible, producto, onConfirm, onCancel, loading }) => {
  if (!visible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
          <h3 style={{ marginBottom: '.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
            ¿Eliminar producto?
          </h3>
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
            Estás a punto de eliminar <strong>"{producto?.nombre}"</strong>.<br />
            Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: '.9rem', height: '.9rem', borderWidth: 2 }} /> Eliminando...</>
                : '🗑️ Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
