import express from 'express'
import db from '../models/index.js'
import CRUDService from "../services/CRUDService.js"
import { raw } from 'mysql2';

let getHomePage = async (req,res) =>{
    try {
        let data = await db.Users.findAll();
        //console.log('>>>>>>>>>>>>>> check data:   ',data)

        return  res.render('homePage.ejs',{data:JSON.stringify(data)})
    } catch (e) {
        console.log(e)
    }
    

}
let getOrder = async (req,res) =>{
    return new Promise(async (resolve,reject) =>{
          try {
            let order =await db.orders.findAll({raw:true,})
  //db.orderItems.findAll()
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

let getUser = (req,res) =>{
   // await CRUDService.readUser(req)
    return  res.json({status:true, masssage:"Đây là trang Users nhé!!!", boss:"bao.phamthe đz 10 điểm ạ",})

}

let postUser = async(req,res) =>{
    await CRUDService.createUser(req.body) 
    
      return  res.json({status:true, masssage:"Đây là trang add User nhé!!!", })
}
let delUser = async(req,res) =>{
    await CRUDService.deleteUser(req.body) 
    
      return  res.json({status:true, masssage:"Đây là trang delete User nhé!!!", })
}
export default {getHomePage,getUser,getOrder,postUser,delUser}

