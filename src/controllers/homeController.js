import express from 'express'
import db from '../models/index.js'
import CRUDService from "../services/CRUDService.js"
import { raw } from 'mysql2';
import jwt from 'jsonwebtoken';


let getHomePage = async (req,res) =>{
    try {

        return  res.render('homePage.ejs',
        //    {data:JSON.stringify(data)}
        )
    } catch (e) {
        console.log(e)
    }
}


/// Lấy thông tin 1 user khi truyền vào từ link
let getUser = async(req,res) =>{
     //lấy ra id khi truyền vào từ req 
    let id = Number(req.url.replace('/users/',''))
    
    if ((req.user.role ==="admin")||(req.user.id ===id)) {


    let user = await CRUDService.getUser(id)  

    console.log("check req >>>>>:   ",id)
    return  res.json({status:"true", data: user
    
        //message:"Thông tin tất cả sản phẩm! ", 
        })
    }
    else return res.json({status:false, data: {message:`Bạn không có quyền truy xuất thông tin người khác! vì id của url là ${id}`, user: req.user}})


}

// lấy thông tin danh sách user
let allUsers = async(req,res) =>{
        if (req.user.role !=="admin") return res.json({status:false, data:"Bạn không có quyền quản trị!"})

     let Users = await CRUDService.allUsers(req.body)   

    return  res.json({status:"true", data: Users
    
        //message:"Thông tin tất cả sản phẩm! ", 
    })

}
// Tạo user 
let postUser = async(req,res) =>{
    // Gắn đường dẫn ảnh vào req.body
    req.body.pathAvatar = req.file ? `/uploads/images/avatar/${req.file.filename}`: null;

    let status =await CRUDService.createUser(req.body)
    console.log("Check body req >>>>>: ", req.body)
    
    return  res.json({status, message:"Đây là trang add User nhé!!!", })
}

