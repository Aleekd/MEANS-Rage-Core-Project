const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Pagado', 'Enviado'],
        default: 'Pendiente'
    }
});

module.exports = mongoose.model('Order', orderSchema);