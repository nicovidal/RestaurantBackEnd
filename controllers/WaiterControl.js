
const { pool } = require('../database/config'); 

const getWaiters = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Waiters');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { getWaiters };
