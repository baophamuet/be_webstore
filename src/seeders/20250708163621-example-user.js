'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users",[{
      username: 'nanatran',
      password: 'sdalfkg',
      email: 'nanatran@gmail.com',
      full_name: 'Na Na',
      gender: 'female',
      role: 'user',
      created_at: new Date(),
  }])
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
