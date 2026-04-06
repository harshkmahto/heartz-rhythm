import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "token is required to be added in blacklist"],
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",

    }

},{
    timestamps:true
})

const tokenBlacklistModel = mongoose.model("blacklistToken", blacklistTokenSchema)

export default tokenBlacklistModel;