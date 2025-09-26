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
      pathAvatar: "",
      created_at: new Date(),
      favoriteProducts:JSON.stringify([]),
      cartProducts: JSON.stringify([]),
  },
  {
      username: "baophamuet",
      password: hashUserPassword("123456"),
      email: "baophamuet@gmail.com",
      full_name: "Phạm Thế Bảo",
      gender: "male",
      role: "admin",
      pathAvatar: "",
      created_at: new Date(),
      favoriteProducts:JSON.stringify([]),
      cartProducts: JSON.stringify([]),
  },
  {
      username: "heheboy",
      password: hashUserPassword("sdalfkg"),
      email: "heheboy@gmail.com",
      full_name: "He He Boy",
      gender: "male",
      role: "user",
      pathAvatar: "",
      created_at: new Date(),
      favoriteProducts:JSON.stringify([]),
      cartProducts: JSON.stringify([]),
  },
    {
      username: "123",
      password: hashUserPassword("123"),
      email: "123@gmail.com",
      full_name: "123 nèee",
      gender: "male",
      role: "user",
      pathAvatar: "",
      created_at: new Date(),
      favoriteProducts:JSON.stringify([]),
      cartProducts: JSON.stringify([]),
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
