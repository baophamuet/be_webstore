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
    const outfitBase64 = await urlToBase64(outfitUrl);

    const finalPrompt =
      prompt ||
      "Edit Image 1 by replacing only the clothing area with the clothing from Image 2. Do not change or regenerate the model’s face, hair, skin, accessories, or background in any way. Strictly preserve the exact face, expression, and identifiable features from Image 1 without alteration. Ensure the clothing fits naturally to the body and posture, maintaining original colors, patterns, textures, and folds from Image 2, and matching lighting and shadows to Image 1";

    // 🔹 Gọi model AI để ghép ảnh
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


  return app.use("/", router);
};

export default initWebRoutes;