// login user
let loginUser=async(req,res) =>{
    console.log(">>> cookie:  ",req.cookies)
    let status=await CRUDService.login(req.body) 
    if (status) {
         // Tạo session lưu user
        // req.session.user = {
        //     id: status.id,
        //     username: status.username,
        //     role: status.role,
        // }; 
        req.cookies.user= {
            id: status.id,
            username: status.username,
            role: status.role,
            favoriteProducts: status.favoriteProducts,
            cartProducts: status.cartProducts,
        }; 

        const token = jwt.sign(
            req.cookies.user,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        console.log(">> check userSession: ",req.cookies.user)

          // 👉 Set cookie chứa token
        res.cookie("token", token, {
                httpOnly: true,
                secure: true,           // Bắt buộc nếu dùng HTTPS
                sameSite: "Strict",     // Chống CSRF
                maxAge: 24 * 60 * 60 * 1000 // 1 ngày
            });
        return res.json({
            status, 
            token,
            //userSession:req.session.user,
            
            message:`Bạn đăng nhập thành công user ${req.body.username}!!!`})
    } else
    return  res.json({status, message:"Bạn đăng nhập sai username/password!!!"})
}

/// xóa user
let delUser = async(req,res) =>{
    if (req.user.role!=="admin") return res.json({status:false, message:"Bạn không có quyền tác động!!!", })
     let status = await CRUDService.deleteUser(req.body)   
      return  res.json({status, message:`Xóa user ${req.body.username} !!! `})
}

// cập nhật thông tin user
let updateUser= async(req,res) =>{
    console.log('📦 req.body:', req.body); // các trường như name, email
    console.log('📎 req.file:', req.file); // file avatar
    // Gắn đường dẫn ảnh vào req.body
     req.body.pathAvatar = req.file ? `/uploads/images/avatar/${req.file.filename}`: null;

    console.log("Check req.body update user: >>>>:", req.body)
     let status = await CRUDService.updateUser(req.body)
   // console.log("Check req.file update user: >>>>:", req.file)    
      return  res.json({status, message:"vừa thực hiện Update User nhé!!!", })
}
// thêm sản phẩm ưa thích
let addFavoriteProduct = async (req, res) => {
    const userId = req.params.id; // Lấy ID người dùng từ URL
    console.log("Check req.body >>>>:", req.body.productId)
    let status = await CRUDService.addFavoriteProduct(userId, req.body.productId);
    
    // Gọi service để thêm sản phẩm ưa thích
    return res.json(status);
}
// view sản phẩm ưa thích
let viewFavoriteProduct = async (req, res) => {
    const userId = req.params.id; // Lấy ID người dùng từ URL
    let status = await CRUDService.viewFavoriteProduct(userId); // Gọi service để lấy danh sách sản phẩm ưa thích
    return res.json(status);
}
let deFavoriteProduct = async (req, res) => {
    const userId = req.params.id; // Lấy ID người dùng từ URL   
    let status = await CRUDService.deFavoriteProduct(userId, req.body.productId); // Gọi service để lấy danh sách sản phẩm ưa thích
    return res.json(status);    
}

let deCartProduct = async (req, res) => {
    const userId = req.params.id; // Lấy ID người dùng từ URL       
    let status = await CRUDService.deCartProduct(userId, req.body.productId); // Gọi service để lấy danh sách sản phẩm ưa thích
    return res.json(status);
}

// view sản phẩm đã thêm vào giỏ hàng
let viewCartProduct = async (req, res) => {
    const userId = req.params.id; // Lấy ID người dùng từ URL
    let status = await CRUDService.viewCartProduct(userId); // Gọi service để lấy danh sách sản phẩm trong giỏ hàng
    return res.json(status);
}   

// thêm sản phẩm vào giỏ hàng
let addCartProduct = async (req, res) => {
    const userId = req.params.id; // Lấy ID người dùng từ URL
    let status = await CRUDService.addCartProduct(userId, req.body.productId); // Gọi service để thêm sản phẩm ưa thích
    return res.json(status);
}


//lấy hông tin sản phẩm cụ thể

let Product = async(req,res) =>{
    let id = Number(req.url.replace('/products/',''))
    console.log("Check id product >>>>:", id)
   let Product = await CRUDService.Product(id)   

    return  res.json({status:"true", data: Product
    
        //message:"Thông tin sản phẩm cụ thể! ", 
    })
}

// lấy thông tin tất cả sản phẩm
let allProduct = async(req,res) =>{
    let Products = await CRUDService.allProducts(req.body)   

    return  res.json({status:"true", data: Products,
           // views: req.session.views,  // nếu muốn kiểm tra thêm session
            lastVisit: req.cookies.last_visit // nếu muốn trả về cookie
        //message:"Thông tin tất cả sản phẩm! ", 
    })
}

// thêm sản phẩm
let addProduct = async(req,res) =>{
    if (req.user.role!=="admin") return res.json({status:false, message:"Bạn không có quyền tác động!!!", })

    let status = await CRUDService.addProduct(req.body)   
    console.log("Check status >>>>  : ",status)
    return  res.json({status, 
    
        //message:"Bạn vừa cập thêm sản phẩm nhé! ", 
    })
}
let updateProduct= async(req,res) =>{
    let id = Number(req.url.replace('/products/',''))

    if (req.user.role!=="admin") return res.json({status:false, message:"Bạn không có quyền tác động!!!", })
    let status = await CRUDService.updateProduct(req.body,id)   
    console.log("Check status >>>>  : ",status)
    return  res.json({status, 
    
        //message:"Bạn vừa cập cập nhật sản phẩm nhé !", 
    })
}
let delProduct= async(req,res) =>{
    let id = Number(req.url.replace('/products/',''))

    if (req.user.role!=="admin") return res.json({status:false, message:"Bạn không có quyền tác động!!!", })
    let status = await CRUDService.delProduct(id)   
    console.log("Check status >>>>  : ",status)
    return  res.json({status, 
    
         //message:"Bạn vừa xóa sản phẩm nhé !", 
    })
}

// lấy thông tin các đơn hàng của user được truyền vào từ req.body

let getOrder = async (req,res) =>{
    let user =req.body
    let status = await CRUDService.displayOrder(user)
    return res.json({status})
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
}

export default {
    getHomePage,
    getUser,
    allUsers,
    postUser,
    delUser,
    loginUser,
    updateUser,
    Product,
    allProduct,
    addProduct,
    updateProduct,
    delProduct,
    getOrder,
    addFavoriteProduct,
    addCartProduct,
    viewFavoriteProduct,
    viewCartProduct,
    deFavoriteProduct,
    deCartProduct,

}

