const express = require('express');
const router = express.Router();
const reportFactory = require('../controllers/reportController');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Instanciamos el controlador pasándole el Modelo, el nombre y las columnas deseadas
const userReports = reportFactory(User, 'usuarios', ['id', 'nombre', 'email', 'rol', 'created_at']);

// Instanciar la fábrica para Categorías
const categoryReports = reportFactory(Category, 'categorias', ['id', 'nombre', 'createdAt', 'updatedAt']);

// Instanciar la fábrica para Productos
const productReports = reportFactory(Product, 'productos', [
  'id', 'codigo', 'nombre', 'id_categoria', 'precio_venta', 'stock_actual', 'disponible', 'createdAt', 'updatedAt'
]);

// ==========================================
// RUTAS DE REPORTES DE USUARIOS
// ==========================================
router.get('/usuarios/csv', verifyToken, isAdmin, userReports.exportCSV);
router.get('/usuarios/excel', verifyToken, isAdmin, userReports.exportExcel);
router.get('/usuarios/pdf', verifyToken, isAdmin, userReports.exportPDF);

// ==========================================
// RUTAS DE REPORTES DE CATEGORÍAS
// ==========================================
router.get('/categorias/csv', verifyToken, isAdmin, categoryReports.exportCSV);
router.get('/categorias/excel', verifyToken, isAdmin, categoryReports.exportExcel);
router.get('/categorias/pdf', verifyToken, isAdmin, categoryReports.exportPDF);

// ==========================================
// RUTAS DE REPORTES DE PRODUCTOS
// ==========================================
router.get('/productos/csv', verifyToken, isAdmin, productReports.exportCSV);
router.get('/productos/excel', verifyToken, isAdmin, productReports.exportExcel);
router.get('/productos/pdf', verifyToken, isAdmin, productReports.exportPDF);

module.exports = router;