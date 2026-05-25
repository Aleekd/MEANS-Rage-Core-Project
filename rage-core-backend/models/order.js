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
        },
        talla: { type: String, required: true },
        color: { type: String, required: true }
    }],
    total: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Pagado', 'Procesando', 'Enviado', 'Entregado'],
        default: 'Pendiente'
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', orderSchema);