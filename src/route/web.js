import express, { Router } from 'express';
import homeController from '../controllers/homeController.js';
import multer from 'multer';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { authMiddleware } from './authMiddleware.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'; // <-- Đảm bảo dòng này ở trên cùng để load biến môi trường
import fs from "fs"; 
import jwt from "jsonwebtoken";


// Tạo __dirname thủ công vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//Lấy thông tin service tạo mask
const SERVICE=process.env.SERVICE;

// Lấy thông tin dự án từ biến môi trường
//const YOUR_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
//const LOCATION = process.env.GOOGLE_CLOUD_LOCATION;

// Khởi tạo bằng API Key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-preview-image-generation",
});

// Hàm tải ảnh từ URL và chuyển sang Base64
async function urlToBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cannot fetch image: ${url}`);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

let router = express.Router();
let id = 1;

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.path.startsWith('/user')) {
      cb(null, 'uploads/images/avatar');
    } else if (req.path.startsWith('/product')) {
      cb(null, 'uploads/images/products');
    } else if (req.path.startsWith('/combine-image')) {
      // Ảnh người mẫu khách hàng upload để thử đồ
      cb(null, 'uploads/images/user');
    }
    
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    if (req.path.startsWith('/user-image')) {
      // Đặt tên riêng cho ảnh user upload
      cb(null, 'user-' + uniqueSuffix + ext);
    } else {
      // Avatar / Product vẫn giữ cách cũ
      cb(null, file.fieldname + '-' + req.body.username + '-' + uniqueSuffix + ext);
    }
  }
});

const upload = multer({ storage: storage });

const initWebRoutes = (app) => {

  // Middleware cho cookie
  app.use(cookieParser());

  // Middleware cho session (nếu bạn không dùng, có thể bỏ comment)
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

  // middleware CORS đúng cách
  router.use(function (req, res, next) {
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

  router.get('/', homeController.getHomePage);
  router.get('/home', (req, res) => {
    res.cookie('last_visit', new Date().toISOString(), {
      maxAge: 900000,
      httpOnly: true
    });
    return res.json({ status: true, message: "Đây là trang chủ", boss: "bao.phamthe đz 10 điểm thôi nhé" });
  });
  //  check token còn hiệu lực
  router.get('/checkauthenticator', (req,res)=>{
      const token = req.cookies.token;
      console.log("check token author:  ",token)
      if (!token) return res.json({status:false, message: "Chưa đăng nhập",token: req.cookies.token})
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          req.user = decoded; // ⚠️ Gắn vào đây để dùng tiếp
          return res.json({status:true, message: "Check authenticator OK "})
        } catch (err) {
          return res.json({status:false, message: "Phiên đăng nhập hết hạn/Token không hợp lệ" });
        }  
        
  });


  // cấu hình thêm/lấy/sửa/ xóa user
  router.get('/users', authMiddleware, homeController.allUsers);
  router.get(`/users/:id`, authMiddleware, homeController.getUser);
  router.post(`/user`, upload.single('profile_avt'), homeController.postUser);
  router.post(`/login`, (req, res) => {
    res.cookie('last_visit', new Date().toISOString(), {
      maxAge: 900000,
      httpOnly: true
    });
    homeController.loginUser(req, res);
  });
  router.post(`/logout`, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,     // nếu https
    sameSite: 'none', // nếu khác origin
    path: '/'
  });
  res.json({ status: true, message: 'Đã đăng xuất' });
});
  router.delete(`/deluser`, authMiddleware, homeController.delUser);
  router.put('/user', authMiddleware, upload.single('profile_avt'), homeController.updateUser);

  // API thêm sản phẩm yêu thích/thêm vào giỏ hàng
  router.post('/users/:id/favorite', authMiddleware, homeController.addFavoriteProduct);
  router.post('/users/:id/cart', authMiddleware, homeController.addCartProduct);
  // API View sản phẩm yêu thích/đã thêm vào giỏ hàng
  router.get('/users/:id/favorite', authMiddleware, homeController.viewFavoriteProduct);
  router.get('/users/:id/cart', authMiddleware, homeController.viewCartProduct);
  // API Xóa sản phẩm yêu thích/thêm vào giỏ hàng
  router.put('/users/:id/favorite', authMiddleware, homeController.deFavoriteProduct);
  router.put('/users/:id/cart', authMiddleware, homeController.deCartProduct);

  // cấu hình thêm/lấy/sửa/ xóa sản phẩm
  router.get(`/products/:id`, homeController.Product);
  router.get(`/products`, homeController.allProducts);
  router.post(`/product`, authMiddleware,upload.array('products_images',10), homeController.addProduct);
  router.put(`/products/:id`, authMiddleware,upload.array('products_images',10), homeController.updateProduct);
  router.delete(`/products/:id`, authMiddleware, homeController.delProduct);

  // cấu hình lấy sản phẩm theo search
  router.post(`/search`, homeController.searchProducts);
  // cấu hình lấy sản phẩm theo user_id truyền vào từ url
  router.get('/users/:id/orders', homeController.getOrder);
  router.get('/users/:user_id/orders/:id', homeController.getOrderDetail);
  // cấu hình insert đơn hàng
  router.post('/users/:user_id/orders/', authMiddleware, homeController.createOrder);


// Route combine
router.post("/combine-image", upload.single("modelFile"), async (req, res) => {
  try {
    const { outfitUrl, prompt } = req.body;
    const modelFile = req.file;

    if (!modelFile) {
      return res.status(400).json({ success: false, error: "Chưa chọn ảnh người mẫu" });
    }
    if (!outfitUrl) {
      return res.status(400).json({ success: false, error: "Thiếu outfitUrl" });
    }

    
    // 🔹 Link ảnh model sau khi upload
    const modelUrl = `/uploads/images/user/${modelFile.filename}`;
    console.log("Ảnh người mẫu đã lưu tại:", modelUrl);

    // 🔹 Đọc file vừa upload từ server để convert base64
    const modelBase64 = fs.readFileSync(modelFile.path).toString("base64");
    

    // 🔹 Gọi API Python để tạo mask từ ảnh model
    console.log("Gọi API generate-mask...");

    const fileBuf = fs.readFileSync(modelFile.path); // multer lưu file 
    const formData = new FormData(); // built-in
    formData.append("file", new Blob([fileBuf], { type: "image/png" }), modelFile.originalname);

    const maskRes = await fetch(`${SERVICE}/generate-mask`, {
      method: "POST",
      body: formData,
    });
    console.log("Status:", maskRes.status);
    if (!maskRes.ok) {
      return res.status(500).json({ success: false, error: "Lỗi khi gọi API generate-mask" });
    }

    const maskData = await maskRes.json();
    if (!maskData?.mask_base64) {
      return res.status(500).json({ success: false, error: "Không nhận được mask từ API" });
    }

    const maskBase64 = maskData.mask_base64;

    
    // 🔹 Nếu muốn debug → lưu mask ra thư mục uploads/masks
    const maskFolder = "uploads/masks";
    if (!fs.existsSync(maskFolder)) fs.mkdirSync(maskFolder, { recursive: true });
    fs.writeFileSync(path.join(maskFolder, `mask-${Date.now()}.png`), Buffer.from(maskData.mask_base64, "base64"));

    // 🔹 Convert outfit sang base64
    const outfitBase64 = await urlToBase64(outfitUrl);

    //Viết prompt cho mô hình
    const finalPrompt = process.env.FINAL_PROMPT.replace(/\\n/g, "\n");
    console.log("check decode prompt:  ",finalPrompt);
  

    // 🔹 Gọi model AI để ghép ảnh
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: finalPrompt },
            { inlineData: { mimeType: "image/png", data: modelBase64 } },
            { inlineData: { mimeType: "image/png", data: outfitBase64 } },
            maskBase64 
              ? { inlineData: { mimeType: "image/png", data: maskBase64 } } 
              : null, // nếu không có mask thì sẽ là null
          ],
        },
      ],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    });

    const parts = result.response.candidates[0].content.parts;
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return res.status(500).json({ success: false, error: "Không tìm thấy ảnh trong response" });
    }

    // 🔹 Lưu ảnh kết quả
    const imageBase64 = imagePart.inlineData.data;
    const buffer = Buffer.from(imageBase64, "base64");

    const destFolder = "uploads/images/try-on-photo";
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    const filePath = path.join(destFolder, `combine-${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log("Ảnh kết quả đã được lưu!!");
    res.json({
      success: true,
      modelUrl, // link ảnh người mẫu đã upload
      outfitUrl,
      resultUrl: `/uploads/images/try-on-photo/${path.basename(filePath)}`, // link ảnh kết quả
      prompt: finalPrompt,
    });
  } catch (error) {
    console.error("Error combining images:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// req.body
// {
//     "modelUrl": "https://bizweb.dktcdn.net/thumb/1024x1024/100/366/703/products/a03-2.jpg?v=1748323626020",
//     "outfitUrl": "https://pos.nvncdn.com/fa2431-2286/ps/20250415_01PEyV81nC.jpeg?v=1744706452",
//     "prompt": "Hãy ghép người mẫu mặc bộ váy này, giữ gương mặt rõ nét."
// }

// Route tải ảnh kết quả try-on
  router.get("/download/tryon/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log("Request tải ảnh:", filename);

  // Chặn path traversal
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return res.status(400).send("Invalid filename");
  }

  const filePath = path.join(__dirname, "../../uploads/images/try-on-photo", filename);
  console.log("Full path:", filePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Not found");
  }

  // Ép tải xuống
  res.download(filePath, filename); // tự set Content-Disposition: attachment
})
  return app.use("/", router);
};

export default initWebRoutes;