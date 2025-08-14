import express from 'express';
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

// Tạo __dirname thủ công vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + req.body.username + '-' + uniqueSuffix + ext);
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
  router.get(`/products`, homeController.allProduct);
  router.post(`/product`, authMiddleware, homeController.addProduct);
  router.put(`/products/:id`, authMiddleware, homeController.updateProduct);
  router.delete(`/products/:id`, authMiddleware, homeController.delProduct);

  // cấu hình lấy sản phẩm theo user truyền vào từ req.body
  router.get('/orders', homeController.getOrder);


router.post("/combine-image", async (req, res) => {
  try {
    const { modelUrl, outfitUrl, prompt } = req.body;

    if (!modelUrl || !outfitUrl) {
      return res.status(400).json({ success: false, error: "Cần gửi đủ modelUrl và outfitUrl" });
    }

    // Chuyển URL ảnh sang base64
    const modelBase64 = await urlToBase64(modelUrl);
    const outfitBase64 = await urlToBase64(outfitUrl);

    // Prompt từ client hoặc mặc định
    const finalPrompt =
      prompt ||
      "Hãy kết hợp người mẫu từ ảnh 1 và trang phục từ ảnh 2, tạo ảnh người mẫu mặc trang phục tự nhiên và chân thực.";

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: finalPrompt },
            { inlineData: { mimeType: "image/png", data: modelBase64 } },
            { inlineData: { mimeType: "image/png", data: outfitBase64 } },
          ],
        },
      ],
      // 🔥 model yêu cầu phải có ["TEXT", "IMAGE"]
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    });

    // Lấy các parts trả về
    const parts = result.response.candidates[0].content.parts;

    // Tìm phần chứa ảnh
    const imagePart = parts.find((p) => p.inlineData);
    if (!imagePart) {
      return res.status(500).json({ success: false, error: "Không tìm thấy ảnh trong response" });
    }

    const imageBase64 = imagePart.inlineData.data;
    const buffer = Buffer.from(imageBase64, "base64");

    // Lưu file vào thư mục
    const destFolder = "uploads/images/products";
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filePath = path.join(destFolder, `combine-${uniqueSuffix}.png`);
    fs.writeFileSync(filePath, buffer);

    // Tìm thêm phần text mô tả (nếu có)
    const textPart = parts.find((p) => p.text);

    res.json({
      success: true,
      prompt: finalPrompt,
      description: textPart ? textPart.text : null,
      savedPath: filePath,
      url: `/uploads/images/products/${path.basename(filePath)}`,
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


  return app.use("/", router);
};

export default initWebRoutes;