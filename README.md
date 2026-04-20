## Arquitectura

```
tienda-app/
├── backend/                  # Node.js + Express
│   ├── config/
│   │   ├── db.postgres.js    # Conexión PostgreSQL (autenticación)
│   │   └── db.mongo.js       # Conexión MongoDB (productos)
│   ├── controllers/
│   │   ├── authController.js      # Registro, login, perfil
│   │   ├── productoController.js  # CRUD productos
│   │   └── exportController.js    # Generación PDF y XLSX
│   ├── middlewares/
│   │   ├── authMiddleware.js      # Verificación JWT
│   │   └── validateMiddleware.js  # Validaciones express-validator
│   ├── models/
│   │   └── Producto.js       # Esquema Mongoose
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productoRoutes.js
│   │   └── exportRoutes.js
│   ├── .env.example          # Variables de entorno requeridas
│   ├── package.json
│   └── server.js             # Punto de entrada
│
├── frontend/                 # React 18
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Barra de navegación
│       │   ├── PrivateRoute.jsx   # Protección de rutas
│       │   ├── ProductForm.jsx    # Modal crear/editar producto
│       │   └── ConfirmModal.jsx   # Modal confirmar eliminación
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Productos.jsx      # Listado + CRUD completo
│       │   └── Dashboard.jsx      # Estadísticas + exportación
│       ├── services/
│       │   ├── api.js             # Axios + helpers de exportación
│       │   └── AuthContext.js     # Contexto global de sesión
│       ├── styles/
│       │   └── global.css
│       ├── App.js
│       └── index.js
│
├── database/
│   └── init.sql              # Script PostgreSQL
└── .vscode/
    ├── launch.json
    └── extensions.json
```

# VenditaApp — Gestión de Productos

Aplicación web fullstack para administrar el inventario de una tienda. Permite registrarse, iniciar sesión y gestionar productos mediante un CRUD completo, con exportación de reportes en PDF y Excel.

---

## ¿Qué hace esta aplicación?

1. El usuario se registra o inicia sesión (datos guardados en PostgreSQL).
2. Accede al módulo de productos para crear, ver, editar y eliminar artículos (guardados en MongoDB).
3. Puede filtrar productos por nombre, categoría o estado.
4. Desde el Dashboard visualiza estadísticas del inventario.
5. Puede exportar toda la colección de productos en formato PDF o Excel.

---

## Tecnologías utilizadas

### Backend

**Node.js + Express**: 
Servidor y API REST
**PostgreSQL + pg**: 
Almacena usuarios y credenciales
**MongoDB + Mongoose**:
Almacena los productos de la tienda
**bcryptjs**: 
Cifrado de contraseñas
**jsonwebtoken**: 
Autenticación por token JWT
**express-validator**: 
Validación de datos en cada endpoint
**ExcelJS**: 
Generación de archivos `.xlsx` con estilos
**PDFKit**: 
Generación de reportes `.pdf`

### Frontend

**React 18**: 
Interfaz de usuario
**React Router 6**: 
Navegación y rutas protegidas
**Axios**: 
Comunicación con la API
**react-hot-toast**:
Notificaciones visuales

---

## ¿Cómo ejecutarlo?

### Requisitos previos
- Node.js 18+, PostgreSQL 14+, MongoDB 6+

### Pasos

```bash
# 1. Crear la base de datos
psql -U postgres -c "CREATE DATABASE tienda_db;"
psql -U postgres -d tienda_db -f database/init.sql

# 2. Configurar variables de entorno del backend
# Abre .env y completa tus credenciales de PostgreSQL y MongoDB

# 3. Instalar e iniciar el backend (puerto 5000)
cd backend
npm install
npm run dev

# 4. En otra terminal, instalar e iniciar el frontend (puerto 3000)
cd frontend
npm install
npm start
```

Abre `http://localhost:3000` en el navegador.

---

## Endpoints principales de la API

```
POST   /api/auth/register       → Crear cuenta
POST   /api/auth/login          → Iniciar sesión

GET    /api/productos            → Listar (filtros + paginación)
POST   /api/productos            → Crear producto
PUT    /api/productos/:id        → Editar producto
DELETE /api/productos/:id        → Eliminar producto

GET    /api/export/xlsx          → Descargar reporte Excel
GET    /api/export/pdf           → Descargar reporte PDF
```

Todos los endpoints de productos y exportación requieren el header:
```
Authorization: Bearer <token>
```

---

## 👤 Camilo
Proyecto académico desarrollado con arquitectura híbrida (SQL + NoSQL), API REST y frontend moderno en React.

---
