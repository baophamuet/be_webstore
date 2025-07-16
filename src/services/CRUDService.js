import { raw } from 'mysql2'
import { Op, where } from 'sequelize';
import db from '../models/index.js'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

let getUser = async(id) => {
    let User = await db.Users.findAll({where: {id: id, role: "user"},raw:true})
    if (User?.length) return User
    else {
        let message = `Không tồn tại user người dùng trên hệ thống!`
        return message
    }

}
let allUsers = async() => {
    let Users = await db.Users.findAll({where: {role: 'user' },raw:true})
    if (Users) return {Count:Users.length, Users}
    else {
        let message = `Danh sách chưa có user người dùng nào `
        return message
    }
}
let createUser = async(user) => {
    let checkuser = await db.Users.findOne(
        {
            where:{username: user.username,},
            raw: true
        });
    console.log(">>>>> muốn tạo ",checkuser)
    if (checkuser) {
        console.log("Tạo không thành công do đã tồn tại username")
        return false
    }
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

let updateUser =  async(user) => {
    let hashUserPasswordFromBcrypt = await hashUserPassword(user.password)
    let userDB = await db.Users.findOne(
        {
        where:{username: user.username,},
        raw: true
        });
    if ((!userDB) ) return false;
    
    await db.Users.update(
        {
                    username: user.username,
                    password: hashUserPasswordFromBcrypt ,
                    email: user.email,
                    full_name: user.full_name,
                    gender: user.gender,
                    role: user.role ,
                    updated_at: new Date(),
        },
        {
             where: { username: user.username }
        }
    )

        console.log("check>> user đăng nhập: ", user)
        console.log("check>> user query: ", userDB)
        return true;
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
let Product = async(product) =>{
    let productcheck = await checkproduct(product)
    let masssage
    //kiểm tra tồn tại product này chưa 
    if (productcheck) {
          
        return  productcheck
    }
    else {
        let message = `Không có thông tin về sản phẩm ${product.name}`
        return message
    }
}
let allProducts = async(products) =>{
    let Products = await db.products.findAll({raw:true})
    if (Products)    return Products
    else {
        let message = `Chưa có sản phẩm nào được thêm`
        return message
    }
}
let addProduct = async(product) =>{
    // let checkproduct = await db.products.findOne({
    //     where: {name: product.name},
    //     raw: true
    // })
    // console.log("Check checkproduct >>>>  : ",checkproduct)

    //console.log("Check checkproduct(product) >>>>  : ",await checkproduct(product))
    //kiểm tra tồn tại product này chưa 
    if (await checkproduct(product)) return false
    await db.products.create({
        name: product.name,
        category_id: product.category_id,
        description: product.description,
        price: product.price,
        stock: product.stock,
        created_at: new Date(),
        updated_at: new Date()
    })
    return true

}
let updateProduct = async(product) => {
    let productUpdate = await checkproduct(product)
    //console.log("Check productUpdate >>>>: ",productUpdate)
    //kiểm tra tồn tại product này chưa 
    if (productUpdate)
    {
        await db.products.update(
        {
        "name": product.name,
        "category_id": product.category_id,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "updated_at": new Date(),

        },{
             where: { name: product.name }
        }
    )
    let datenow=new Date()
        console.log("datetime: ",datenow )
        return true

    }
    else return false
}
let delProduct = async(product) => {
    let productUpdate = await checkproduct(product)

    //kiểm tra tồn tại product này chưa 
    if (productUpdate)
    {
        await db.products.destroy(
        {
             where: { id: productUpdate.id }
        }
        )
        return true
    }
    else return false
}

let checkproduct = async(product) => {
    let productquery = await db.products.findOne({
    where: { name: product.name},
    raw:true,
    })
    console.log("Check productquery >>>>: ",productquery)
    if (productquery) {
        return productquery
    }
    else return false
    
}


let displayOrder = async(user) => {
    const orderDetails = []
    // trường hợp không gửi cả thông tin ID của user
    let userquery = await db.Users.findOne({where: {username: user.username}, raw:true})
    console.log('>>>>>>>>>>>>>> check user query:   ',userquery)
    let order = await db.orders.findAll({
        where:{
          user_id: userquery.id,  
        } ,
        raw:true,})
        // return new Promise(async (resolve,reject) =>{
    //       try {
    //         let order =await db.orders.findAll({raw:true,})
    //         console.log('>>>>>>>>>>>>>> check data:   ',order)
    //         resolve(order)
    //     return  res.render(
    //         'detailOrder.ejs',
    //         {data:order}
    //     )
    // } catch (e) {
    //     console.log(e)
    // }
    // })
    
   console.log('>>>>>>>>>>>>>> check data:   ',order)
    for (let i = 0; i < order.length; i++) {
        const orderby = order[i];
        orderDetails.push({
            user_id: orderby.user_id,
            username: user.username,
            order_id: orderby.id,
            status: orderby.status,
            total_price: orderby.total_price,
            created_at: orderby.created_at,
        });
    }
    return {
        masssage:`Chi tiết các lần order của khách ${user.username}`, 
        data: orderDetails
    }

}


export default {
    displayOrder,
    getUser,
    allUsers,
    createUser,
    deleteUser,
    login,
    updateUser,
    Product,
    allProducts,
    addProduct,
    updateProduct,
    delProduct,

}