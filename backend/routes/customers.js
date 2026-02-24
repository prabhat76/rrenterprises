const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, customerController.list);
router.post('/', authMiddleware, customerController.create);
router.get('/:id', authMiddleware, customerController.get);
router.put('/:id', authMiddleware, customerController.update);
router.delete('/:id', authMiddleware, customerController.remove);

module.exports = router;