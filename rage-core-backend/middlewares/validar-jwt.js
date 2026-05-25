const { response, request } = require ('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
   
    let token = req.header('Authorization');
    
    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]; 
    }

    try {
        // verificamos el token con la misma llave secreta
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        // Buscamos al usuario dueño del token
        const usuario = await User.findById(uid);

        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en BD'
            });
        }
        
        
        req.usuarioAutenticado = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

module.exports = { validarJWT };