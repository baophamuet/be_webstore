'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'iPhone 15 Pro Max',
        category_id: 4,
        description: 'Flagship Apple smartphone',
        price: '1299',
        stock: 50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        category_id: 4,
        description: 'High-end Android smartphone',
        price: '1199',
        stock: 30,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Xiaomi 14 Ultra',
        category_id: 4,
        description: 'Affordable flagship with strong camera',
        price: '899',
        stock: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Google Pixel 8 Pro',
        category_id: 4,
        description: 'Clean Android experience with AI camera',
        price: '1099',
        stock: 40,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'OnePlus 12',
        category_id: 4,
        description: 'Smooth performance, fast charging',
        price: '799',
        stock: 70,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sony Xperia 1 V',
        category_id: 4,
        description: 'Pro-grade camera and display',
        price: '1290',
        stock: 25,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Asus ROG Phone 7',
        category_id: 4,
        description: 'Gaming smartphone with powerful specs',
        price: '1099',
        stock: 60,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
