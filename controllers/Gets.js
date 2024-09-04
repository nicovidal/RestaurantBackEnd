const { pool } = require("../database/config");

const getWaiters = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM waiters");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMesa = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mesa");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAdmin = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admin");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPedidos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pedidos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoria = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categoria");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const showPedido = async (req, res) => {
  const { id_mesa } = req.query;

  if (!id_mesa) {
    return res.status(400).json({ message: "Falta el parámetro id_mesa" });
  }

  console.log("ID de la mesa recibido:", id_mesa);

  try {
    // Obtén el último pedido asociado a la mesa
    const resultPedido = await pool.query(
      `SELECT * FROM pedidos 
       WHERE mesa_id = $1 
       ORDER BY inicio DESC 
       LIMIT 1`,
      [id_mesa]
    );

    if (resultPedido.rowCount === 0) {
      return res.status(404).json({ message: "No se encontró ningún pedido para esta mesa" });
    }

    const pedido = resultPedido.rows[0];

    // Obtén los ids de los productos de comida y bebida
    const idsComida = pedido.comida ? pedido.comida.map(item => parseInt(item.id, 10)) : [];
    const idsBebida = pedido.bebida ? pedido.bebida.map(item => parseInt(item.id, 10)) : [];

    console.log("IDs de comida:", idsComida);
    console.log("IDs de bebida:", idsBebida);

    // Si hay ids de productos, haz las consultas
    const resultComida = idsComida.length > 0 ? await pool.query(
      `SELECT id_product, name_product, price FROM product WHERE id_product = ANY($1::int[])`,
      [idsComida]
    ) : { rows: [] };

    const resultBebida = idsBebida.length > 0 ? await pool.query(
      `SELECT id_product, name_product, price FROM product WHERE id_product = ANY($1::int[])`,
      [idsBebida]
    ) : { rows: [] };

    console.log("Productos de comida:", resultComida.rows);
    console.log("Productos de bebida:", resultBebida.rows);

    // Combina los resultados en un solo array
    const productos = [...resultComida.rows, ...resultBebida.rows];

    // Crea un mapa para facilitar la búsqueda
    const productosMap = new Map(productos.map(p => [p.id_product, p]));

    // Mapea los productos de comida y bebida con la información del nombre y precio
    pedido.comida = pedido.comida ? pedido.comida.map(item => ({
      ...item,
      name_product: productosMap.get(parseInt(item.id, 10))?.name_product || 'Desconocido',
      price: productosMap.get(parseInt(item.id, 10))?.price || 0
    })) : [];

    pedido.bebida = pedido.bebida ? pedido.bebida.map(item => ({
      ...item,
      name_product: productosMap.get(parseInt(item.id, 10))?.name_product || 'Desconocido',
      price: productosMap.get(parseInt(item.id, 10))?.price || 0
    })) : [];

    console.log("Pedido actualizado:", pedido);

    res.status(200).json({
      message: "Último pedido encontrado",
      pedido
    });
  } catch (error) {
    console.error("Error al obtener el último pedido:", error);
    res.status(500).json({ message: "Error al obtener el último pedido" });
  }
};


module.exports = {
  getWaiters,
  getProduct,
  getMesa,
  getAdmin,
  getPedidos,
  getCategoria,
  showPedido,
};
