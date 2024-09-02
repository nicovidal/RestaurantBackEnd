const { pool } = require('../database/config'); 

const addWaiter = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO waiter (name) VALUES ($1) RETURNING *', // Asegúrate de que el nombre de la tabla sea correcto
        [name]
      );
  
      const newWaiter = result.rows[0];
      res.status(201).json(newWaiter)
  
    } catch (error) {
      console.error('Error al agregar camarero:', error); 
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
  };

module.exports={addWaiter}

