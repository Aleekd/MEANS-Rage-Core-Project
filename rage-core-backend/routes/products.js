const { Router } = require('express');
const { obtenerProductos, crearProducto } = require('../controllers/product');

const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

// Ruta pública para ver el catálogo
router.get('/', obtenerProductos);

// Ruta privada para agregar ropa (Pide Token y Rol de Admin)
router.post('/', [ validarJWT, esAdminRole ], crearProducto);

module.exports = router;