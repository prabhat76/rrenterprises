const { PurchaseInvoice, PurchaseItem } = require('../models');
const { generateInvoiceNumber } = require('../utils/generateInvoiceNumber');

exports.list = async (req, res) => {
  const invoices = await PurchaseInvoice.findAll({ include: PurchaseItem });
  res.json(invoices);
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    data.invoice_number = await generateInvoiceNumber('PUR');
    const inv = await PurchaseInvoice.create(data, { include: [PurchaseItem] });
    res.status(201).json(inv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  const inv = await PurchaseInvoice.findByPk(req.params.id, { include: PurchaseItem });
  if (!inv) return res.status(404).send();
  res.json(inv);
};

exports.remove = async (req, res) => {
  const inv = await PurchaseInvoice.findByPk(req.params.id);
  if (!inv) return res.status(404).send();
  await inv.destroy();
  res.status(204).send();
};