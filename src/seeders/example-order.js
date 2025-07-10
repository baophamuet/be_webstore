'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        user_id: 1,
        total_price: '2498',
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        total_price: '899',
        status: 'shipped',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 3,
        total_price: '1099',
        status: 'delivered',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        total_price: '1199',
        status: 'cancelled',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        total_price: '799',
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 3,
        total_price: '1099',
        status: 'shipped',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        total_price: '1290',
        status: 'delivered',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
