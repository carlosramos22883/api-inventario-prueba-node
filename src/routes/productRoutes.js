const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas de lectura (Accesibles para Admin y Usuario)
router.get('/', verifyToken, checkRole(['admin', 'usuario']), productController.getAllProducts);
router.get('/:id', verifyToken, checkRole(['admin', 'usuario']), productController.getProductById);

// Rutas de escritura y modificación (Exclusivas para Administradores)
router.post('/', verifyToken, checkRole(['admin']), productController.createProduct);
router.put('/:id', verifyToken, checkRole(['admin']), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole(['admin']), productController.deleteProduct);

module.exports = router;