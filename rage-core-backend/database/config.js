const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Conexión exitosa con la DB'); 
    } catch (error) {
        console.log('Error al conectar con la DB');
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
};

module.exports = {
    dbConnection
};