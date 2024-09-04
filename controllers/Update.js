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


const updatePedido = async (req, res) => {
  const { id_mesa, comida, bebida } = req.body; 

  console.log("ID de la mesa recibido:", id_mesa);
  console.log("Comida a agregar:", comida);
  console.log("Bebida a agregar:", bebida);

  try {
    // Obtener el ID del pedido para la mesa dada
    const resultPedido = await pool.query(
      `SELECT id_pedido, comida, bebida FROM pedidos 
       WHERE mesa_id = $1 
       ORDER BY inicio DESC 
       LIMIT 1`,
      [id_mesa]
    );

    if (resultPedido.rowCount === 0) {
      return res.status(404).json({ message: "No se encontró ningún pedido para esta mesa" });
    }

    const id_pedido = resultPedido.rows[0].id_pedido;
    let comidaActual = resultPedido.rows[0].comida || [];
    let bebidaActual = resultPedido.rows[0].bebida || [];

    // Agregar la nueva comida a la comida existente
    comida.forEach(item => {
      comidaActual.push(item);
    });

    // Agregar la nueva bebida a la bebida existente
    bebida.forEach(item => {
      bebidaActual.push(item);
    });

    // Obtener precios de los productos
    const idsComida = comida.map(item => item.id);
    const idsBebida = bebida.map(item => item.id);
    const resultComida = await pool.query(
      `SELECT id_product, price FROM product WHERE id_product = ANY($1::int[])`,
      [idsComida]
    );
    const resultBebida = await pool.query(
      `SELECT id_product, price FROM product WHERE id_product = ANY($1::int[])`,
      [idsBebida]
    );

    const productos = [...resultComida.rows, ...resultBebida.rows];
    const productosMap = new Map(productos.map(p => [p.id_product, p.price]));

    // Calcular el total del pedido
    let total = 0;
    comidaActual.forEach(item => {
      total += (productosMap.get(item.id) || 0) * item.cantidad;
    });
    bebidaActual.forEach(item => {
      total += (productosMap.get(item.id) || 0) * item.cantidad;
    });

    // Actualizar la columna comida, bebida y el total en la tabla pedidos
    await pool.query(
      `UPDATE pedidos
       SET comida = $1, bebida = $2, total_pedido = $3
       WHERE id_pedido = $4`,
      [JSON.stringify(comidaActual), JSON.stringify(bebidaActual), total, id_pedido]
    );

    res.status(200).json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    res.status(500).json({ message: "Error al actualizar el pedido" });
  }
};



module.exports = { finishPedido,updateStateMesa ,updatePedido,updateStateFinPedido};

