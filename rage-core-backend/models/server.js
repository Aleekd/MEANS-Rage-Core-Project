const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config'); 

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Conectar a la base de datois
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Parseo del body
        this.app.use(express.json());
    }

    routes() {
        
        this.app.use('/api/users', require('../routes/users'));
        this.app.use('/api/categorias', require('../routes/categories'));
        this.app.use('/api/productos', require('../routes/products'));
        this.app.use('/api/cupones', require('../routes/coupons'));
        this.app.use('/api/ordenes', require('../routes/orders'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;