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


const updateStateMesa = async (req, res) => {
  const { id_mesa } = req.body;

  try {
    const updatedMesa = await pool.query(
      "UPDATE mesa SET estado_mesa = 'Libre' WHERE id_mesa = $1 RETURNING *",
      [id_mesa]
    );

    if (updatedMesa.rowCount === 0) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.status(200).json({ message: "Estado de la mesa actualizado", mesa: updatedMesa.rows[0] });
  } catch (error) {
    console.error("Error al actualizar el estado de la mesa:", error);
    res.status(500).json({ message: "Error al actualizar el estado de la mesa" });
  }
};


const updateStateFinPedido = async (req, res) => {
  const { id_mesa } = req.body;
  console.log("ID de la mesa recibido:", id_mesa); // Imprime el ID de la mesa recibido

  try {
    // Consulta el último pedido asociado a la mesa
    const lastPedidoResult = await pool.query(
      "SELECT id_pedido FROM pedidos WHERE mesa_id = $1 ORDER BY inicio DESC LIMIT 1",
      [id_mesa]
    );

    if (lastPedidoResult.rowCount === 0) {
      return res.status(404).json({ message: "No se encontraron pedidos para esta mesa" });
    }

    const id_pedido = lastPedidoResult.rows[0].id_pedido;

    // Actualiza el pedido a 'fin'
    await pool.query(
      "UPDATE pedidos SET fin = NOW() WHERE id_pedido = $1",
      [id_pedido]
    );

    // Actualiza el estado de la mesa a 'Por pagar'
    const updatedMesa = await pool.query(
      "UPDATE mesa SET estado_mesa = 'Por pagar' WHERE id_mesa = $1 RETURNING *",
      [id_mesa]
    );

    if (updatedMesa.rowCount === 0) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.status(200).json({
      message: "Estado del último pedido y de la mesa actualizados",
      pedido: id_pedido, // Solo el ID del pedido actualizado
      mesa: updatedMesa.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar el estado del pedido y de la mesa:", error);
    res.status(500).json({ message: "Error al actualizar el estado del pedido y de la mesa" });
  }
};






module.exports = { finishPedido,updateStateMesa ,updateStateFinPedido};

