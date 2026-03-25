const { response, requiest } = require('express');
const Orden = require('../models/order');


//ver todas las órdenes
const obtenerOrdenes = async (req = request, res = response) => {
    //usamos populate para que nos traiga el nombre del usuario yu del producto , no solo su id
    const ordenes = await Orden.find()
    .populate('usuario', 'nombre correo')
    .populate('productos.producto', 'nombre precio');
    res.json({ ordenes });
};

//crear una nueva orden (checkout)
const crearOrden = async (req = request, res = response ) => {
    // Extraemos lo que el cliuente manda desde el carrito 
    const { productos, total } = req.body;
    
    //sacar token de usuario para no pedir que valide su id
    const usuario = req.usuarioAutenticado._id;

    // Preparamos la orden
    const data = {
        usuario,
        productos,
        total
    };

    const orden = new Orden(data);

    await orden.save();

    res.status(201).json({
        msg: '!Orden de Rage Core creada con éxito',
        orden
    });
};

module.exports = {
    obtenerOrdenes,
    crearOrden
};