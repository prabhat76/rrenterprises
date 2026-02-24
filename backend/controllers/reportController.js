const { Invoice, Customer, Transaction, Product, PurchaseInvoice } = require('../models');
const { sequelize } = require('../models');

exports.salesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate || endDate) {
      where.invoice_date = {};
      if (startDate) where.invoice_date[sequelize.Op.gte] = startDate;
      if (endDate) where.invoice_date[sequelize.Op.lte] = endDate;
    }
    const invoices = await Invoice.findAll({ where, include: [Customer] });
    const total = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    res.json({ invoices, total, count: invoices.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.paymentReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate || endDate) {
      where.transaction_date = {};
      if (startDate) where.transaction_date[sequelize.Op.gte] = startDate;
      if (endDate) where.transaction_date[sequelize.Op.lte] = endDate;
    }
    const transactions = await Transaction.findAll({ where });
    const total = transactions.reduce((sum, trx) => sum + parseFloat(trx.amount), 0);
    res.json({ transactions, total, count: transactions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.purchaseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate || endDate) {
      where.purchase_date = {};
      if (startDate) where.purchase_date[sequelize.Op.gte] = startDate;
      if (endDate) where.purchase_date[sequelize.Op.lte] = endDate;
    }
    const invoices = await PurchaseInvoice.findAll({ where });
    const total = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    res.json({ invoices, total, count: invoices.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};