const express = require('express');
const authMiddleware = require('../middleware/auth');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.get('/', authMiddleware, purchaseController.list);
router.post('/', authMiddleware, purchaseController.create);
router.get('/:id', authMiddleware, purchaseController.get);
router.put('/:id', authMiddleware, purchaseController.update);
router.delete('/:id', authMiddleware, purchaseController.remove);

module.exports = router;