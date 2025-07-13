import { raw } from 'mysql2'
import { Op } from 'sequelize';
import db from '../models/index.js'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

let displapOrder = () => {


}

let createUser = async(user) => {
    let checkuser = await db.Users.findOne(
        {
            where:{username: user.username,},
            raw: true
        });
    console.log(">>>>> tạo ",checkuser)
    if (checkuser) return false
    return new Promise (async(resolve,reject)=>{
        try {
               let hashUserPasswordFromBcrypt = await hashUserPassword(user.password)
                // let test= hashUserPassword(user.pass)
                await db.Users.create({
                    username: user.username,
                    password: hashUserPasswordFromBcrypt ,
                    email: user.email,
                    full_name: user.full_name,
                    gender: user.gender,
                    role: user.role ,
                    created_at: new Date(),
                })
    
               // console.log(user)
                console.log(hashUserPasswordFromBcrypt)
                resolve(true)
        }catch(e){
                reject(e)
        }

    })
}
let deleteUser = async(user) => {
console.log("xóa username này :    ", user.username)
    return new Promise (async(resolve,reject)=>{
        try {
                // let test= hashUserPassword(user.pass)
               let deletedCount =  await db.Users.destroy({
                    where: {
                        [Op.or]: [
                            { username: user.username },
                            { email: user.email }
                        ]
                    }
                })
                if (deletedCount > 0) {
                    console.log(`✅ Đã xóa thành công ${deletedCount} user`);
                    resolve(true)
                } else {
                    console.log("❌ Không tìm thấy user để xóa");
                    resolve(false)
                }
                
    
        }catch(e){
                reject(e)
        }

    })
}
let login = async(user) => {
    
    let userlogin = await db.Users.findOne(
        {
        where:{username: user.username,},
        raw: true
        });
        console.log("check>> user đăng nhập: ", user)
        console.log("check>> user query: ", userlogin)
    if (!userlogin) {
        console.log(">>>>> case 1") 
        return false}
    else if (await bcrypt.compare(user.password, userlogin.password)) {
        console.log(">>>>> case 2")
        return true}
    else return false
}
let hashUserPassword= (password) => {
    return new Promise(async (resolve,reject) =>{
        try {
            let hash = await bcrypt.hashSync(password,salt)
            resolve(hash)
        }catch(e) {
            reject(e)
        }
    })
}

export default {displapOrder,createUser,deleteUser,login}