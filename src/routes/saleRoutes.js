const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, checkRole(['admin', 'usuario']), saleController.getAllSales);
router.post('/', verifyToken, checkRole(['admin', 'usuario']), saleController.createSale);

module.exports = router;