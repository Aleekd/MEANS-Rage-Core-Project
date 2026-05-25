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

const actualizarCupon = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    if (resto.codigo) {
        resto.codigo = resto.codigo.toUpperCase();
    }

    try {
        const cuponActualizado = await Coupon.findByIdAndUpdate(id, resto, { new: true });
        res.status(200).json({ msg: 'Cupón actualizado', cupon: cuponActualizado });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el cupón' });
    }
};


const eliminarCupon = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        await Coupon.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Cupón eliminado del búnker' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el cupón' });
    }
};

const validarCupon = async (req, res) => {
    const { codigo } = req.params;
    try {
        const cupon = await Cupon.findOne({ codigo: codigo.toUpperCase(), estado: true });

        if (!cupon) {
            return res.status(404).json({ msg: 'CÓDIGO NO ENCONTRADO' });
        }

        // Verificar si expiró
        if (new Date(cupon.fechaExpiracion) < new Date()) {
            return res.status(400).json({ msg: 'EL CUPÓN HA EXPIRADO' });
        }

        res.json({
            porcentajeDescuento: cupon.porcentajeDescuento
        });
    } catch (error) {
        res.status(500).json({ msg: 'ERROR EN EL SISTEMA' });
    }
};

module.exports = {
    obtenerCupones,
    crearCupon,
    actualizarCupon,
    eliminarCupon,
    validarCupon,

};