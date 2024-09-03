const { pool } = require('../database/config');

const finishPedido = async (req, res) => {
  const { id_pedido } = req.body; // Captura el id_pedido desde el cuerpo de la solicitud
  const fin = new Date(); // Obtiene la fecha y hora actuales

  try {
    // Verifica que el pedido exista
    const pedidoResult = await pool.query('SELECT * FROM pedidos WHERE id_pedido = $1', [id_pedido]);
    if (pedidoResult.rowCount === 0) {
      return res.status(404).json({ error: 'El pedido no existe' });
    }

    // Actualiza la hora de fin con la hora actual
    const result = await pool.query(
      'UPDATE pedidos SET fin = $1 WHERE id_pedido = $2 RETURNING *',
      [fin, id_pedido]
    );

    const updatedPedido = result.rows[0];
    res.status(200).json(updatedPedido);

  } catch (error) {
    console.error("No se pudo finalizar el pedido");
    console.log(error);
    res.status(500).json({ error: 'Error al finalizar el pedido' });
  }
};

module.exports = { finishPedido };

