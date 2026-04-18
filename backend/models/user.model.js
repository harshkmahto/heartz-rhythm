import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    profilePicture:{
        url: {
            type: String,
        },
        fileId: {
            type: String,
        },
        thumbnailUrl:{
            type:String,
        },
        
    },
    role:{
        type:String,
        enum:['customer', 'seller', 'admin'], 
        default:'customer'
    
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["active", "pending", "review", ],

    },
    phone:{
        type:Number,

    },
    verified:{
        type:Boolean,
        default:true
    },
   

    
},{
    timestamps:true
})

const userModel = mongoose.model('User', userSchema);

export default userModel;