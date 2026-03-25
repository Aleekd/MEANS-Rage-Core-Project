const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nombre: {
        type: String,
        required:[true, 'El nombre es obligatorio'] 
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    stock: {
        type: Number,
        default: 0
    },
    imagen: {
        type: String
    },
    talla: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);