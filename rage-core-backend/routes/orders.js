const { Router } = require('express');
const { 
    obtenerOrdenes, 
    obtenerMisOrdenes, 
    crearOrden, 
    actualizarEstado 
} = require('../controllers/ordenes');

// Validación de token
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// ========================================================
// RUTAS DEL CLIENTE (Rage Core Users)
// ========================================================

// Crear una nueva orden (Checkout del carrito)
router.post('/', [validarJWT], crearOrden);

// Ver el historial personal de compras del cliente
router.get('/mis-ordenes', [validarJWT], obtenerMisOrdenes);


// ========================================================
// RUTAS DEL ADMINISTRADOR (Command Center)
// ========================================================

// Ver absolutamente todas las órdenes de la tienda

router.get('/', [validarJWT], obtenerOrdenes);

// Actualizar el estado de la orden (ej. de 'Pendiente' a 'Enviado')
router.put('/:id/estado', [validarJWT], actualizarEstado);

module.exports = router;