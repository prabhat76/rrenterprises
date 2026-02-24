const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, invoiceController.list);
router.post('/', authMiddleware, invoiceController.create);
router.get('/:id', authMiddleware, invoiceController.get);
router.put('/:id', authMiddleware, invoiceController.update);
router.delete('/:id', authMiddleware, invoiceController.remove);
router.post('/:id/payment', authMiddleware, invoiceController.recordPayment);

module.exports = router;