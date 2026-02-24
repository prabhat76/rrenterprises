const { InventoryBatch, Product } = require('../models');

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

exports.remove = async (req, res) => {
  const batch = await InventoryBatch.findByPk(req.params.id);
  if (!batch) return res.status(404).send();
  await batch.destroy();
  res.status(204).send();
};