import express from 'express'
import db from '../models/index.js'
import CRUDService from "../services/CRUDService.js"

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
    try {
        const [order, orderItem] = await Promise.all([
  db.orders.findAll(),
  db.orderItems.findAll()
]);

        console.log('>>>>>>>>>>>>>> check data:   ',order[0].dataValues)

        return  res.render(
            'homePage.ejs',
            
            {data:order[0].dataValues}
        )
    } catch (e) {
        console.log(e)
    }
}

let getUser = (req,res) =>{
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

