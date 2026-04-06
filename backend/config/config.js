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

if(!process.env.EMAIL_USER){
    throw new Error("Email USER variable are missing")
}

if(!process.env.EMAIL_PASS){
    throw new Error("Email PASS variable are missing") 
}


const cofig = {
    DB_URI: process.env.DB_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
}

export default cofig;