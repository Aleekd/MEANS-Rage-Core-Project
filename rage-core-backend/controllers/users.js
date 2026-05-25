const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');

// FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO

const registrarUsuario = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;

    try {
        // 1. Verificar si el correo ya existe antes de intentar guardar
        const existeEmail = await User.findOne({ correo });
        if (existeEmail) {
            return res.status(400).json({
                msg: 'Ese correo ya está registrado en Rage Core'
            });
        }

        const usuario = new User({ nombre, correo, password, rol });

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();

        res.status(201).json({
            msg: 'Usuario reclutado con éxito',
            usuario
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error crítico al registrar usuario'
        });
    }
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


const actualizarUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    
    
    const { _id, password, ...resto } = req.body; 

    try {
        
        if (password && password.trim() !== '') {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        
        const usuarioActualizado = await User.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: 'Perfil actualizado en la base de datos',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar el perfil' });
    }
};


const eliminarUsuario = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        
        const usuarioBorrado = await User.findByIdAndDelete(id);

        res.status(200).json({
            msg: 'Acceso revocado permanentemente',
            usuario: usuarioBorrado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar operario' });
    }
};


const cambiarPassword = async (req = request, res = response) => {
    const { id } = req.params;
    const { passwordActual, nuevaPassword } = req.body;

    try {
        // Buscamos al usuario en la BD para comparar su contraseña
        const usuario = await User.findById(id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Verificamos que la contraseña actual ingresada coincida con la de la BD
        const validPassword = bcryptjs.compareSync(passwordActual, usuario.password);
        
        if (!validPassword) {
            return res.status(400).json({ msg: 'La contraseña actual es incorrecta' });
        }

        // Encriptamos la nueva contraseña
        const salt = bcryptjs.genSaltSync();
        const nuevaPasswordEncriptada = bcryptjs.hashSync(nuevaPassword, salt);

        // Actualizamos la base de datos
        await User.findByIdAndUpdate(id, { password: nuevaPasswordEncriptada });

        res.status(200).json({
            msg: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al cambiar la contraseña' });
    }
};

const obtenerUsuarios = async (req = request, res = response) => {
    try {
        // Buscamos todos los usuarios, pero podrías filtrar para no mostrar contraseñas
        const usuarios = await User.find().select('-password'); 

        res.status(200).json({
            msg: 'Lista de usuarios obtenida',
            usuarios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener la lista de operarios'
        });
    }
};

module.exports = {
    registrarUsuario,
    login,
    cambiarPassword,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuarios
};