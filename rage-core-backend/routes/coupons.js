const { Router } = require('express');
const {obtenerCupones, crearCupon} = require('../controllers/coupons');
const {validarJWT} = require('../middlewares/validar-jwt');
const {esAdminRole} = require('../middlewares/validar-roles');

const router = Router();

//Ruta para ver todos los cupones
router.get('/', obtenerCupones);
//Ruta para crear un cupon (pide token y rol admin)
router.post('/',[validarJWT, esAdminRole], crearCupon);


module.exports = router;