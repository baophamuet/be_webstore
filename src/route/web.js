import express from 'express'
import homeController from '../controllers/homeController.js';


let router=express.Router()
let id=1;
const initWebRoutes = (app)=>{
    router.get('/',  homeController.getHomePage)
    router.get('/home', (req,res)=>{
        return  res.json({status:true, masssage:"Đây là trang chủ", boss:"bao.phamthe đz 10 điểm thôi nhé",})
    })
    router.get('/users', homeController.getUser)
    router.get('/users/1', (req,res)=>{
        return  res.json({status:true, masssage:"Đây là trang user1",})
    })

    router.get('/orders',  homeController.getOrder)
    // router.post(`/users/`, (req,res) =>{
    //     let {user} = req.body
    //      return  res.json({status:true, masssage:`Bạn vừa yêu cầu post user có id bằng ${id=id+1} `, masssage2: user})
    // })

    router.post(`/user`, homeController.postUser)
    router.post(`/login`, homeController.loginUser)
    router.delete(`/deluser`, homeController.delUser)
    router.put('/user', homeController.updateUser)

    


    return app.use("/",router)
}



export default initWebRoutes;