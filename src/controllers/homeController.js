import express from 'express'
import db from '../models/index.js'
import CRUDService from "../services/CRUDService.js"
import { raw } from 'mysql2';

let getHomePage = async (req,res) =>{
    try {

        return  res.render('homePage.ejs',{data:JSON.stringify(data)})
    } catch (e) {
        console.log(e)
    }
}
let getOrder = async (req,res) =>{
    return new Promise(async (resolve,reject) =>{
          try {
            let order =await db.orders.findAll({raw:true,})
            console.log('>>>>>>>>>>>>>> check data:   ',order)
            resolve(order)
        return  res.render(
            'detailOrder.ejs',
            {data:order}
        )
    } catch (e) {
        console.log(e)
    }
    })
}

let getUser = async(req,res) =>{
    let data = await db.Users.findAll({raw:true});
    console.log('>>>>>>>>>>>>>> check data:   ',data)
    return  res.json({status:true, masssage:"Đây là trang Users nhé!!!", boss:"bao.phamthe đz 10 điểm ạ",})

}

let postUser = async(req,res) =>{
    let status =await CRUDService.createUser(req.body)
    return  res.json({status, masssage:"Đây là trang add User nhé!!!", })
}
let loginUser=async(req,res) =>{
    let status=await CRUDService.login(req.body) 
    if (status) {
        return res.json({status, masssage:`Bạn đăng nhập thành công user ${req.body.username}!!!`})
    } else
    return  res.json({status, masssage:"Bạn đăng nhập sai username/password!!!"})
}

let delUser = async(req,res) =>{
     let status = await CRUDService.deleteUser(req.body)   
      return  res.json({status, masssage:"Đây là trang delete User nhé!!!", })
}
export default {getHomePage,getUser,getOrder,postUser,delUser,loginUser}

