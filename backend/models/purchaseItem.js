const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseItem = sequelize.define('PurchaseItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    purchase_invoice_id: {
      type: DataTypes.INTEGER,
      field: 'purchase_invoice_id',
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      field: 'product_id',
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return PurchaseItem;
};