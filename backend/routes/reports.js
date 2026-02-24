const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/sales', authMiddleware, reportController.salesReport);
router.get('/payments', authMiddleware, reportController.paymentReport);
router.get('/purchases', authMiddleware, reportController.purchaseReport);

module.exports = router;