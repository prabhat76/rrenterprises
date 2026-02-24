const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, inventoryController.list);
router.get('/product/:productId', authMiddleware, inventoryController.getByProduct);
router.post('/', authMiddleware, inventoryController.create);
router.put('/:id', authMiddleware, inventoryController.update);
router.delete('/:id', authMiddleware, inventoryController.remove);

module.exports = router;