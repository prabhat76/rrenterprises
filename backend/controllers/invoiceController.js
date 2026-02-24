const { Invoice, InvoiceItem, Transaction } = require('../models');
const { generateInvoiceNumber } = require('../utils/generateInvoiceNumber');

exports.list = async (req, res) => {
  const invoices = await Invoice.findAll({ include: [InvoiceItem, Transaction] });
  res.json(invoices);
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    data.invoice_number = await generateInvoiceNumber();
    const inv = await Invoice.create(data, { include: [InvoiceItem] });
    res.status(201).json(inv);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  const inv = await Invoice.findByPk(req.params.id, { include: [InvoiceItem, Transaction] });
  if (!inv) return res.status(404).send();
  res.json(inv);
};

exports.update = async (req, res) => {
  const inv = await Invoice.findByPk(req.params.id);
  if (!inv) return res.status(404).send();
  await inv.update(req.body);
  res.json(inv);
};

exports.remove = async (req, res) => {
  const inv = await Invoice.findByPk(req.params.id);
  if (!inv) return res.status(404).send();
  await inv.destroy();
  res.status(204).send();
};

exports.recordPayment = async (req, res) => {
  const inv = await Invoice.findByPk(req.params.id);
  if (!inv) return res.status(404).send();
  const { amount, transaction_date, payment_method, notes } = req.body;
  const trx = await Transaction.create({ invoiceId: inv.id, amount, transaction_date, payment_method, notes });
  res.status(201).json(trx);
};