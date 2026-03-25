const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true
    },
    porcentajeDescuento: {
        type: Number,
        required: [true, 'El porcentaje es obligatorio']
    },
    fechaExpiracion: {
        type: Date,
        required: [true, 'La fecha de expiración es obligatorioa']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Coupon', couponSchema);
