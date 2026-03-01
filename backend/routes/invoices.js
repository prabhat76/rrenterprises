const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, invoiceController.list);
router.post('/', authMiddleware, invoiceController.create);
router.get('/:id', authMiddleware, invoiceController.get);
router.get('/:id/detail', authMiddleware, invoiceController.getInvoiceDetail);
router.put('/:id', authMiddleware, invoiceController.update);
router.delete('/:id', authMiddleware, invoiceController.remove);
router.post('/:id/payment', authMiddleware, invoiceController.recordPayment);

// Line items
router.post('/:invoiceId/items', authMiddleware, invoiceController.addLineItem);
router.put('/items/:lineItemId', authMiddleware, invoiceController.updateLineItem);
router.delete('/items/:lineItemId', authMiddleware, invoiceController.deleteLineItem);

module.exports = router;