const express = require('express');
const { sequelize } = require('../models');

const router = express.Router();

// Migration endpoint to add new columns
router.post('/add-bill-image-column', async (req, res) => {
  try {
    // Add bill_image_path column to inventory_batches table
    await sequelize.query(`
      ALTER TABLE inventory_batches 
      ADD COLUMN IF NOT EXISTS bill_image_path VARCHAR(255)
    `);
    
    res.json({ success: true, message: 'Column added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
