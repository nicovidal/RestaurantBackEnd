const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_USER,        
  host: process.env.DB_HOST,        
  database: process.env.DB_NAME,     
  password:process.env.DB_PASSWORD,  
  port:process.env.DB_PORT,  
});

// Función para conectar a la base de datos
const dbConnection = async () => {
  try {

    await pool.query('SELECT NOW()');
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw new Error('Error al iniciar la base de datos');
  }
};

module.exports = {
  dbConnection,
  pool, 
};
