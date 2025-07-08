import express from 'express'
let getHomePage = (req,res) =>{
    return  res.render('homePage.ejs')

}

let getUser = (req,res) =>{
    return  res.json({status:true, masssage:"Đây là trang Users nhé!!!", boss:"bao.phamthe đz 10 điểm ạ",})

}
export default {getHomePage,getUser}

