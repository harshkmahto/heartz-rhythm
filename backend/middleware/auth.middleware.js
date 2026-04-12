// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import tokenBlacklistModel from '../models/blacklist.model.js';
import config from '../config/config.js';

export const authorized = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }
        
        // Check blacklist
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token invalidated'
            });
        }
        
        // Verify token
        const decode = jwt.verify(token, config.JWT_SECRET);
        if (!decode) {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token invalidated'
            });
        }
        
        if(decode.verify === false){
            res.clearCookie("token");
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Please verify your email to access this resource'
            });
        }

        if(decode.isBlocked === true){
            res.clearCookie("token");
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Your account has been blocked. Please contact support for more information.'
            });
        }

         if(decode.status === "pending" || decode.status === "review"){
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Your seller account is still under review. Please wait for approval to access this resource.'
            });
        }
        
        req.user = decode;
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// Seller middleware - Only users with role "seller" can access
export const isSeller = async (req, res, next) => {
    try {
        // First, check if user is authenticated
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }
        
        // Verify token
        const decode = jwt.verify(token, config.JWT_SECRET);
        
        // Check if user role is seller
        if (decode.role !== 'seller') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Seller access required'
            });
        }

        if(decode.verify === false){
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Please verify your email to access this resource'
            });
        }

        if(decode.isBlocked === true){
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Your account has been blocked. Please contact support for more information.'
            });
        }

        if(decode.status === "pending" || decode.status === "review"){
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Your seller account is still under review. Please wait for approval to access this resource.'
            });
        }
        
        
        // Attach user to request
        req.user = decode;
        next();
        
    } catch (error) {
        console.error('Seller middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token expired'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// Admin middleware - Only users with role "admin" can access
export const isAdmin = async (req, res, next) => {
    try {
        // First, check if user is authenticated
        const token = req.cookies?.token;
        
        if (!token) {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }
        
        // Verify token
        const decode = jwt.verify(token, config.JWT_SECRET);
        
        // Check if user role is admin
        if (decode.role !== 'admin') {
            res.clearCookie("token");
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Admin access required'
            });
        }

        if(decode.verify === false){
            res.clearCookie("token");
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Please verify your email to access this resource'
            });
        }

        if(decode.isBlocked === true){
            res.clearCookie("token");
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Your account has been blocked. Please contact support for more information.'
            });
        }
        
        
        // Attach user to request
        req.user = decode;
        next();
        
    } catch (error) {
        console.error('Admin middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token expired'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};