import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import userModel from "../models/user.model.js";



export const register = async (req, res) => {
    const {name, email, password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({email});
    if(isAlreadyRegistered){
        res.status(409).json({
            message:'User already registered'
        
        })
}
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
        name,
        email,
        password:hashedPassword
    });

    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: '1d'
    })

    res.status(201).json({
        message:'User registered successfully',
        user:{
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    })
 


}

export const login = async (req, res) => {
    
}

export const logout = async (req, res) => {
    
}

export const updateProfile = async (req, res) => {
    
}

export const getProfile = async (req, res) => {
    
}