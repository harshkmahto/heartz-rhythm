import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import userModel from "../models/user.model.js";



export const register = async (req, res) => {
   try {
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

    await user.save();

   } catch (error) {
     res.status(500).json({
        message:'Internal server error'
     })

   }
 


}

export const login = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({
            message:'Internal server error'
        })
    }
    
}

export const logout = async (req, res) => {
    
}

export const updateProfile = async (req, res) => {

    try {
        
    } catch (error) {
        res.status(500).json({
            message:'Internal server error'
        })
    }
    
}

export const getProfile = async (req, res) => {
   try {
     const token = req.headers.authorization.split(' ')[1];
    
    if(!token){
        return res.status(401).json({
            message:'Unauthorized'
        })
    }
    
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({
            message:'Unauthorized'
        })
    }

    const user = await userModel.findById(decoded.id);
    if(!user){
        return res.status(404).json({
            message:'User not found'
        })
    }


    res.status(200).json({
        message:'Profile fetched successfully',
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
   } catch (error) {
    
    res.status(500).json({
        message:'Internal server error'
    })
   }
}

