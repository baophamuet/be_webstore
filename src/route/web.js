import express from 'express'
import homeController from '../controllers/homeController.js';


let router=express.Router()
let id=1;
const initWebRoutes = (app)=>{
    router.get('/',  homeController.getHomePage)
    router.get('/home', (req,res)=>{
        return  res.json({status:true, message:"Đây là trang chủ", boss:"bao.phamthe đz 10 điểm thôi nhé",})
    })

    // Thêm middleware CORS đúng cách
    router.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    });
    // cấu hình thêm/lấy/sửa/ xóa user
    router.get('/users', homeController.allUsers)
    router.get(`/users/:id`,homeController.getUser)

    router.post(`/user`, homeController.postUser)
    router.post(`/login`, homeController.loginUser)
    router.delete(`/deluser`, homeController.delUser)
    router.put('/user', homeController.updateUser)

    // cấu hình thêm/lấy/sửa/ xóa sản phẩm
    router.get(`/product`,homeController.Product)
    router.get(`/products`,homeController.allProducts)
    router.post(`/product`,homeController.addProduct)
    router.put(`/product`,homeController.updateProduct)
    router.delete(`/product`,homeController.delProduct)

    // cấu hình lấy sản phẩm theo user truyền vào từ req.body
    router.get('/orders',  homeController.getOrder)


    


    return app.use("/",router)
}



export default initWebRoutes;