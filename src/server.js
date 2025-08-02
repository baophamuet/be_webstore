import express from 'express'
import initWebRoutes from './route/web.js'
import configViewEngine from './config/viewEngine.js';
import 'dotenv/config'
import connectDB from './config/connectDB.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app= express();
const PORT=process.env.PORT;

// 👉 Di chuyển ra ngoài thư mục src
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));


app.use('/uploads', (req, res, next) => {
  console.log(`[Static File] Request to: ${req.path}`);
  next();
});

// Áp dụng cho các route JSON thông thường
app.use((req, res, next) => {
  if (
    req.headers['content-type'] &&
    req.headers['content-type'].includes('application/json')
  ) {
    express.json()(req, res, next);
  } else {
    next();
  }
});
configViewEngine(app)
initWebRoutes(app)
connectDB(app)

app.listen(PORT,()=>{
    console.log(`Server is started at ${PORT}......`)
})
