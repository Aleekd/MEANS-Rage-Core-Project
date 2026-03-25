const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');

// FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO

const registrarUsuario = async (req = request, res = response) => {
    // aquí se obtienen los datos que nos enviarán desde Angular o Postman en el body 
    const { nombre, correo, password, rol }= req.body;

    // creamos un nuevo objeto utilizando el modelo creado a partir del Schema
    const usuario = new User({ nombre, correo, password, rol });

    // Encriptamos la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password , salt);

    // Guardamos el elemento en la base de datos de Mongo
    await usuario.save();

    // regresamos una respuest JSON 
    res.status(201).json({
        msg: 'Usuario creado con éxito',
        usuario
    });
};


// FUNCION PARA HACER LOGIN
const login = async (req = request, res = response ) => {
    const { correo, password } = req.body;

    try {
        // Buscamos si existe el usuario con ese correo
        const usuario = await User.findOne({ correo });
        if(!usuario) {
            return res.status(400).json({
                msg:'Usuario o Password no son correctos - correo'
            });
        }

        // Comparamos la contraseña que nos mandan con la contraseña encriptada de la BD
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o Password no son correctos - password'
            });
        }

        const token = await generarJWT(usuario.id);

        // Enviamos la respuesta al cliente con su token
        res.status(200).json({
            msg: 'Login exitoso',
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        });
    }
};

module.exports = {
    registrarUsuario,
    login
};