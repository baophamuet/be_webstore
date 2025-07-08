import express from 'express'

let router=express.Router()

const initWebRoutes = (app)=>{
    router.get('/', (req,res)=>{
        return  res.json({status:true, masssage:"Đây là trang chủ", boss:"bao.phamthe đz 10 điểm thôi nhé",})
    })
    router.get('/home', (req,res)=>{
        return  res.json({status:true, masssage:"Đây là trang chủ", boss:"bao.phamthe đz 10 điểm thôi nhé",})
    })
    router.get('/users', (req,res)=>{
        return  res.json({status:true, masssage:"Đây là trang List users",})
    })
    router.get('/users/1', (req,res)=>{
        return  res.json({status:true, masssage:"Đây là trang user1",})
    })
    return app.use("/",router)
}

export default initWebRoutes;