'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderitems', [
      {
        order_id: 1,
        product_id: 1,
        quantity: '1',
        price: '1299',
        created_at: new Date()
      },
      {
        order_id: 1,
        product_id: 2,
        quantity: '1',
        price: '1199',
        created_at: new Date()
      },
      {
        order_id: 2,
        product_id: 3,
        quantity: '1',
        price: '899',
        created_at: new Date()
      },
      {
        order_id: 3,
        product_id: 4,
        quantity: '1',
        price: '1099',
        created_at: new Date()
      },
      {
        order_id: 4,
        product_id: 2,
        quantity: '1',
        price: '1199',
        created_at: new Date()
      },
      {
        order_id: 5,
        product_id: 5,
        quantity: '1',
        price: '799',
        created_at: new Date()
      },
      {
        order_id: 6,
        product_id: 4,
        quantity: '1',
        price: '1099',
        created_at: new Date()
      },
      {
        order_id: 7,
        product_id: 6,
        quantity: '1',
        price: '1290',
        created_at: new Date()
      },
      {
        order_id: 7,
        product_id: 7,
        quantity: '1',
        price: '1099',
        created_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orderitems', null, {});
  }
};
