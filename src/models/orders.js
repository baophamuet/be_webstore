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
      // define association here
    }
  }
  orders.init({
    user_id: DataTypes.INTEGER,
    total_price: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'orders',
  });
  return orders;
};