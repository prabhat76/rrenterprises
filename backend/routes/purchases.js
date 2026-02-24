const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Placeholder for purchase routes (controller doesn't exist yet)
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Purchase routes not yet implemented' });
});

module.exports = router;