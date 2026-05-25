const { response, request} = require('express');

// CADENERO NIVEL 1: Acceso Absoluto 
const esAdminRole = (req = request, res = response, next ) => {
    if (!req.usuarioAutenticado) {
        return res.status(500).json({ msg: 'Se quiere verificar el rol sin validar el token primero' });
    }

    const { rol, nombre }= req.usuarioAutenticado;

    if (rol !== 'admin') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - Acceso denegado a nivel superior`
        });
    }

    next();
};

// 🛡️ CADENERO NIVEL 2: Acceso Operativo (admin y equipo de Staff)
const esAdminOStaff = (req = request, res = response, next) => {
    if (!req.usuarioAutenticado) {
        return res.status(500).json({ msg: 'Se quiere verificar el rol sin validar el token primero' });
    }

    const { rol, nombre } = req.usuarioAutenticado;

    // Si no es admin Y tampoco es staff, lo pateamos
    if (rol !== 'admin' && rol !== 'staff') {
        return res.status(401).json({
            msg: `${nombre} no tiene permisos de operario de RageCore`
        });
    }

    next();
};

// Exportamos ambos cadeneros
module.exports = { 
    esAdminRole, 
    esAdminOStaff 
};