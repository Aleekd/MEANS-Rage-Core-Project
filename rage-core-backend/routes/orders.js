const { Router } = require('express');
const { obtenerOrdenes, crearOrden } = require('../controllers/ordenes');
//validacion de token
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

//Ruta para ver historia de compras (pide estar logeado)
router.get('/', [validarJWT], obtenerOrdenes);
//Ruta para procesar el carrito/comprar (pide estar logeado)
router.post('/', [validarJWT], crearOrden);

module.exports = router;