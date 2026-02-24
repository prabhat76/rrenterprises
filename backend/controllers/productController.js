const { Product, ProductPhoto, InvoiceItem, Invoice } = require('../models');
const { Op, fn, col, literal, sequelize } = require('sequelize');
const QRCode = require('qrcode');

exports.list = async (req, res) => {
  const products = await Product.findAll({ include: ProductPhoto });
  res.json(products);
};

exports.create = async (req, res) => {
  try {
    const prod = await Product.create(req.body);
    res.status(201).json(prod);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  const prod = await Product.findByPk(req.params.id, { include: ProductPhoto });
  if (!prod) return res.status(404).send();
  res.json(prod);
};

exports.update = async (req, res) => {
  const prod = await Product.findByPk(req.params.id);
  if (!prod) return res.status(404).send();
  await prod.update(req.body);
  res.json(prod);
};

exports.remove = async (req, res) => {
  const prod = await Product.findByPk(req.params.id);
  if (!prod) return res.status(404).send();
  await prod.destroy();
  res.status(204).send();
};

exports.uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const prod = await Product.findByPk(req.params.id);
  if (!prod) return res.status(404).send();
  const photo = await ProductPhoto.create({ productId: prod.id, file_path: req.file.path });
  res.status(201).json(photo);
};

// Generate QR code for product
// Returns QR code as data URL for scanning
exports.generateQR = async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    // Create QR data with product info
    const qrData = {
      type: 'product',
      id: prod.id,
      name: prod.name,
      hsn: prod.hsn_code,
      price: prod.price,
      scanUrl: `${req.protocol}://${req.get('host')}/api/products/scan-qr/${prod.id}`
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2
    });

    res.json({
      product: prod,
      qrCode: qrCodeDataURL,
      qrData: qrData
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Scan QR code and return product data
// Mobile-friendly endpoint
exports.scanQR = async (req, res) => {
  try {
    const productId = req.params.id;
    const prod = await Product.findByPk(productId, {
      attributes: ['id', 'name', 'hsn_code', 'price', 'description']
    });

    if (!prod) return res.status(404).json({ error: 'Product not found' });

    res.json({
      success: true,
      product: prod,
      timestamp: new Date(),
      action: 'scan_success'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Quick add to inventory via QR scan
// Usage: POST /api/products/quick-add with { productId, quantity }
exports.quickAddInventory = async (req, res) => {
  try {
    const { productId, quantity, batchNumber, expiryDate } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity required' });
    }

    const prod = await Product.findByPk(productId);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    // Add to inventory batch
    const { InventoryBatch } = require('../models');
    const batch = await InventoryBatch.create({
      ProductId: productId,
      quantity: quantity,
      batch_number: batchNumber || `BATCH-${Date.now()}`,
      manufacturing_date: new Date(),
      expiry_date: expiryDate || null
    });

    res.status(201).json({
      success: true,
      message: `Added ${quantity} units of ${prod.name} to inventory`,
      product: prod,
      batch: batch
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Tally-style product scanner
// Searches by HSN code or product name
// Usage: /api/products/scan?q=HSN123 or /api/products/scan?q=ProductName
exports.scan = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      // If no query, return all products (paginated)
      const products = await Product.findAll({
        attributes: ['id', 'name', 'hsn_code', 'price', 'description'],
        order: [['name', 'ASC']],
        limit: 50
      });
      return res.json({ results: products, count: products.length });
    }

    // Search by HSN code (exact match first)
    let products = await Product.findAll({
      where: { hsn_code: q },
      attributes: ['id', 'name', 'hsn_code', 'price', 'description']
    });

    // If not found by HSN, search by product name (fuzzy)
    if (products.length === 0) {
      const { Op } = require('sequelize');
      products = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: `%${q}%`
          }
        },
        attributes: ['id', 'name', 'hsn_code', 'price', 'description'],
        limit: 20
      });
    }

    res.json({ 
      results: products, 
      count: products.length,
      query: q 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Sales Analytics - Get sales by product
// Shows quantity sold, revenue, min/max sales per product
exports.salesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, productId } = req.query;

    let whereClause = { item_type: 'product' };
    let invoiceWhere = {};

    if (startDate && endDate) {
      invoiceWhere.invoice_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get sales data per product
    const sales = await InvoiceItem.findAll({
      where: productId ? { ...whereClause, item_id: parseInt(productId) } : whereClause,
      attributes: [
        'item_id',
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', col('total_price')), 'totalRevenue'],
        [fn('MIN', col('total_price')), 'minSale'],
        [fn('MAX', col('total_price')), 'maxSale'],
        [fn('AVG', col('total_price')), 'avgSale'],
        [fn('COUNT', col('id')), 'saleCount']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: invoiceWhere,
          required: true
        }
      ],
      group: ['item_id'],
      raw: true,
      subQuery: false,
      order: [[fn('SUM', col('total_price')), 'DESC']]
    });

    // Enrich with product details
    const enrichedSales = await Promise.all(
      sales.map(async (sale) => {
        const product = await Product.findByPk(sale.item_id, {
          attributes: ['id', 'name', 'hsn_code', 'price']
        });
        return {
          product: product || { id: sale.item_id, name: 'Unknown' },
          ...sale,
          totalQuantity: parseInt(sale.totalQuantity) || 0,
          totalRevenue: parseFloat(sale.totalRevenue) || 0,
          minSale: parseFloat(sale.minSale) || 0,
          maxSale: parseFloat(sale.maxSale) || 0,
          avgSale: parseFloat(sale.avgSale) || 0,
          saleCount: parseInt(sale.saleCount) || 0
        };
      })
    );

    // Calculate summary
    const summary = {
      totalProducts: enrichedSales.length,
      totalQuantitySold: enrichedSales.reduce((sum, s) => sum + s.totalQuantity, 0),
      totalRevenue: enrichedSales.reduce((sum, s) => sum + s.totalRevenue, 0),
      avgRevenuePerProduct: enrichedSales.length > 0 
        ? enrichedSales.reduce((sum, s) => sum + s.totalRevenue, 0) / enrichedSales.length 
        : 0,
      topProduct: enrichedSales[0] || null,
      period: { startDate, endDate }
    };

    res.json({
      summary,
      sales: enrichedSales
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Top Selling Products
// Shows best sellers ranked by quantity and revenue
exports.topSellers = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    let invoiceWhere = {};
    if (startDate && endDate) {
      invoiceWhere.invoice_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const topSellers = await InvoiceItem.findAll({
      where: { item_type: 'product' },
      attributes: [
        'item_id',
        [fn('COUNT', col('id')), 'timeSold'],
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', col('total_price')), 'totalRevenue']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: invoiceWhere,
          required: true
        }
      ],
      group: ['item_id'],
      order: [[fn('SUM', col('total_price')), 'DESC']],
      limit: parseInt(limit),
      raw: true,
      subQuery: false
    });

    // Enrich with product data
    const enriched = await Promise.all(
      topSellers.map(async (seller, rank) => {
        const product = await Product.findByPk(seller.item_id);
        return {
          rank: rank + 1,
          product,
          timeSold: parseInt(seller.timeSold),
          totalQuantity: parseInt(seller.totalQuantity),
          totalRevenue: parseFloat(seller.totalRevenue),
          avgPrice: parseFloat(seller.totalRevenue) / parseInt(seller.totalQuantity)
        };
      })
    );

    res.json({
      period: { startDate, endDate },
      topSellers: enriched
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Bottom Selling Products (Slow movers)
exports.slowMovers = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    let invoiceWhere = {};
    if (startDate && endDate) {
      invoiceWhere.invoice_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const slowMovers = await InvoiceItem.findAll({
      where: { item_type: 'product' },
      attributes: [
        'item_id',
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', col('total_price')), 'totalRevenue']
      ],
      include: [
        {
          model: Invoice,
          attributes: [],
          where: invoiceWhere,
          required: true
        }
      ],
      group: ['item_id'],
      order: [[fn('SUM', col('quantity')), 'ASC']],
      limit: parseInt(limit),
      raw: true,
      subQuery: false
    });

    const enriched = await Promise.all(
      slowMovers.map(async (mover, rank) => {
        const product = await Product.findByPk(mover.item_id);
        return {
          rank: rank + 1,
          product,
          totalQuantity: parseInt(mover.totalQuantity),
          totalRevenue: parseFloat(mover.totalRevenue)
        };
      })
    );

    res.json({
      period: { startDate, endDate },
      slowMovers: enriched
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Sales Summary by Date Range
// Total sales, average, min/max per day
exports.salesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let invoiceWhere = {};
    if (startDate && endDate) {
      invoiceWhere.invoice_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const summary = await Invoice.findAll({
      where: invoiceWhere,
      attributes: [
        'invoice_date',
        [fn('SUM', col('total_amount')), 'dailyRevenue'],
        [fn('COUNT', col('id')), 'invoiceCount'],
        [fn('AVG', col('total_amount')), 'avgInvoiceValue']
      ],
      group: ['invoice_date'],
      order: [['invoice_date', 'DESC']],
      raw: true
    });

    // Global stats
    const globalStats = await Invoice.findOne({
      where: invoiceWhere,
      attributes: [
        [fn('SUM', col('total_amount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalInvoices'],
        [fn('AVG', col('total_amount')), 'avgInvoiceValue'],
        [fn('MIN', col('total_amount')), 'minInvoice'],
        [fn('MAX', col('total_amount')), 'maxInvoice']
      ],
      raw: true
    });

    res.json({
      period: { startDate, endDate },
      globalStats: {
        totalRevenue: parseFloat(globalStats?.totalRevenue) || 0,
        totalInvoices: parseInt(globalStats?.totalInvoices) || 0,
        avgInvoiceValue: parseFloat(globalStats?.avgInvoiceValue) || 0,
        minInvoice: parseFloat(globalStats?.minInvoice) || 0,
        maxInvoice: parseFloat(globalStats?.maxInvoice) || 0
      },
      dailySummary: summary.map(day => ({
        date: day.invoice_date,
        dailyRevenue: parseFloat(day.dailyRevenue),
        invoiceCount: parseInt(day.invoiceCount),
        avgInvoiceValue: parseFloat(day.avgInvoiceValue)
      }))
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};