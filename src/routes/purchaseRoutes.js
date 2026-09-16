const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, checkRole(['admin']), purchaseController.getAllPurchases);
router.post('/', verifyToken, checkRole(['admin']), purchaseController.createPurchase);

module.exports = router;