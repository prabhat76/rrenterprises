const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductPhoto = sequelize.define('ProductPhoto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    file_path: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return ProductPhoto;
};