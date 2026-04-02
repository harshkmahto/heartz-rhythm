import dotenv from 'dotenv';
dotenv.config()

if(!process.env.DB_URI){
    throw new Error("DB_URI Variable are missing")
}
if(!process.env.PORT){
    throw new Error("PORT Variable are missing")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET Variable are missing")
}



const cofig = {
    DB_URI: process.env.DB_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET
}

export default cofig;