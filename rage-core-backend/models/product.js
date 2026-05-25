const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    descripcion: { type: String, required: [true, 'La descripción es obligatoria'] },
    precio: { type: Number, required: [true, 'El precio es obligatorio'] },
    stock: { type: Number, default: 0 },
    imagen: { type: String },
    talla: { type: String, required: true },
    color: { type: String, required: true },
    tipo: { type: String, required: true, enum: ['Camisa', 'Sudadera', 'Accesorio'] },
    corte: { type: String, required: true, enum: ['oversize', 'regular', 'mineral wash', 'pigment', 'manga larga', 'sport', 'con capucha', 'sin capucha', 'no aplica'] }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


productSchema.virtual('imagenUrl').get(function() {
    if (!this.imagen || this.imagen === 'no-image.jpg') {
        return `http://localhost:8080/api/uploads/productos/placeholder.jpg`;
    }
    if (this.imagen.startsWith('http')) return this.imagen;
    

    return `http://localhost:8080/api/uploads/productos/${this.imagen}`;
});

module.exports = mongoose.model('Product', productSchema);