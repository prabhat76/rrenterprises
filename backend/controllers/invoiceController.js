const { Invoice, InvoiceItem, Transaction, Product, InventoryBatch, Customer } = require('../models');
const { generateInvoiceNumber } = require('../utils/generateInvoiceNumber');
const { sequelize } = require('../models');

exports.list = async (req, res) => {
  const invoices = await Invoice.findAll({ 
    include: [{ model: InvoiceItem, include: [Product] }, Transaction, Customer],
    order: [['createdAt', 'DESC']]
  });
  res.json(invoices);
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    data.invoice_number = await generateInvoiceNumber();
    data.total_amount = 0; // Will be calculated from line items
    const inv = await Invoice.create(data);
    res.status(201).json(inv);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  const inv = await Invoice.findByPk(req.params.id, { 
    include: [{ model: InvoiceItem, include: [Product] }, Transaction, Customer]
  });
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
  // Restore inventory when deleting invoice
  const items = await InvoiceItem.findAll({ where: { invoiceId: inv.id } });
  for (const item of items) {
    if (item.item_type === 'product') {
      const batches = await InventoryBatch.findAll({ where: { ProductId: item.item_id } });
      if (batches.length > 0) {
        batches[0].quantity += item.quantity;
        await batches[0].save();
      }
    }
  }
  await inv.destroy();
  res.status(204).send();
};

// Add line item to invoice
exports.addLineItem = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { product_id, quantity, unit_price } = req.body;

    const inv = await Invoice.findByPk(invoiceId);
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check stock availability
    const batches = await InventoryBatch.findAll({ where: { ProductId: product_id } });
    const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
    
    if (totalStock < quantity) {
      return res.status(400).json({ error: `Insufficient stock. Available: ${totalStock}` });
    }

    // Create line item
    const totalPrice = quantity * unit_price;
    const lineItem = await InvoiceItem.create({
      invoiceId,
      item_id: product_id,
      item_type: 'product',
      quantity,
      unit_price,
      total_price: totalPrice
    });

    // Deduct stock from first available batch
    let remainingQty = quantity;
    for (const batch of batches) {
      if (remainingQty <= 0) break;
      const deductQty = Math.min(batch.quantity, remainingQty);
      batch.quantity -= deductQty;
      await batch.save();
      remainingQty -= deductQty;
    }

    // Update invoice total
    const items = await InvoiceItem.findAll({ where: { invoiceId } });
    const newTotal = items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
    await inv.update({ total_amount: newTotal });

    res.status(201).json(lineItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update line item
exports.updateLineItem = async (req, res) => {
  try {
    const { lineItemId } = req.params;
    const { quantity, unit_price } = req.body;

    const item = await InvoiceItem.findByPk(lineItemId);
    if (!item) return res.status(404).json({ error: 'Line item not found' });

    const oldQty = item.quantity;
    const qtyDiff = quantity - oldQty;

    // Check stock if quantity increased
    if (qtyDiff > 0) {
      const batches = await InventoryBatch.findAll({ where: { ProductId: item.item_id } });
      const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
      
      if (totalStock < qtyDiff) {
        return res.status(400).json({ error: `Cannot increase qty. Only ${totalStock} available.` });
      }

      // Deduct additional stock
      let remainingQty = qtyDiff;
      for (const batch of batches) {
        if (remainingQty <= 0) break;
        const deductQty = Math.min(batch.quantity, remainingQty);
        batch.quantity -= deductQty;
        await batch.save();
        remainingQty -= deductQty;
      }
    } else if (qtyDiff < 0) {
      // Return stock if quantity decreased
      const batches = await InventoryBatch.findAll({ where: { ProductId: item.item_id } });
      if (batches.length > 0) {
        batches[0].quantity += Math.abs(qtyDiff);
        await batches[0].save();
      }
    }

    const newTotal = quantity * unit_price;
    await item.update({ quantity, unit_price, total_price: newTotal });

    // Recalculate invoice total
    const items = await InvoiceItem.findAll({ where: { invoiceId: item.invoiceId } });
    const invoiceTotal = items.reduce((sum, i) => sum + parseFloat(i.total_price || 0), 0);
    await Invoice.update({ total_amount: invoiceTotal }, { where: { id: item.invoiceId } });

    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete line item
exports.deleteLineItem = async (req, res) => {
  try {
    const { lineItemId } = req.params;
    const item = await InvoiceItem.findByPk(lineItemId);
    if (!item) return res.status(404).json({ error: 'Line item not found' });

    // Return stock
    const batches = await InventoryBatch.findAll({ where: { ProductId: item.item_id } });
    if (batches.length > 0) {
      batches[0].quantity += item.quantity;
      await batches[0].save();
    }

    const invoiceId = item.invoiceId;
    await item.destroy();

    // Recalculate invoice total
    const remaining = await InvoiceItem.findAll({ where: { invoiceId } });
    const newTotal = remaining.reduce((sum, i) => sum + parseFloat(i.total_price || 0), 0);
    await Invoice.update({ total_amount: newTotal }, { where: { id: invoiceId } });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const inv = await Invoice.findByPk(req.params.id);
    if (!inv) return res.status(404).send();
    
    const { amount, transaction_date, payment_method, notes } = req.body;
    const trx = await Transaction.create({ 
      invoiceId: inv.id, 
      amount, 
      transaction_date, 
      payment_method, 
      notes 
    });

    // Calculate total paid
    const transactions = await Transaction.findAll({ where: { invoiceId: inv.id } });
    const totalPaid = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    // Update invoice status
    let status = 'draft';
    if (totalPaid > 0 && totalPaid < inv.total_amount) status = 'partial';
    if (totalPaid >= inv.total_amount) status = 'paid';
    
    await inv.update({ status });
    
    res.status(201).json({ transaction: trx, invoiceStatus: status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get invoice with full details (for view/print)
exports.getInvoiceDetail = async (req, res) => {
  try {
    const inv = await Invoice.findByPk(req.params.id, {
      include: [
        { model: InvoiceItem, include: [Product] },
        { model: Transaction },
        { model: Customer }
      ]
    });
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    // Calculate totals and balance
    const items = inv.InvoiceItems || [];
    const subtotal = items.reduce((sum, i) => sum + parseFloat(i.total_price || 0), 0);
    const transactions = inv.Transactions || [];
    const paidAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const balanceDue = subtotal - paidAmount;

    res.json({
      ...inv.toJSON(),
      subtotal,
      paidAmount,
      balanceDue,
      paymentHistory: transactions
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};