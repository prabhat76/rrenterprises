#!/usr/bin/env node
/**
 * Production Database Setup Script
 * Initializes Neon database with schema and seeds data
 */

require('dotenv').config({ path: '.env.production' });
const { sequelize } = require('./models');
const { Product } = require('./models');

const PRODUCTS = [
  // Kitchen Appliances
  { name: 'Refrigerator - 260L Frost Free', hsn_code: 'HSN8418-001', price: 28999.00, description: 'Double door, energy efficient, 3-star' },
  { name: 'Microwave Oven - 25L Convection', hsn_code: 'HSN8516-001', price: 12499.00, description: 'Convection, grill, auto-cook menus' },
  { name: 'Mixer Grinder - 750W', hsn_code: 'HSN8509-001', price: 3499.00, description: '3 jars, stainless steel blades' },
  { name: 'Induction Cooktop - 1800W', hsn_code: 'HSN8516-002', price: 2499.00, description: 'Touch control, preset modes' },
  { name: 'Air Fryer - 4L', hsn_code: 'HSN8516-003', price: 5999.00, description: 'Rapid air technology, non-stick basket' },

  // Laundry & Cleaning
  { name: 'Washing Machine - 7kg Front Load', hsn_code: 'HSN8450-001', price: 27999.00, description: 'Inverter motor, steam wash' },
  { name: 'Vacuum Cleaner - 1600W', hsn_code: 'HSN8508-001', price: 4999.00, description: 'Bagless, HEPA filter' },
  { name: 'Dishwasher - 12 Place', hsn_code: 'HSN8422-001', price: 32999.00, description: 'Half load option, quick wash' },

  // Cooling & Heating
  { name: 'Air Conditioner - 1.5 Ton Split', hsn_code: 'HSN8415-001', price: 35999.00, description: 'Inverter, 5-star, copper condenser' },
  { name: 'Air Cooler - 40L', hsn_code: 'HSN8479-001', price: 6999.00, description: 'Honeycomb pads, low power use' },
  { name: 'Water Heater - 15L', hsn_code: 'HSN8516-004', price: 7499.00, description: 'Glass lined tank, fast heating' },
  { name: 'Room Heater - 2000W', hsn_code: 'HSN8516-005', price: 2199.00, description: 'Overheat protection, tip-over switch' },

  // Small Appliances
  { name: 'Electric Kettle - 1.5L', hsn_code: 'HSN8516-006', price: 1299.00, description: 'Auto shut-off, stainless steel' },
  { name: 'Toaster - 2 Slice', hsn_code: 'HSN8516-007', price: 1499.00, description: 'Browning control, crumb tray' },
  { name: 'Coffee Maker - 10 Cup', hsn_code: 'HSN8516-008', price: 3499.00, description: 'Keep warm plate, anti-drip' },
  { name: 'Iron - 1200W Steam', hsn_code: 'HSN8516-009', price: 1899.00, description: 'Non-stick soleplate, vertical steam' },

  // Entertainment & Utility
  { name: 'LED TV - 43 Inch Smart', hsn_code: 'HSN8528-001', price: 28999.00, description: 'Full HD, built-in apps' },
  { name: 'Water Purifier - RO+UV', hsn_code: 'HSN8421-001', price: 9999.00, description: '7-stage filtration, 8L tank' },
  { name: 'Ceiling Fan - 1200mm', hsn_code: 'HSN8414-001', price: 2499.00, description: 'High airflow, anti-dust blades' },
];

async function setupProductionDB() {
  try {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║  PRODUCTION DATABASE SETUP (NEON)    ║');
    console.log('╚═══════════════════════════════════════╝\n');

    console.log('🔗 Connecting to Neon database...');
    await sequelize.authenticate();
    console.log('✅ Connected successfully!\n');

    console.log('📝 Creating/Syncing database tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables created/synced!\n');

    console.log('📦 Checking existing products...');
    const existingProducts = await Product.count();
    
    if (existingProducts === 0) {
      console.log('📦 Inserting 19 home appliances...\n');
      await Product.bulkCreate(PRODUCTS);
      console.log('✅ Successfully inserted 19 products!\n');
    } else {
      console.log(`ℹ️  Database already has ${existingProducts} products. Skipping seed.\n`);
    }

    console.log('╔═══════════════════════════════════════╗');
    console.log('║  PRODUCTION DATABASE READY! 🚀       ║');
    console.log('╚═══════════════════════════════════════╝\n');

    console.log('Summary:');
    console.log('  • Database: Neon PostgreSQL');
    console.log('  • Tables: Created/Updated');
    console.log('  • Products: ' + (existingProducts === 0 ? '19 inserted' : `${existingProducts} existing`));
    console.log('  • Status: ✅ READY FOR PRODUCTION\n');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error setting up production database:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

setupProductionDB();
