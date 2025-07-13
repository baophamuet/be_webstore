"use strict";

/** @type {import("sequelize-cli").Migration} */
export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("categories",[
      {
      codename: "Đồ đông",
      description: "áo",
      parent_id: null,
      created_at: new Date(),
  },
  {
      codename: "Đồ đông",
      description: "quần",
      parent_id: null,
      created_at: new Date(),
  },
  {
      codename: "Đồ đông",
      description: "giày",
      parent_id: null,
      created_at: new Date(),
  },
   {
      codename: "Đồ điện tử",
      description: "Điện thoại",
      parent_id: null,
      created_at: new Date(),
  },
    // codename: DataTypes.STRING,
    // description: DataTypes.STRING,
    // parent_id: DataTypes.INTEGER,
    // created_at: DataTypes.DATE
])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
  }
};
