const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '515080',
    //database: 'usuar_db' // Comentado porque lo cambiamos después
});

// Conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error("ERROR conectando a la base de datos", err);
        return;
    }

    console.log("Conectado EXITOSAMENTE a la base de datos");

    // Creación de la base de datos si no existe
    connection.query('CREATE DATABASE IF NOT EXISTS usuar_db', (err, results) => {
        if (err) {
            console.log("Error creando la base de datos");
            return;
        }

        console.log("Base de datos asegurada");

        // Cambio a la base de datos usuar_db
        connection.changeUser({ database: 'usuar_db' }, (err) => {
            if (err) {
                console.error("Error al cambiar a usuar_db", err);
                return;
            }

            // Creación de la tabla usuarios si no existe
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    apellido VARCHAR(100) NOT NULL,
                    mail VARCHAR(255) NOT NULL,
                    ruta_archivo VARCHAR(255)
                );
            `;

            connection.query(createTableQuery, (err, results) => {
                if (err) {
                    console.log("Error creando la tabla: ", err);
                    return;
                }

                console.log("Tabla asegurada");
            });
        });
    });
});

module.exports = connection;
