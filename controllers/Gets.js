
const { pool } = require('../database/config'); 

const getWaiters = async (req, res) => {

  try {
    const result = await pool.query('SELECT * FROM waiters');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};


const getProduct = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMesa = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mesa');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAdmin= async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admin');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getPedidos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCategoria = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {getWaiters,getProduct,getMesa,getAdmin,getPedidos,getCategoria};
