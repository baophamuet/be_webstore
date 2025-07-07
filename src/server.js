import express from 'express'
import initWebRoutes from './route/web.js'
import configViewEngine from './config/viewEngine.js';
import 'dotenv/config'

const app= express();
const PORT=process.env.PORT;

app.use(express.json());

configViewEngine(app)
initWebRoutes(app)

app.listen(PORT,()=>{
    console.log(`Server is started at ${PORT}......`)
})
