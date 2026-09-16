const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/', userController.createUser);      // Registrarse
router.post('/login', userController.login);    // Iniciar sesión

// Rutas protegidas (Requieren estar logueado)
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);

// Rutas protegidas exclusivas para Administradores
router.get('/', verifyToken, isAdmin, userController.getAllUsers);     // Solo admin ve todos
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser); // Solo admin borra

module.exports = router;