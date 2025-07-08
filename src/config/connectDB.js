import { Sequelize } from "sequelize"

const sequelize = new Sequelize(
     "webstore",
    "root",
    null,
    {
        "host": "127.0.0.1",
        "dialect": "mysql"
    }   
)

let  connectDB = async() =>{
    try {
        await sequelize.authenticate();
        console.log("Connection succsessfully!!!")
    } catch (e){
        console.error("Unable to connect to DB: ",e)
    }
} 

export default connectDB;