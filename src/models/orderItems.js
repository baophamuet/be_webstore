'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class orderitems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      orderitems.belongsTo(models.orders, { foreignKey: 'order_id', as: 'order' });
      orderitems.belongsTo(models.products, { foreignKey: 'product_id', as: 'product' });
    }
  }
  orderitems.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.STRING,
    price: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'orderitems',
  });
  return orderitems;
};