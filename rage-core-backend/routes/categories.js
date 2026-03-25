const { Router } = require('express');
const { obtenerCategorias, crearCategoria } = require('../controllers/categories');

//importamos los middleware
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

//ruta para ver categorias (cualquier visitante)
router.get('/', obtenerCategorias);
//ruta para crear categorias (protegido: pide token y rol de admin)
router.post('/', [validarJWT, esAdminRole ], crearCategoria);

module.exports = router;
