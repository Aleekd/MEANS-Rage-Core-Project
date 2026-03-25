const mongoose = require('mongoose');

const categorySchema = mongoose.Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true
    }
});

module.exports = mongoose.model('Category', categorySchema);