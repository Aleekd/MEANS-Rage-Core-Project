const {response, request } = require('express');
const Product = require('../models/product');

// Ver todos los productos (Publico)
const obtenerProductos = async (req, res) => {
    //busca todos los productos 
    const productos = await Product.find();

    res.json({
        productos
    });
};

// crear un producto (privado: solo admin)
const crearProducto = async (req = response, res = request) => { 
    //extraemos todos los datos que se definieron en el modelo
    const { nombre, descripcion, precio, stock, imagen, talla, color } = req.body;

    //preparamos el nuevo produto
    const producto = new Product({
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
        talla,
        color
    });

    //se guarda en mongo
    await producto.save();
    res.status(201).json({
        msg: 'Producto agregado al catálogo de Rage Core con éxito',
        producto
    });
};

module.exports = {
    obtenerProductos,
    crearProducto
};
