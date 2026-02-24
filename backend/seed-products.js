#!/usr/bin/env node
/**
 * Product Seeding Script
 * Connects to Neon and inserts product data
 * Usage: node seed-products.js
 */

require('dotenv').config();
const { sequelize, Product } = require('./models');

// Sample home appliances list - Replace with your actual list
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

async function seedProducts() {
  try {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║     SEEDING NEON DATABASE             ║');
    console.log('╚═══════════════════════════════════════╝\n');

    // Connect to database
    console.log('🔗 Connecting to Neon database...');
    await sequelize.authenticate();
    console.log('✅ Connected successfully!\n');

    // Sync models
    console.log('📝 Syncing database models...');
    await sequelize.sync();
    console.log('✅ Models synced!\n');

    // Clear existing products (optional - comment out to keep existing data)
    console.log('🗑️  Clearing existing products...');
    await Product.destroy({ where: {} });
    console.log('✅ Database cleared!\n');

    // Insert products
    console.log('📦 Inserting products...\n');
    console.log('┌─────┬──────────────────────────┬────────────┬─────────┐');
    console.log('│ # │ Product Name             │ HSN Code   │ Price   │');
    console.log('├─────┼──────────────────────────┼────────────┼─────────┤');

    for (let i = 0; i < PRODUCTS.length; i++) {
      const prod = PRODUCTS[i];
      await Product.create({
        name: prod.name,
        hsn_code: prod.hsn_code,
        price: prod.price,
        description: prod.description
      });

      const num = String(i + 1).padEnd(4);
      const name = prod.name.substring(0, 24).padEnd(24);
      const hsn = prod.hsn_code.padEnd(10);
      const price = '₹' + String(Math.round(prod.price)).padStart(6);
      console.log(`│ ${num}│ ${name} │ ${hsn} │ ${price} │`);
    }

    console.log('└─────┴──────────────────────────┴────────────┴─────────┘\n');

    const count = await Product.count();
    console.log(`✅ Successfully inserted ${count} products!\n`);

    console.log('Summary:');
    console.log(`  • Total Products: ${count}`);
    console.log(`  • Database: Neon`);
    console.log(`  • Status: Ready for sales tracking\n`);

  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedProducts();
