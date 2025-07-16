'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  categories.init({
    codename: DataTypes.STRING,
    description: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'categories',
  });
  return categories;
};