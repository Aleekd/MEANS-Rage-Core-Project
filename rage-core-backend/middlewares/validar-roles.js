const { response, request} = require('express');
const esAdminRole = (req = request, res = response, next ) => {
    // verificamos que el middleware anterior haya echo su trabajo
    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin valida el token primero'
        });
    }

    const { rol, nombre }= req.usuarioAutenticado;

    // Revisamos si no es el administrador
    if (rol !== 'admin') {
        return res.status(401).json({
            msg: `${nombre } no es administrador - No tienes permisos para esto`
        });
    }

    next();
};

module.exports = { esAdminRole };