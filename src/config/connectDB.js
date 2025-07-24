import { Sequelize } from "sequelize"
import 'dotenv/config'


const sequelize = new Sequelize(
     process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    //process.env.DB_PASSWORD,
    null,
    {
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "logging": false,
    }   
)
    // "username": process.dotenv.DB_USERNAME,
    // "password": process.dotenv.DB_PASSWORD,
    // "database": process.dotenv.DB_DATABASE_NAME,
    // "host": process.dotenv.DB_HOST,
    // "port": process.dotenv.DB_PORT,
    // "dialect": process.dotenv.DB_DIALECT,
    // "logging": process.dotenv.DB_TIMEZONE,

let  connectDB = async() =>{
    try {
        await sequelize.authenticate();
        console.log("Connection succsessfully!!!")
    } catch (e){
        console.error("Unable to connect to DB: ",e)
    }
} 

export default connectDB;