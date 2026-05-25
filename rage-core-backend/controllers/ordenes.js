const { response, request } = require('express');
const Orden = require('../models/order');

// 1. Ver TODAS las órdenes (Para el panel del Administrador)
const obtenerOrdenes = async (req = request, res = response) => {
    const ordenes = await Orden.find()
        .populate('usuario', 'nombre correo')
        .populate('productos.producto', 'nombre precio imagen')
        .sort({ fecha: -1 }); 
        
    res.json({ ordenes });
};

// 2. Ver MIS órdenes (Para el panel del Cliente - Historial)
const obtenerMisOrdenes = async (req = request, res = response) => {
    const usuarioId = req.usuarioAutenticado._id;

    const ordenes = await Orden.find({ usuario: usuarioId })
        .populate('productos.producto', 'nombre precio imagen')
        .sort({ fecha: -1 });

    res.json({ ordenes });
};

// 3. Crear una nueva orden (Checkout)
const crearOrden = async (req = request, res = response ) => {
    try {
        
        const { productos, total, direccion } = req.body;
        
        // sacar token de usuario para no pedir que valide su id
        const usuario = req.usuarioAutenticado._id;

        // Preparamos la orden
        const data = {
            usuario,
            productos,
            total,
            direccion 
        };

        const orden = new Orden(data);
        await orden.save(); // ¡Ahora Mongoose sí tiene todo lo que exige!

        res.status(201).json({
            msg: '¡Orden de Rage Core creada con éxito!',
            orden
        });
    } catch (error) {
        // Si Mongoose rechaza la orden, este escudo evita que el servidor se caiga
        console.log("ERROR EN EL BÚNKER (crearOrden):", error);
        res.status(500).json({
            msg: 'Error interno al crear la orden. Revisa la consola del servidor.',
            error
        });
    }
};

// 4. Actualizar Estado de la Orden (Para el Administrador)
const actualizarEstado = async (req = request, res = response) => {
    const { id } = req.params; 
    const { estado } = req.body; 

    const ordenActualizada = await Orden.findByIdAndUpdate(
        id, 
        { estado }, 
        { new: true }
    );

    res.json({
        msg: 'Estado de la orden actualizado exitosamente',
        orden: ordenActualizada
    });
};

module.exports = {
    obtenerOrdenes,
    obtenerMisOrdenes,
    crearOrden,
    actualizarEstado
};