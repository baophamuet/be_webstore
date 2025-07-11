import express from 'express'
import db from '../models/index.js'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

let displapOrder = () => {


}

let createUser = async(user) => {
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
                resolve("Ok Create User")
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
                    where:{
                        username: user.username,
                        email: user.email
                    }

                })
                if (deletedCount > 0) {
                    console.log(`✅ Đã xóa thành công ${deletedCount} user`);
                } else {
                    console.log("❌ Không tìm thấy user để xóa");
                }
                resolve("Ok Create User")
    
        }catch(e){
                reject(e)
        }

    })
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
export default {displapOrder,createUser,deleteUser}