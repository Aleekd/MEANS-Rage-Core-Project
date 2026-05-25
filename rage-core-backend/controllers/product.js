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


const crearProducto = async (req = request, res = response) => { 
    try {
        // Extraemos los datos de texto del cuerpo de la petición 
        const { nombre, descripcion, precio, stock, talla, color, tipo, corte } = req.body;

        
        const imagenNombre = req.file ? req.file.filename : 'no-image.jpg';

        const producto = new Product({
            nombre,
            descripcion,
            precio,
            stock,
            imagen: imagenNombre, 
            talla,
            color,
            tipo,
            corte
        });

        
        await producto.save();

       
        res.status(201).json({
            msg: 'Producto agregado al catálogo de Rage Core con éxito',
            producto
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error interno en el servidor, hable con el administrador'
        });
    }
};


const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    // Si el administrador subió una NUEVA imagen, la asignamos
    if (req.file) {
        resto.imagen = req.file.filename;
    }

    try {
        // Actualizamos en MongoDB
        const productoActualizado = await Product.findByIdAndUpdate(id, resto, { new: true });
        
        res.status(200).json({
            msg: 'Producto actualizado con éxito',
            producto: productoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
};


const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoBorrado = await Product.findByIdAndDelete(id);
        res.status(200).json({
            msg: 'Producto eliminado del búnker',
            producto: productoBorrado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
};
module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
