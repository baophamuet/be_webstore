import express from 'express'
import initWebRoutes from './route/web.js'
import configViewEngine from './config/viewEngine.js';
import 'dotenv/config'
import connectDB from './config/connectDB.js';

const app= express();
const PORT=process.env.PORT;

app.use(express.json());

configViewEngine(app)
initWebRoutes(app)
connectDB(app)

app.listen(PORT,()=>{
    console.log(`Server is started at ${PORT}......`)
})
