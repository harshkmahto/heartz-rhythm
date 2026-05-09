import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        minlength: [10, 'Phone number must be at least 10 digits'],
        maxlength: [10, 'Phone number must not exceed 10 digits'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    alternatePhone: {
        type: String,
       
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        default: 'India',
        trim: true
    },
    addressType: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
    },
    zipCode: {
        type: String,
        required: true,
        trim: true,
        match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit ZIP code']
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    isSelected: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });



const AddressModel = mongoose.model('Address', addressSchema);
export default AddressModel;