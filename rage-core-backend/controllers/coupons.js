const { response, request } = require('express');
const Coupon = require('../models/cupon');

//ver todos los cupones admin
const obtenerCupones = async (req = request, res = response) => {
    const cupones = await Coupon.find();
    res.json({ cupones });
};

//crear un cupon
const crearCupon = async (req = request, res = response) => {
    //extraemos los campos del body
    const { porcentajeDescuento, fechaExpiracion } = req.body;
    const codigo = req.body.codigo.toUpperCase();

    // verificamos si el codigo ya fue creado antes
    const cuponDB = await Coupon.findOne({ codigo });
    if (cuponDB) {
        return res.status(400).json({
            msg: `El cupón ${codigo} ya existe en la base de datos`
        });
    }

    //preparamos y guardamos con las variables
    const data = {
        codigo,
        porcentajeDescuento,
        fechaExpiracion
    };

    const cupon = new Coupon(data);
    await cupon.save();

    res.status(201).json({
        msg: 'cupón creado exitosamente'
    });
};

module.exports = {
    obtenerCupones,
    crearCupon
};