const { Customer } = require('../models');

exports.list = async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
};

exports.create = async (req, res) => {
  try {
    const c = await Customer.create(req.body);
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).send();
  res.json(customer);
};

exports.update = async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).send();
  await customer.update(req.body);
  res.json(customer);
};

exports.remove = async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).send();
  await customer.destroy();
  res.status(204).send();
};