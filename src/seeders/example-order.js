'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        user_id: 1,
        total_price: '2498',
        status: 'pending',
        payment: false,
        phone: '1234567890',
        address: '123 Main St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        total_price: '899',
        status: 'shipped',
        payment: true,
        phone: '0987654321',
        address: '456 Elm St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        total_price: '1099',
        status: 'delivered',
        payment: true,
        phone: '1122334455',
        address: '789 Oak St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        total_price: '1199',
        status: 'cancelled',
        payment: false,
        phone: '1234567890',
        address: '123 Main St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        total_price: '799',
        status: 'pending',
        payment: false,
        phone: '0987654321',
        address: '456 Elm St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        total_price: '1099',
        status: 'shipped',
        payment: true,
        phone: '1122334455',
        address: '789 Oak St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        total_price: '1290',
        status: 'delivered',
        payment: true,
        phone: '1122334455',
        address: '789 Oak St, City, Country',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
