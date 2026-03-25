const {response, request } = require('express');
const Category = require('../models/category');

//Obtener todas las categorias 
const obtenerCategorias = async (req = request, res = response) => {
    //busca todas las categorias en la base de datos
    const categorias = await Category.find();

    res.json({
        categorias
    });
};

// Crear una nueva categoria (privado - solo admin)
const crearCategoria = async (req = request, res = response) => {
    // extraemos el nuevo nombre y lo ponemos en mayusculas para tener el orden
    const nombre = req.body.nombre.toUpperCase();

    //revisamos si esa categoria ya existia en la bd
    const categoriaDB = await Category.findOne ({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    // Preparamos los datos o guardar
    const data = { nombre };
    const categoria = new Category(data);

    //guardamos en la bd
    await categoria.save();
    res.status(201).json({
        msg: 'Categoria creada con éxito',
        categoria
    });
};

module.exports = {
    obtenerCategorias,
    crearCategoria 
}