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
  const {name_product,price,categoria_id}=req.body

  try {

    const result=await pool.query(
      'INSERT INTO product (name_product, price,categoria_id) VALUES ($1, $2,$3) RETURNING *',
      [name_product,price,categoria_id]
    )

    const newProduct= result.rows[0]
    res.status(201).json(newProduct)
    
  } catch (error) {
    console.error("No se pudo agregar producto")
    console.log(error)
    
  }
}

const addPedido = async (req, res) => {
  const { bebida, comida, mesa_id, genero, fin, camarero_id, total_pedido } = req.body;
  const inicio = new Date(); // Obtiene la fecha y hora actuales

  try {
    // Verifica que la mesa existe
    const mesaResult = await pool.query('SELECT id_mesa FROM mesa WHERE id_mesa = $1', [mesa_id]);
    if (mesaResult.rowCount === 0) {
      return res.status(400).json({ error: 'La mesa no existe' });
    }

    // Verifica que el camarero existe
    const waiterResult = await pool.query('SELECT id FROM waiter WHERE id = $1', [camarero_id]);
    if (waiterResult.rowCount === 0) {
      return res.status(400).json({ error: 'Camarero no existe' });
    }

    // Inserta el nuevo pedido
    const result = await pool.query(
      'INSERT INTO pedidos (bebida, comida, mesa_id, genero, inicio, fin, camarero_id, total_pedido) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        JSON.stringify(bebida),
        JSON.stringify(comida),
        mesa_id,
        genero,
        inicio,
        fin,
        camarero_id,
        total_pedido,
      ]
    );

    const newPedido = result.rows[0];

    // Actualiza el estado de la mesa a "pedido tomado"
    await pool.query(
      'UPDATE mesa SET estado_mesa = $1 WHERE id_mesa = $2',
      ['pedido tomado', mesa_id]
    );

    res.status(201).json(newPedido);

  } catch (error) {
    console.error("No se pudo completar el pedido");
    console.log(error);
    res.status(500).json({ error: 'Error al agregar el pedido' });
  }
};





module.exports={addWaiter,addMesa,addProduct,addPedido}

