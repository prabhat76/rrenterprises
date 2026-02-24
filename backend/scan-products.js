#!/usr/bin/env node
/**
 * Product Scanner - Tally Style
 * Scans all products from the database
 * Usage: node scan-products.js [search-query]
 */

require('dotenv').config();
const { sequelize, Product } = require('./models');
const { Op } = require('sequelize');

async function scanProducts(query) {
  try {
    console.log('\n==========================================');
    console.log('   Product Scanning (Tally Style)');
    console.log('==========================================\n');

    let products = [];
    let whereClause = {};

    if (query) {
      // Search by HSN code first
      console.log(`Searching for: "${query}"\n`);
      
      products = await Product.findAll({
        where: { hsn_code: query },
        attributes: ['id', 'name', 'hsn_code', 'price', 'description', 'createdAt'],
        order: [['name', 'ASC']]
      });

      // If not found by HSN, search by name
      if (products.length === 0) {
        products = await Product.findAll({
          where: {
            name: { [Op.iLike]: `%${query}%` }
          },
          attributes: ['id', 'name', 'hsn_code', 'price', 'description', 'createdAt'],
          order: [['name', 'ASC']],
          limit: 20
        });
      }
    } else {
      // Get all products
      console.log('Scanning all products...\n');
      products = await Product.findAll({
        attributes: ['id', 'name', 'hsn_code', 'price', 'description', 'createdAt'],
        order: [['name', 'ASC']]
      });
    }

    // Display products in scan format
    if (products.length > 0) {
      console.log('┌─────┬──────────────────────━┬───────────┬──────────┐');
      console.log('│ ID  │ Product Name         │ HSN Code  │ Price    │');
      console.log('├─────┼──────────────────────┼───────────┼──────────┤');

      products.forEach((p, idx) => {
        const id = String(p.id).padEnd(3);
        const name = (p.name || 'N/A').substring(0, 20).padEnd(20);
        const hsn = (p.hsn_code || 'N/A').padEnd(9);
        const price = String(p.price || '0.00').padStart(8);
        console.log(`│ ${id} │ ${name} │ ${hsn} │ ${price} │`);
      });

      console.log('└─────┴──────────────────────┴───────────┴──────────┘\n');
    } else {
      console.log('No products found.\n');
    }

    // Display summary
    const stats = await Product.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('*')), 'total'],
        [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
        [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
        [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']
      ],
      raw: true
    });

    console.log('Summary:');
    console.log(`  Total Products: ${products.length}`);
    console.log(`  Min Price: ₹${stats[0].minPrice || 0}`);
    console.log(`  Max Price: ₹${stats[0].maxPrice || 0}`);
    console.log(`  Avg Price: ₹${Math.round(stats[0].avgPrice || 0)}`);
    console.log('\n==========================================\n');

  } catch (err) {
    console.error('Error scanning products:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Get search query from command line arguments
const searchQuery = process.argv[2];
scanProducts(searchQuery);
