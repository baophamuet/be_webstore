'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1 user có nhiều orders
      users.hasMany(models.orders, { foreignKey: 'user_id', as: 'orders' });
    }
  }
  users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    full_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    role: DataTypes.STRING,
    pathAvatar: DataTypes.STRING,
    created_at: DataTypes.DATE,
    favoriteProducts : DataTypes.JSON,
    cartProducts : DataTypes.JSON

  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'users',
  });
  return users;
};