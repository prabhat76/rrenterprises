const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseInvoice = sequelize.define('PurchaseInvoice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cgst_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    sgst_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    igst_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  });

  return PurchaseInvoice;
};