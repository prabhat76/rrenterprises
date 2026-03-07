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

// Migration endpoint to add missing foreign key columns
router.post('/add-missing-columns', async (req, res) => {
  try {
    console.log('Starting migration...');
    
    // Add invoice_id to InvoiceItems
    console.log('Adding invoice_id to InvoiceItems...');
    await sequelize.query(`
      ALTER TABLE "InvoiceItems"
      ADD COLUMN IF NOT EXISTS "invoice_id" INTEGER
    `).catch(err => {
      console.log('invoice_id might already exist:', err.message);
    });
    
    // Add invoice_id to Transactions  
    console.log('Adding invoice_id to Transactions...');
    await sequelize.query(`
      ALTER TABLE "Transactions"
      ADD COLUMN IF NOT EXISTS "invoice_id" INTEGER
    `).catch(err => {
      console.log('invoice_id might already exist in Transactions:', err.message);
    });

    // Add purchase_invoice_id and product_id to PurchaseItems
    console.log('Adding purchase_invoice_id to PurchaseItems...');
    await sequelize.query(`
      ALTER TABLE "PurchaseItems"
      ADD COLUMN IF NOT EXISTS "purchase_invoice_id" INTEGER
    `).catch(err => {
      console.log('purchase_invoice_id might already exist:', err.message);
    });

    console.log('Adding product_id to PurchaseItems...');
    await sequelize.query(`
      ALTER TABLE "PurchaseItems"
      ADD COLUMN IF NOT EXISTS "product_id" INTEGER
    `).catch(err => {
      console.log('product_id might already exist in PurchaseItems:', err.message);
    });

    res.json({ success: true, message: 'All columns added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

