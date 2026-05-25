const { Router } = require('express');
const { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto} = require('../controllers/product');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminOStaff } = require('../middlewares/validar-roles');

const upload = require('../middlewares/upload');
const router = Router();

// Ruta pública para ver el catálogo
router.get('/', obtenerProductos);

// Ruta privada para agregar ropa (Pide Token y Rol de Admin o staff)
router.post('/', [ 
    validarJWT, 
    esAdminOStaff, 
    upload.single('imagen')
], crearProducto);

// Ruta privada para actualizar un producto (Pide Token y Rol de Admin o staff)
router.put('/:id', [
    validarJWT,
    esAdminOStaff,
    upload.single('imagen')
], actualizarProducto);

// Ruta privada para eliminar un producto (Pide Token y Rol de Admin o staff)
router.delete('/:id', [
    validarJWT,
    esAdminOStaff
], eliminarProducto);

module.exports = router;