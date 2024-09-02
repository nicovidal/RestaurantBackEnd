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


const addMesa=async(req,res)=>{
  const {name_mesa,estado_mesa}=req.body

  if (!name_mesa || !estado_mesa) {
    return res.status(400).json({ error: 'Both name_mesa and estado_mesa are required' });
  }
  try {

    const result = await pool.query(
      'INSERT INTO mesa (name_mesa, estado_mesa) VALUES ($1, $2) RETURNING *',
      [name_mesa, estado_mesa]
    );

    const newMesa = result.rows[0];
    res.status(201).json(newMesa); 
    
  } catch (error) {
    console.error('No se agrego mesa')
    
  }

}


const addProduct= async (req,res)=>{
  const {name_product,price}=req.body

  try {

    const result=await pool.query(
      'INSERT INTO product (name_product, price) VALUES ($1, $2) RETURNING *',
      [name_product,price]
    )

    const newProduct= result.rows[0]
    res.status(201).json(newProduct)
    
  } catch (error) {
    console.error("No se pudo agregar producto")
    console.log(error)
    
  }
}



module.exports={addWaiter,addMesa,addProduct}

