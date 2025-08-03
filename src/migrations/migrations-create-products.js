'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    //       name: DataTypes.STRING,
    // description: DataTypes.TEXT,
    // price: DataTypes.STRING,
    // stock: DataTypes.INTEGER,
    // created_at: DataTypes.DATE
      name: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.INTEGER
      },
      images: {
        type: Sequelize.JSON, // Hoặc Sequelize.ARRAY(Sequelize.STRING) nếu dùng PostgreSQL
        defaultValue: [],     // Giá trị mặc định là mảng rỗng
        allowNull: true       // Cho phép NULL nếu cần
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
