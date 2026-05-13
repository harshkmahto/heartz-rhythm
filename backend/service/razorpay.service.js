import Razorpay from 'razorpay'
import cofig from '../config/config.js'
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: cofig.RAZOR_API_KEY,
    key_secret: cofig.RAZOR_API_SECRET
})

export default razorpay;