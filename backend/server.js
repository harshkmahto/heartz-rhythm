import express from 'express'
import config from './config/config.js';
import cors from 'cors';
const app = express();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'
import userRoute from './routes/user.routes.js'
import dns from 'dns';


dns.setServers(["1.1.1.1","8.8.8.8"]);


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());




app.use('/user', userRoute)







app.listen(config.PORT, () => {
    console.log(`server is running `);
    connectDB()

})

