const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Explicitly require pg for Vercel serverless
try {
  require('pg');
} catch (err) {
  console.warn('pg package not found:', err.message);
}

const env = (process.env.NODE_ENV || 'development').trim();
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`Database configuration for environment "${env}" not found`);
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);


// import models
const User = require('./user')(sequelize);
const Customer = require('./customer')(sequelize);
const Product = require('./product')(sequelize);
const Service = require('./service')(sequelize);
const Invoice = require('./invoice')(sequelize);
const InvoiceItem = require('./invoiceItem')(sequelize);
const Transaction = require('./transaction')(sequelize);
const PurchaseInvoice = require('./purchaseInvoice')(sequelize);
const PurchaseItem = require('./purchaseItem')(sequelize);
const InventoryBatch = require('./inventoryBatch')(sequelize);
const ProductPhoto = require('./productPhoto')(sequelize);

// associations
User.hasMany(Invoice, { foreignKey: 'createdBy' });
Invoice.belongsTo(User, { foreignKey: 'createdBy' });

Customer.hasMany(Invoice);
Invoice.belongsTo(Customer);

Invoice.hasMany(InvoiceItem, { onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice);

Product.hasMany(InvoiceItem, { foreignKey: 'item_id', constraints: false, scope: { item_type: 'product' } });
Service.hasMany(InvoiceItem, { foreignKey: 'item_id', constraints: false, scope: { item_type: 'service' } });
InvoiceItem.belongsTo(Product, { foreignKey: 'item_id', constraints: false });
InvoiceItem.belongsTo(Service, { foreignKey: 'item_id', constraints: false });

Invoice.hasMany(Transaction);
Transaction.belongsTo(Invoice);

PurchaseInvoice.hasMany(PurchaseItem, { onDelete: 'CASCADE' });
PurchaseItem.belongsTo(PurchaseInvoice);
Product.hasMany(PurchaseItem);
PurchaseItem.belongsTo(Product);

Product.hasMany(InventoryBatch, { foreignKey: 'productId' });
InventoryBatch.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(ProductPhoto);
ProductPhoto.belongsTo(Product);

module.exports = {
  sequelize,
  User,
  Customer,
  Product,
  Service,
  Invoice,
  InvoiceItem,
  Transaction,
  PurchaseInvoice,
  PurchaseItem,
  InventoryBatch,
  ProductPhoto
};