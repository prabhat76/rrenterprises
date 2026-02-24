#!/usr/bin/env node
/**
 * Sales Analytics Report - Tally Style
 * Shows sales by product, top/bottom sellers, and revenue metrics
 * Usage: node analytics-report.js [--product=123] [--start=2024-01-01] [--end=2024-12-31]
 */

require('dotenv').config();
const { sequelize, Product, InvoiceItem, Invoice } = require('./models');
const { Op, fn, col, sequelize: seq } = require('sequelize');

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  params[key.replace('--', '')] = value;
});

async function generateReport() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║           SALES ANALYTICS REPORT (TALLY STYLE)                ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // Period
    const startDate = params.start ? new Date(params.start) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const endDate = params.end ? new Date(params.end) : new Date();
    
    console.log(`📅 Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}\n`);

    let invoiceWhere = {
      invoice_date: {
        [Op.between]: [startDate, endDate]
      }
    };

    // ===== SALES BY PRODUCT =====
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SALES BY PRODUCT TYPE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const sales = await InvoiceItem.findAll({
      where: {
        item_type: 'product',
        ...(params.product && { item_id: parseInt(params.product) })
      },
      attributes: [
        'item_id',
        [fn('SUM', col('quantity')), 'totalQty'],
        [fn('SUM', col('total_price')), 'totalRev'],
        [fn('COUNT', col('InvoiceItem.id')), 'times'],
        [fn('MIN', col('total_price')), 'minSale'],
        [fn('MAX', col('total_price')), 'maxSale'],
        [fn('AVG', col('total_price')), 'avgSale']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: invoiceWhere,
          required: true
        }
      ],
      group: ['InvoiceItem.item_id'],
      order: [[fn('SUM', col('total_price')), 'DESC']],
      raw: true,
      subQuery: false
    });

    if (sales.length > 0) {
      console.log('┌────────┬─────────────────────────┬────────┬────────────┬────────┬────────┬────────┐');
      console.log('│ Item   │ Product Name            │ Qty    │ Revenue    │ Min    │ Max    │ Avg    │');
      console.log('├────────┼─────────────────────────┼────────┼────────────┼────────┼────────┼────────┤');

      let totalQty = 0, totalRev = 0;
      for (const sale of sales) {
        const product = await Product.findByPk(sale.item_id, { attributes: ['name'] });
        const name = (product?.name || 'Unknown').substring(0, 23).padEnd(23);
        const qty = String(sale.totalQty).padStart(6);
        const rev = '₹' + String(Math.round(sale.totalRev)).padStart(9);
        const min = '₹' + String(Math.round(sale.minSale)).padStart(6);
        const max = '₹' + String(Math.round(sale.maxSale)).padStart(6);
        const avg = '₹' + String(Math.round(sale.avgSale)).padStart(6);
        
        console.log(`│ ${String(sale.item_id).padStart(6)} │ ${name} │ ${qty} │ ${rev} │ ${min} │ ${max} │ ${avg} │`);
        
        totalQty += parseInt(sale.totalQty) || 0;
        totalRev += parseFloat(sale.totalRev) || 0;
      }
      
      console.log('├────────┼─────────────────────────┼────────┼────────────┼────────┼────────┼────────┤');
      console.log(`│ TOTAL  │ (${sales.length} products)          │ ${String(totalQty).padStart(6)} │ ₹${String(Math.round(totalRev)).padStart(9)} │        │        │        │`);
      console.log('└────────┴─────────────────────────┴────────┴────────────┴────────┴────────┴────────┘\n');
    } else {
      console.log('   No sales data found for the selected period.\n');
    }

    // ===== TOP SELLERS =====
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏆 TOP 5 BESTSELLERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const topSellers = await InvoiceItem.findAll({
      where: { item_type: 'product' },
      attributes: [
        'item_id',
        [fn('SUM', col('quantity')), 'totalQty'],
        [fn('SUM', col('total_price')), 'totalRev'],
        [fn('COUNT', col('InvoiceItem.id')), 'times']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: invoiceWhere,
          required: true
        }
      ],
      group: ['InvoiceItem.item_id'],
      order: [[fn('SUM', col('total_price')), 'DESC']],
      limit: 5,
      raw: true,
      subQuery: false
    });

    console.log('┌─────┬─────────────────────────┬────────┬────────────┬───────┐');
    console.log('│ Rank│ Product Name            │ Qty    │ Revenue    │ Times │');
    console.log('├─────┼─────────────────────────┼────────┼────────────┼───────┤');

    for (let i = 0; i < topSellers.length; i++) {
      const seller = topSellers[i];
      const product = await Product.findByPk(seller.item_id, { attributes: ['name'] });
      const name = (product?.name || 'Unknown').substring(0, 23).padEnd(23);
      const qty = String(seller.totalQty).padStart(6);
      const rev = '₹' + String(Math.round(seller.totalRev)).padStart(9);
      const times = String(seller.times).padStart(5);
      
      console.log(`│ ${String(i + 1).padStart(4)}│ ${name} │ ${qty} │ ${rev} │ ${times} │`);
    }
    
    console.log('└─────┴─────────────────────────┴────────┴────────────┴───────┘\n');

    // ===== SLOWEST MOVERS =====
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🐌 SLOWEST MOVERS (Least Sold)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const slowMovers = await InvoiceItem.findAll({
      where: { item_type: 'product' },
      attributes: [
        'item_id',
        [fn('SUM', col('quantity')), 'totalQty'],
        [fn('SUM', col('total_price')), 'totalRev']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: invoiceWhere,
          required: true
        }
      ],
      group: ['InvoiceItem.item_id'],
      order: [[fn('SUM', col('quantity')), 'ASC']],
      limit: 5,
      raw: true,
      subQuery: false
    });

    if (slowMovers.length > 0) {
      console.log('┌─────┬─────────────────────────┬────────┬────────────┐');
      console.log('│ Rank│ Product Name            │ Qty    │ Revenue    │');
      console.log('├─────┼─────────────────────────┼────────┼────────────┤');

      for (let i = 0; i < slowMovers.length; i++) {
        const mover = slowMovers[i];
        const product = await Product.findByPk(mover.item_id, { attributes: ['name'] });
        const name = (product?.name || 'Unknown').substring(0, 23).padEnd(23);
        const qty = String(mover.totalQty).padStart(6);
        const rev = '₹' + String(Math.round(mover.totalRev)).padStart(9);
        
        console.log(`│ ${String(i + 1).padStart(4)}│ ${name} │ ${qty} │ ${rev} │`);
      }
      
      console.log('└─────┴─────────────────────────┴────────┴────────────┘\n');
    }

    // ===== SUMMARY STATS =====
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 SUMMARY STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const stats = await Invoice.findOne({
      where: invoiceWhere,
      attributes: [
        [fn('SUM', col('total_amount')), 'totalRev'],
        [fn('COUNT', col('id')), 'totalInv'],
        [fn('AVG', col('total_amount')), 'avgInv'],
        [fn('MIN', col('total_amount')), 'minInv'],
        [fn('MAX', col('total_amount')), 'maxInv']
      ],
      raw: true
    });

    console.log('┌────────────────────────────────────────┐');
    console.log('│ Total Revenue         │ ₹' + String(Math.round(stats.totalRev || 0)).padStart(24) + ' │');
    console.log('│ Total Invoices        │ ' + String(stats.totalInv || 0).padStart(24) + ' │');
    console.log('│ Average Invoice Value │ ₹' + String(Math.round(stats.avgInv || 0)).padStart(24) + ' │');
    console.log('│ Min Invoice Value     │ ₹' + String(Math.round(stats.minInv || 0)).padStart(24) + ' │');
    console.log('│ Max Invoice Value     │ ₹' + String(Math.round(stats.maxInv || 0)).padStart(24) + ' │');
    console.log('└────────────────────────────────────────┘\n');

    console.log('══════════════════════════════════════════════════════════════════\n');

  } catch (err) {
    console.error('Error generating report:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

generateReport();
