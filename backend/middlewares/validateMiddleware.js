const { body } = require('express-validator');

// ── Validaciones de autenticación ──────────────────────────────────────────
const validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El formato del email es inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El formato del email es inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

// ── Validaciones de productos ──────────────────────────────────────────────
const validarProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del producto es obligatorio')
    .isLength({ max: 150 }).withMessage('El nombre no puede superar 150 caracteres'),

  body('categoria')
    .trim()
    .notEmpty().withMessage('La categoría es obligatoria'),

  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un entero no negativo'),

  body('estado')
    .optional()
    .isIn(['activo', 'inactivo', 'agotado']).withMessage('Estado inválido'),

  body('descripcion')
    .optional()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres'),
];

module.exports = { validarRegistro, validarLogin, validarProducto };
