"use strict";
import bcrypt from 'bcryptjs'

/** @type {import("sequelize-cli").Migration} */
const hashUserPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);        // tạo salt đồng bộ
  return bcrypt.hashSync(password, salt);     // mã hóa đồng bộ, trả về chuỗi string
};
export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users",[
      {
      username: "nanatran",
      password: hashUserPassword("sdalfkg"),
      email: "nanatran@gmail.com",
      full_name: "Na Na",
      gender: "female",
      role: "user",
      created_at: new Date(),
  },
  {
      username: "baophamuet",
      password: hashUserPassword("123456"),
      email: "baophamuet@gmail.com",
      full_name: "Phạm Thế Bảo",
      gender: "male",
      role: "admin",
      created_at: new Date(),
  },
  {
      username: "heheboy",
      password: hashUserPassword("sdalfkg"),
      email: "heheboy@gmail.com",
      full_name: "He He Boy",
      gender: "male",
      role: "user",
      created_at: new Date(),
  },
      //   "username": "heheboy",
      // "password": "sdalfkg",
      // "email": "heheboy@gmail.com",
      // "full_name": "He He Boy",
      // "gender": "male",
      // "role": "user",
  
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
