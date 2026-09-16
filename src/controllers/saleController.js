const Sale = require('../models/saleModel');
const SaleDetail = require('../models/saleDetailModel');
const Product = require('../models/productModel');
const sequelize = require('../config/database');

exports.createSale = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body; // Espera un array de { id_producto, cantidad }
    const id_usuario = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'La venta debe contener al menos un producto.' });
    }

    let totalVenta = 0;
    const detallesVentaData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.id_producto, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Producto con ID ${item.id_producto} no encontrado.` });
      }

      // Validar disponibilidad
      if (!product.disponible) {
        await t.rollback();
        return res.status(400).json({ message: `El producto '${product.nombre}' no está disponible para la venta.` });
      }

      // Validar stock suficiente
      if (item.cantidad > product.stock_actual) {
        await t.rollback();
        return res.status(400).json({ 
          message: `Stock insuficiente para '${product.nombre}'. Stock actual: ${product.stock_actual}, solicitado: ${item.cantidad}.` 
        });
      }

      const subtotal = product.precio_venta * item.cantidad;
      totalVenta += subtotal;

      detallesVentaData.push({
        product,
        cantidad: item.cantidad,
        precio_unitario: product.precio_venta,
        subtotal
      });

      // Descontar stock
      product.stock_actual -= item.cantidad;
      await product.save({ transaction: t }); // El hook actualizará 'disponible' a false si llega a 0
    }

    // Crear cabecera de la venta
    const sale = await Sale.create({
      id_usuario,
      total: totalVenta
    }, { transaction: t });

    // Crear detalles de la venta
    for (const det of detallesVentaData) {
      await SaleDetail.create({
        id_venta: sale.id,
        id_producto: det.product.id,
        cantidad: det.cantidad,
        precio_unitario: det.precio_unitario,
        subtotal: det.subtotal
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({
      message: 'Venta realizada con éxito.',
      saleId: sale.id,
      total: totalVenta
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [{
        model: SaleDetail,
        as: 'detalles',
        include: [{ model: Product, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};