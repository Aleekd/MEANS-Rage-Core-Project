const { Router } = require('express');
const { registrarUsuario, login, actualizarUsuario, cambiarPassword, obtenerUsuarios, eliminarUsuario } = require('../controllers/users');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();


router.post('/', [validarJWT, esAdminRole], registrarUsuario);

router.post('/login', login);
router.put('/:id/seguridad', [validarJWT], cambiarPassword);
router.put('/:id', [validarJWT, esAdminRole], actualizarUsuario);
router.get('/', [validarJWT, esAdminRole], obtenerUsuarios);
router.delete('/:id', [validarJWT, esAdminRole], eliminarUsuario);
router.delete('/:id', [validarJWT, esAdminRole], eliminarUsuario);

module.exports = router;