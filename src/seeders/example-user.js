'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users",[
      {
      username: 'nanatran',
      password: 'sdalfkg',
      email: 'nanatran@gmail.com',
      full_name: 'Na Na',
      gender: 'female',
      role: 'user',
      created_at: new Date(),
  },
  {
      username: 'baophamuet',
      password: '123456',
      email: 'baophamuet@gmail.com',
      full_name: 'Phạm Thế Bảo',
      gender: 'male',
      role: 'admin',
      created_at: new Date(),
  },
  {
      username: 'heheboy',
      password: 'sdalfkg',
      email: 'heheboy@gmail.com',
      full_name: 'He He Boy',
      gender: 'male',
      role: 'user',
      created_at: new Date(),
  },
  
  
])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
