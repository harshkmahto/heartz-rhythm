import userModel from "../models/user.model.js";
import tokenBlacklistModel from "../models/blacklist.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import nodemailer from 'nodemailer';
import otpModel from '../models/otp.model.js';
import { generateOTP, sendOTPEmail } from '../service/registred.email.service.js'




export const register = async (req, res) => {
   try {
     const {name, email, password, } = req.body;

    const isAlreadyRegistered = await userModel.findOne({ email });
    if(isAlreadyRegistered){
        res.status(409).json({
            message:'User already registered'
        
        })
}
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password:hashedPassword,
        role: "customer",
        isBlocked: false,
        status:"active",
    });

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, config.JWT_SECRET, {
        expiresIn: '1d'
    })

    res.cookie("token", token)

    res.status(201).json({
        message:'User registered successfully',
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            status: user.status,

        },
        token
    })


   } catch (error) {
     res.status(500).json({
        message:'Internal server error'
     })

   }
 

}


export const sellerRegister = async (req, res)=>{
   try {
     const { name, email, password, phone } = req.body;

    const isAlready = await userModel.findOne({ email });
    if(isAlready){
        return res.status(409).json({
            message:"User Already Exist"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    await otpModel.create({
        email,
        otp,
        type: 'seller_register'
    })

    await sendOTPEmail(email, name, otp);



    const tempToken = jwt.sign({
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'seller'
    }, config.JWT_SECRET, {
        expiresIn: '10m'
    })


    res.status(200).json({
        message:'OTP sent to your email',
        tempToken:tempToken,
        email
    })
   } catch (err) {
    return res.status(500).json({
        message:err
    })
    
   }


}

export const verifySellerOTP = async (req, res) => {
    try {
        const { email, otp, tempToken } = req.body;
        
        // Verify OTP
        const otpRecord = await otpModel.findOne({ email, otp, type: 'seller_register' });
        
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        
        // Decode temp token to get user data
        let userData;
        try {
            userData = jwt.verify(tempToken, config.JWT_SECRET);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Registration session expired. Please register again."
            });
        }
        
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        
        // Create user
        const user = await userModel.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            role: 'seller',
            isBlocked: false,
            status: 'pending', 
            verified: true 
        });
        
        // Delete used OTP
        await otpModel.deleteOne({ _id: otpRecord._id });
        
        // Generate login token
        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, config.JWT_SECRET, {
            expiresIn: '1d'
        });
        
        res.cookie("token", token);
        
        res.status(201).json({
            success: true,
            message: "Email verified and registration completed successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
                status: user.status,
                verified: user.verified
            },
            token
        });
        
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        
        // Delete old OTPs for this email
        await otpModel.deleteMany({ email, type: 'seller_register' });
        
        // Generate new OTP
        const otp = generateOTP();
        
        // Save new OTP
        await otpModel.create({
            email,
            otp,
            type: 'seller_register'
        });
        
        // Send OTP via email
        await sendOTPEmail(email, "User", otp);
        
        res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        });
        
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const login = async (req, res) => {

    try {

        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email })

        if(!user){
            return res.status(401).json({
                message:"invalid credential"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(401).json({
                message: "invalid credential"
            })
        }

        const token = jwt.sign({
            id:user._id,
            role:user.role
        }, config.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.cookie("token", token)

        res.status(200).json({
            message:"user logged in Successfully",
            user:{
                id: user._id,
                username: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
                status: user.status,
            }
        })

        
    } catch (error) {
        res.status(500).json({
            message:'Internal server error'
        })
    }
    
}

export const logout = async (req, res) => {
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"user logout successfully"
    })
    
}

export const logoutallDevice = async (req, res)=>{
    const token = req.cookies.token

    const decoded = jwt.decode(token)

    if(token){
        await tokenBlacklistModel.create({
            token:token,
            userId: decoded.id
        })


    }


    res.clearCookie("token")

    res.status(200).json({
        message:"user logout successfully from All Devices"
    })
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;

        if (!name && !phone) {
            return res.status(400).json({
                success: false,
                message: 'At least one field is required to update'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;

        // FIXED: Changed "uopdateData" to "updateData"
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,  // ← This was the bug
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                isBlocked: updatedUser.isBlocked,
                status: updatedUser.status,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const forgetPassword = async (req, res) => {
    try {
            const { email } = req.body;

                const user = await userModel.findOne({ email });
            if(!user){
                return res.status(404).json({
                    message:'User not found'
                })
            }

            const otp = generateOTP();

            await otpModel.create({
                email,
                otp,
                type: 'forget_password'
            })

            await sendOTPEmail(email, user.name, otp);

            return res.status(200).json({
                success:true,
                message:'OTP sent to your email'
            })
            
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        })
        
    }

}    

 export const verifyForgetOTP = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        // Validate input
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP, and new password are required'
            });
        }
        
        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        
        // Find OTP record
        const otpRecord = await otpModel.findOne({
            email,
            otp,
            type: 'forget_password'
        });
        
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
        
        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        

        user.password = hashedPassword;
        await user.save();
        

        await otpModel.deleteOne({ _id: otpRecord._id });
        

        await tokenBlacklistModel.create({
            token: user._id,
            userId: user._id
        });
        

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.'
        });
        
    } catch (error) {
        console.error('Verify forget OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// Resend OTP for forget password
export const resendForgetOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }
        
        // Delete old OTPs
        await otpModel.deleteMany({ email, type: 'forget_password' });
        
        // Generate new OTP
        const otp = generateOTP();
        await otpModel.create({
            email,
            otp,
            type: 'forget_password'
        });
        
        // Send OTP
        await sendOTPEmail(email, user.name, otp);
        
        res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        });
        
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password ,newPassword } = req.body;

        if (!email || !password || !newPassword) {
            return res.status(400).json({
                message: 'Email, Password new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid current password'
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await tokenBlacklistModel.create({
            token: user._id,
            userId: user._id
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

        
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        })
        
    }
}

export const getProfile = async (req, res) => {
   try {
    
    const userId = req.user.id;

    const user = await userModel.findById(userId).select('-password');
    if(!user){
        return res.status(404).json({
            message:'User not found'
        })
    }

    res.status(200).json({
        message:'Profile fetched successfully',
        user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
    })
   } catch (error) {
    
    res.status(500).json({
        message:'Internal server error'
    })
   }
}


//@get all user for admin 
export const getAllUser = async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json({
            message: 'Users fetched successfully',
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

//@get single user for admin
export const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'User fetched successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Get single user error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

//@get All seller for admin
export const getAllSeller = async (req, res) => {
    try {
        const sellers = await userModel.find({ role: 'seller' }).select('-password');
        res.status(200).json({
            message: 'Sellers fetched successfully',
            sellers: sellers.map(seller => ({
                id: seller._id,
                name: seller.name,  
                email: seller.email,
                role: seller.role,
                isBlocked: seller.isBlocked,
                status: seller.status,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }))
        });
    } catch (error) {
        console.error('Get all sellers error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}
