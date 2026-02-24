const { Invoice, PurchaseInvoice } = require('../models');

exports.generateInvoiceNumber = async () => {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const count = await Invoice.count({ where: { invoice_number: { [require('sequelize').Op.like]: `INV-${today}-%` } } });
  return `INV-${today}-${String(count + 1).padStart(4, '0')}`;
};

exports.generatePurchaseInvoiceNumber = async () => {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const count = await PurchaseInvoice.count({ where: { invoice_number: { [require('sequelize').Op.like]: `PUR-${today}-%` } } });
  return `PUR-${today}-${String(count + 1).padStart(4, '0')}`;
};