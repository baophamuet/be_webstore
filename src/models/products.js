'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsTo(models.categories, { foreignKey: 'category_id', as: 'category' });

      products.hasMany(models.orderitems, { foreignKey: 'product_id', as: 'order_items' });

      // tiện truy vấn: orders <-> products qua orderitems
      products.belongsToMany(models.orders, {
        through: models.orderitems,
        foreignKey: 'product_id',
        otherKey: 'order_id',
        as: 'orders'
      });
    }
  }
  products.init({
    name: DataTypes.STRING,
    category_id:DataTypes.INTEGER,
    description: DataTypes.TEXT,
    price: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    images: DataTypes.JSON, // Lưu trữ nhiều ảnh dưới dạng JSON
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    modelName: 'products',
  });
  return products;
};