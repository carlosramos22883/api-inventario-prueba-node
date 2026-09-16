const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Todas las rutas de categorías están protegidas y son exclusivas para administradores
router.get('/', verifyToken, checkRole(['admin']), categoryController.getAllCategories);
router.get('/:id', verifyToken, checkRole(['admin']), categoryController.getCategoryById);
router.post('/', verifyToken, checkRole(['admin']), categoryController.createCategory);
router.put('/:id', verifyToken, checkRole(['admin']), categoryController.updateCategory);
router.delete('/:id', verifyToken, checkRole(['admin']), categoryController.deleteCategory);

module.exports = router;