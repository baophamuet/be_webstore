'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    full_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    role: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Users',
  });
  return Users;
};