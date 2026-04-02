import express from 'express'
import cofig from './config/config.js';
const app = express();
import connectDB from './config/db.js'
import userRoute from './routes/user.routes.js'
import { config } from 'dotenv';
import dns from 'dns';


dns.setServers(["1.1.1.1","8.8.8.8"]);



app.use('/user', userRoute)








app.listen(config.PORT, () => {
    console.log(`server is running `);
    connectDB()

})

