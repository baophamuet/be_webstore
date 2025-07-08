import express from 'express'
import db from '../models/index.js'


let getHomePage = async (req,res) =>{
    try {
        let data = await db.Users.findAll();
        //console.log('>>>>>>>>>>>>>> check data:   ',data)

        return  res.render('homePage.ejs',{data:JSON.stringify(data)})
    } catch (e) {
        console.log(e)
    }
    

}

let getUser = (req,res) =>{
    return  res.json({status:true, masssage:"Đây là trang Users nhé!!!", boss:"bao.phamthe đz 10 điểm ạ",})

}
export default {getHomePage,getUser}

