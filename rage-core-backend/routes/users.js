const { Router } = require('express');
const { registrarUsuario, login } = require('../controllers/users');
const router = Router();


// RUTA PARA REGISTRAR USUARIO
router.post('/', registrarUsuario);

// RUTA PARA LOGIN
router.post('/login', login);

module.exports = router;