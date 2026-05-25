const { Router } = require('express');
const {obtenerCupones, crearCupon, actualizarCupon, eliminarCupon, validarCupon} = require('../controllers/coupons');
const {validarJWT} = require('../middlewares/validar-jwt');
const {esAdminRole} = require('../middlewares/validar-roles');

const router = Router();

//Ruta para ver todos los cupones
router.get('/', obtenerCupones);
//Ruta para crear un cupon (pide token y rol admin)
router.post('/',[validarJWT, esAdminRole], crearCupon);
//Ruta para actualizar un cupon (pide token y rol admin)
router.put('/:id',[validarJWT, esAdminRole], actualizarCupon);
//Ruta para eliminar un cupon (pide token y rol admin)
router.delete('/:id',[validarJWT, esAdminRole], eliminarCupon);
//Ruta para validar un cupon (pide token)
router.get('/validar/:codigo', validarCupon);

module.exports = router;