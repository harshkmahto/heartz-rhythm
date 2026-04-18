import userModel from "../models/user.model.js";
import tokenBlacklistModel from "../models/blacklist.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import nodemailer from 'nodemailer';
import otpModel from '../models/otp.model.js';
import { generateOTP, sendOTPEmail } from '../service/registred.email.service.js'
import userBinModel from "../models/userBin.model.js";
import { uploadImage, deleteImage, updateImage } from "../service/imagekit.service.js";
import SellerPannel from "../models/sellerPannel.model.js"



export const register = async (req, res) => {
   try {
     const {name, email, password, } = req.body;

    const isAlreadyRegistered = await userModel.findOne({ email });
    if(isAlreadyRegistered){
        return res.status(409).json({
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
        success:true,
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
        message:'Internal server error',
        error: error.message
     
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
        const otpRecord = await otpModel.findOne({ email, otp,  });
        
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
            status: 'active', 
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
            email:user.email,
            role:user.role,
            verify:user.verified,
            isBlocked:user.isBlocked,
            status:user.status,
        }, config.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie("token", token)

        res.status(200).json({
            message:"user logged in Successfully",
            user:{
                id: user._id,
                username: user.name,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture,
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
        
        
        if (!name && !phone ) {
            return res.status(400).json({
                success: false,
                message: 'At least one field e is required to update'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = Number(phone);


        // Update user in database
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
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


export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Get current user to check existing profile picture
        const currentUser = await userModel.findById(userId).select('profilePicture');
        
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let uploadResult;
        
        if (currentUser.profilePicture?.fileId) {
            uploadResult = await updateImage(
                currentUser.profilePicture.fileId,
                req.file,
                "hertzrhyth/profiles"
            );
        } else {
            // Upload new profile picture
            uploadResult = await uploadImage(req.file, "hertzrhyth/profiles");
        }
        
        if (!uploadResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to upload profile picture'
            });
        }

        // Update user with new profile picture
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                profilePicture: {
                    url: uploadResult.url,
                    fileId: uploadResult.fileId,
                    thumbnailUrl: uploadResult.thumbnailUrl
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePicture: updatedUser.profilePicture,
                role: updatedUser.role,
                isBlocked: updatedUser.isBlocked,
                status: updatedUser.status,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Update profile picture error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


export const deleteProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (!user.profilePicture?.fileId) {
            return res.status(400).json({
                success: false,
                message: 'No profile picture to delete'
            });
        }
        
        // Delete from ImageKit
        await deleteImage(user.profilePicture.fileId);
        
        // Remove profile picture from database
        user.profilePicture = undefined;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Profile picture deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete profile picture error:', error);
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
                phone: user.phone,
                profilePicture: user.profilePicture,
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
                phone: user.phone,
                profilePicture: user.profilePicture,
                role: user.role,
                isBlocked: user.isBlocked,
                verified: user.verified,
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
                phone: user.phone,
                profilePicture: user.profilePicture,
                role: user.role,
                isBlocked: user.isBlocked,
                verified: user.verified,
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
                phone: seller.phone,
                profilePicture: seller.profilePicture,
                role: seller.role,
                isBlocked: seller.isBlocked,
                verified: seller.verified,
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


// Delete user for admin - SIMPLE VERSION
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;
        const reason = req.body.reason;

        // Get admin email from database - SIMPLE!
        const admin = await userModel.findById(adminId).select('email');
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const userToDelete = await userModel.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }   

        if(userToDelete._id.toString() === adminId.toString()){
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        const movedToBin = await userBinModel.create({
            originalUserId: userToDelete._id,
            name: userToDelete.name,
            email: userToDelete.email,
            password: userToDelete.password,
            phone: userToDelete.phone,
            role: userToDelete.role,
            isBlocked: userToDelete.isBlocked,
            status: userToDelete.status,
            verified: userToDelete.verified,
            createdAt: userToDelete.createdAt,
            updatedAt: userToDelete.updatedAt,
            deletedBy: adminId,
            deletedByEmail: admin.email,  
            deletedAt: new Date(),
            deletionReason: reason || 'Deleted by admin'
        });

        if (!movedToBin) {
            return res.status(500).json({
                success: false,
                message: 'Failed to move user to bin'
            });
        }

        await tokenBlacklistModel.create({
            token: userToDelete._id,
            userId: userToDelete._id
        });

        await otpModel.deleteMany({ email: userToDelete.email });

        const deletedUser = await userModel.findByIdAndDelete(userId);
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {
                deleteUser: {
                    id: deletedUser._id,
                    name: deletedUser.name,
                    email: deletedUser.email,
                    role: deletedUser.role,
                },
                binRecord: {
                    id: movedToBin._id,
                    deletionReason: movedToBin.deletionReason
                }
            }
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


// Update User Role, Status, Block Status, Verification
export const updateUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;
        const { role, isBlocked, verified, status } = req.body;
        
        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Prevent admin from modifying themselves
        if (userId === adminId) {
            return res.status(403).json({
                success: false,
                message: 'Admin cannot modify their own account through this endpoint'
            });
        }
        
        // Track what changes are being made
        const updates = {};
        
        // Update role with validation
        if (role !== undefined) {
            if (!['customer', 'seller', 'admin'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Allowed: customer, seller, admin'
                });
            }
            
            // Prevent demoting the last admin
            if (user.role === 'admin' && role !== 'admin') {
                const adminCount = await userModel.countDocuments({ role: 'admin' });
                if (adminCount <= 1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannot demote the last admin user'
                    });
                }
            }
            
            user.role = role;
            updates.role = role;
        }
        
        // Update status with validation
        if (status !== undefined) {
            if (!['active', 'pending', 'review'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Allowed: active, pending, review'
                });
            }
            user.status = status;
            updates.status = status;
        }
        
        // Update block status
        if (isBlocked !== undefined) {
            if (typeof isBlocked !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'isBlocked must be a boolean value'
                });
            }
            user.isBlocked = isBlocked;
            updates.isBlocked = isBlocked;
            
            // If blocking, invalidate their tokens
            if (isBlocked === true) {
                await tokenBlacklistModel.create({
                    token: user._id,
                    userId: user._id,
                    reason: req.body.blockReason || 'User blocked by admin'
                });
            }
        }
        
        // Update verification status
        if (verified !== undefined) {
            if (typeof verified !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'verified must be a boolean value'
                });
            }
            user.verified = verified;
            updates.verified = verified;
        }
        
        // Check if any updates were made
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update. Provide role, isBlocked, verified, or status'
            });
        }
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            updates: updates,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isBlocked: user.isBlocked,
                status: user.status,
                verified: user.verified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        
    } catch (error) {
        console.error('Admin update user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};



// Get all deleted users

export const getDeletedUsers = async (req, res) => {
    try {
        const deletedUsers = await userBinModel.find()
            .populate('deletedBy', 'name email role')
            .sort({ deletedAt: -1 });
        
        res.status(200).json({
            success: true,
            message: 'Deleted users fetched successfully',
            count: deletedUsers.length,
            deletedUsers: deletedUsers.map(user => ({
                id: user._id,
                originalUserId: user.originalUserId,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                isBlocked: user.isBlocked,
                verified: user.verified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedBy: user.deletedBy,
                deletedByRole: user.deletedByRole,
                deletedAt: user.deletedAt,
                deletionReason: user.deletionReason
            }))
        });
    } catch (error) {
        console.error('Get deleted users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Restore user from bin 
export const restoreUser = async (req, res) => {
    try {
        const { binId } = req.params;
        const { isBlocked, status, verified } = req.body;
        
        // Find the deleted user record in bin
        const deletedUserRecord = await userBinModel.findById(binId);
        
        if (!deletedUserRecord) {
            return res.status(404).json({
                success: false,
                message: 'Deleted user record not found in bin'
            });
        }
        
        // Check if user already exists in main collection
        const existingUser = await userModel.findOne({ 
            $or: [
                { email: deletedUserRecord.email },
                { _id: deletedUserRecord.originalUserId }
            ]
        });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists in main database. Cannot restore.'
            });
        }
        
       
        const restoredUser = await userModel.create({
            _id: deletedUserRecord.originalUserId,
            name: deletedUserRecord.name,
            email: deletedUserRecord.email,
            password: deletedUserRecord.password,
            phone: deletedUserRecord.phone,
            role: deletedUserRecord.role,
            isBlocked: isBlocked !== undefined ? isBlocked : deletedUserRecord.isBlocked,
            status: status || deletedUserRecord.status,
            verified: verified !== undefined ? verified : deletedUserRecord.verified,
            createdAt: deletedUserRecord.createdAt,
            updatedAt: new Date()
        });
        
        
        await userBinModel.findByIdAndDelete(binId);
        
        res.status(200).json({
            success: true,
            message: 'User restored successfully',
            user: {
                id: restoredUser._id,
                name: restoredUser.name,
                email: restoredUser.email,
                role: restoredUser.role,
                status: restoredUser.status,

                isBlocked: restoredUser.isBlocked,
                verified: restoredUser.verified,
                createdAt: restoredUser.createdAt,
                updatedAt: restoredUser.updatedAt,
            }
        });
        
    } catch (error) {
        console.error('Restore user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// Get single deleted user from bin
export const getSingleDeletedUser = async (req, res) => {
    try {
        const { binId } = req.params;
        
        const deletedUser = await userBinModel.findById(binId)
            .populate('deletedBy', 'name email role');
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'Deleted user not found in bin'
            });
        }
        
        res.status(200).json({
            success: true,
            user: {
                id: deletedUser._id,
                originalUserId: deletedUser.originalUserId,
                name: deletedUser.name,
                email: deletedUser.email,
                phone: deletedUser.phone,
                role: deletedUser.role,
                isBlocked: deletedUser.isBlocked,
                status: deletedUser.status,
                verified: deletedUser.verified,
                createdAt: deletedUser.createdAt,
                updatedAt: deletedUser.updatedAt,
                deletedAt: deletedUser.deletedAt,
                deletedBy: deletedUser.deletedBy,
                deletedByEmail: deletedUser.deletedByEmail,
                deletionReason: deletedUser.deletionReason
            }
        });
    } catch (error) {
        console.error('Get single deleted user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// Permanently delete User

export const permanentDeleteUser = async (req, res) => {
    try {
        const { binId } = req.params;
        const { verificationCode } = req.body;
        
        const REQUIRED_CODE = config.PERMANENT_DELETE_CODE || "9565";
        
        if (!verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Verification code is required for permanent deletion'
            });
        }
        
        if (verificationCode !== REQUIRED_CODE) {
            return res.status(403).json({
                success: false,
                message: 'Invalid verification code. This action has been logged.'
            });
        }
        
        // Get user details before deletion for audit
        const userToDelete = await userBinModel.findById(binId);
        
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Deleted user record not found in bin'
            });
        }
        
        // Perform permanent deletion
        const deletedUser = await userBinModel.findByIdAndDelete(binId);
        
        res.status(200).json({
            success: true,
            message: 'User permanently deleted from bin',
            deletedUser: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email,
                originalUserId: deletedUser.originalUserId
            }
        });
        
    } catch (error) {
        console.error('Permanent delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};



//GET SELLER PROFILE

export const getSellerWithPanelById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find seller and check if exists and is seller
        const seller = await userModel.findById(userId).select('-password');
        
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (seller.role !== 'seller') {
            return res.status(400).json({
                success: false,
                message: 'This user is not a seller'
            });
        }
        
        // Find seller panel
        const sellerPanel = await SellerPannel.findOne({ user: userId });
  
        res.status(200).json({
            success: true,
            seller: seller, 
            sellerPanel: sellerPanel || null  
        });
        
    } catch (error) {
        console.error('Get seller with panel error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};