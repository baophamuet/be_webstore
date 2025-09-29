'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      orders.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });

      orders.hasMany(models.orderitems, {
        foreignKey: 'order_id',
        as: 'items',
        onDelete: 'CASCADE',
        hooks: true
      });

      orders.belongsToMany(models.products, {
        through: models.orderitems,
        foreignKey: 'order_id',
        otherKey: 'product_id',
        as: 'products'
      });
    }
  }
  orders.init({
    user_id: DataTypes.INTEGER,
    total_price: DataTypes.STRING,
    status: DataTypes.STRING,
    payment: DataTypes.BOOLEAN,
    paymentmethod: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'orders',
     tableName: 'orders' 
  });
  return orders;
};