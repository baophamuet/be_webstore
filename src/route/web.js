import express from 'express'
import homeController from '../controllers/homeController.js';
import multer from 'multer';
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { authMiddleware } from './authMiddleware.js';

// Tạo __dirname thủ công vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let router=express.Router()
let id=1;


// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.path.startsWith('/user')) {
      cb(null, 'uploads/images/avatar');
    } else if (req.path.startsWith('/product')) {
      cb(null, 'uploads/images/products');
    } 
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: originalname + thời gian
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // lấy đuôi file (.jpg, .png...)
    cb(null, file.fieldname + '-' + req.body.username  + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

const initWebRoutes = (app)=>{

  // Middleware cho cookie 
  app.use(cookieParser());

  // Middleware cho session
  // app.use(session({
  //   secret: process.env.SESSION_SECRET || 'heheboydeptraivocungtan', // Nên dùng biến môi trường
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: { 
  //     secure: process.env.NODE_ENV === 'production', // true nếu production (HTTPS)
  //     maxAge: 24 * 60 * 60 * 1000, // 24 giờ
  //     httpOnly: true
  //   }
  // }));

  // Cho phép truy cập ảnh trong thư mục uploads/
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  
  // các FE cho phép gọi xuống BE
  const allowedOrigins = [
    'http://localhost:3000', /// development
    'http://localhost:3001', // development
    'http://localhost:3002', // development
    'http://localhost:3003', // development
    'https://baophamuet.site',
    'https://www.baophamuet.site',
    'https://new.baophamuet.site',
    'https://paper.baophamuet.site',
    
  ];
    //middleware CORS đúng cách
    router.use(function(req, res, next) {
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    
    router.get('/',  homeController.getHomePage)
    router.get('/home', (req,res)=>{
      // Ví dụ sử dụng session
      //req.session.views = (req.session.views || 0) + 1;
      // Ví dụ sử dụng cookie
      res.cookie('last_visit', new Date().toISOString(), { 
        maxAge: 900000, 
        httpOnly: true 
      });
    
        return  res.json({status:true, message:"Đây là trang chủ", boss:"bao.phamthe đz 10 điểm thôi nhé",})
    })
    // cấu hình thêm/lấy/sửa/ xóa user
    router.get('/users',authMiddleware, homeController.allUsers)
    router.get(`/users/:id`,
      authMiddleware,
      
      homeController.getUser)

    router.post(`/user`,upload.single('profile_avt'),
   
    homeController.postUser)
    router.post(`/login`, 
      (req,res)=>{
      // Ví dụ sử dụng session
      //req.session.views = (req.session.views || 0) + 1;
      // Ví dụ sử dụng cookie
      res.cookie('last_visit', new Date().toISOString(), { 
        maxAge: 900000, 
        httpOnly: true 
      });

      homeController.loginUser(req,res)
    })
    router.delete(`/deluser`,authMiddleware, homeController.delUser)
    router.put('/user', 
      authMiddleware,
      upload.single('profile_avt'),
      homeController.updateUser)

    // cấu hình thêm/lấy/sửa/ xóa sản phẩm
    router.get(`/product`,homeController.Product)
    router.get(`/products`,homeController.allProduct)
    router.post(`/product`,homeController.addProduct)
    router.put(`/product`,homeController.updateProduct)
    router.delete(`/product`,homeController.delProduct)

    // cấu hình lấy sản phẩm theo user truyền vào từ req.body
    router.get('/orders',  homeController.getOrder)

    



    


    return app.use("/",router)
}



export default initWebRoutes;