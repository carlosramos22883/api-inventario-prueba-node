const Purchase = require('../models/purchaseModel');
const Product = require('../models/productModel');
const sequelize = require('../config/database');

exports.createPurchase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_producto, cantidad, precio_costo } = req.body;
    const id_usuario = req.user.id; // Del token JWT

    if (!id_producto || !cantidad || !precio_costo) {
      await t.rollback();
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const product = await Product.findByPk(id_producto, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const qty = parseInt(cantidad, 10);
    const cost = parseFloat(precio_costo);

    if (isNaN(qty) || qty <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Cantidad inválida.' });
    }

    // 1. Crear el registro de la compra
    const purchase = await Purchase.create({
      id_producto,
      id_usuario,
      cantidad: qty,
      precio_costo: cost
    }, { transaction: t });

    // 2. Actualizar stock del producto (Esto dispara el hook que activa 'disponible' si pasa de 0)
    product.stock_actual += qty;
    await product.save({ transaction: t });

    await t.commit();
    res.status(201).json({
      message: 'Compra registrada e inventario actualizado exitosamente.',
      purchase,
      productStockActual: product.stock_actual,
      disponible: product.disponible
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [{ model: Product, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};