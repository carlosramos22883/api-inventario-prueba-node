const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sale = require('./saleModel');
const Product = require('./productModel');

const SaleDetail = sequelize.define('SaleDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_venta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Sale, key: 'id' }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: 'id' }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detalle_ventas',
  timestamps: true
});

Sale.hasMany(SaleDetail, { foreignKey: 'id_venta', as: 'detalles' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_venta' });
SaleDetail.belongsTo(Product, { foreignKey: 'id_producto', as: 'producto' });

module.exports = SaleDetail;