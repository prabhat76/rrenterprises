const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryBatch = sequelize.define('InventoryBatch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    batch_number: {
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiry_date: {
      type: DataTypes.DATEONLY
    },
    bill_image_path: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'inventory_batches',
    timestamps: false
  });

  return InventoryBatch;
};