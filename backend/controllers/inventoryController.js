const { InventoryBatch, Product } = require('../models');
const fs = require('fs');
const path = require('path');

exports.list = async (req, res) => {
  const batches = await InventoryBatch.findAll({ include: [Product] });
  res.json(batches);
};

exports.getByProduct = async (req, res) => {
  const batches = await InventoryBatch.findAll({ where: { productId: req.params.productId } });
  res.json(batches);
};

exports.create = async (req, res) => {
  try {
    const batch = await InventoryBatch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const batch = await InventoryBatch.findByPk(req.params.id);
  if (!batch) return res.status(404).send();
  await batch.update(req.body);
  res.json(batch);
};

exports.uploadBill = async (req, res) => {
  try {
    const batchId = req.params.id;
    const batch = await InventoryBatch.findByPk(batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const billPath = `/uploads/bills/${req.file.filename}`;
    
    // Delete old bill if exists
    if (batch.bill_image_path) {
      const oldPath = path.join(process.cwd(), batch.bill_image_path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await batch.update({ bill_image_path: billPath });
    res.json({ billPath, message: 'Bill uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const batch = await InventoryBatch.findByPk(req.params.id);
  if (!batch) return res.status(404).send();
  
  // Delete bill file if exists
  if (batch.bill_image_path) {
    const billPath = path.join(process.cwd(), batch.bill_image_path);
    if (fs.existsSync(billPath)) {
      fs.unlinkSync(billPath);
    }
  }
  
  await batch.destroy();
  res.status(204).send();
};