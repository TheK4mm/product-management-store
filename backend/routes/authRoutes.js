const express = require('express');
const router  = express.Router();

const { register, login, perfil }      = require('../controllers/authController');
const { authMiddleware }               = require('../middlewares/authMiddleware');
const { validarRegistro, validarLogin } = require('../middlewares/validateMiddleware');

// POST /api/auth/register
router.post('/register', validarRegistro, register);

// POST /api/auth/login
router.post('/login', validarLogin, login);

// GET  /api/auth/perfil  (protegida)
router.get('/perfil', authMiddleware, perfil);

module.exports = router;
