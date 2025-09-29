'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    // user_id: DataTypes.INTEGER,
    // total_price: DataTypes.STRING,
    // status: DataTypes.STRING,
      user_id: {
        type: Sequelize.INTEGER
      },
      total_price: {
        type: Sequelize.STRING
      },
      status: {
          type: Sequelize.ENUM('pending', 'shipped', 'delivered', 'cancelled')
      },
      payment: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      paymentmethod: {
          type: Sequelize.ENUM('COD', 'ONLINE')
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('orders');
  }
};
