#!/usr/bin/env node
/**
 * Database Migration Script
 * Adds missing columns to tables
 */

require('dotenv').config();
const { sequelize } = require('./models');

async function migrateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Add missing columns to InvoiceItems
    console.log('Adding invoice_id column to InvoiceItems...');
    try {
      await sequelize.query(`
        ALTER TABLE "InvoiceItems"
        ADD COLUMN IF NOT EXISTS "invoice_id" INTEGER
      `);
      console.log('✓ Added invoice_id to InvoiceItems');
    } catch (err) {
      console.log('invoice_id already exists or error:', err.message);
    }

    // Add missing columns to Transactions
    console.log('Adding invoice_id column to Transactions...');
    try {
      await sequelize.query(`
        ALTER TABLE "Transactions"
        ADD COLUMN IF NOT EXISTS "invoice_id" INTEGER
      `);
      console.log('✓ Added invoice_id to Transactions');
    } catch (err) {
      console.log('invoice_id already exists in Transactions or error:', err.message);
    }

    // Add missing columns to PurchaseItems
    console.log('Adding missing columns to PurchaseItems...');
    try {
      await sequelize.query(`
        ALTER TABLE "PurchaseItems"
        ADD COLUMN IF NOT EXISTS "purchase_invoice_id" INTEGER
      `);
      console.log('✓ Added purchase_invoice_id to PurchaseItems');
    } catch (err) {
      console.log('purchase_invoice_id already exists in PurchaseItems or error:', err.message);
    }

    try {
      await sequelize.query(`
        ALTER TABLE "PurchaseItems"
        ADD COLUMN IF NOT EXISTS "product_id" INTEGER
      `);
      console.log('✓ Added product_id to PurchaseItems');
    } catch (err) {
      console.log('product_id already exists in PurchaseItems or error:', err.message);
    }

    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

migrateDatabase();
