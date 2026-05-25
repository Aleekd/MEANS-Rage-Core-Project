const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        enum: ['cliente', 'admin', 'staff'],
        default: 'cliente'
    },
    direccion: {
        calle: { type: String },
        ciudad: { type: String },
        codigoPostal: { type: String }
    }
});

module.exports = mongoose.model('User', userSchema);