import SellerPannel from "../models/sellerPannel.model";


export const createSellerPannel = async (req, res) => {
    try {

        const { userId } = req.params;
        const { coverImage, logo, previewImage, brandyName, brandDescription, brandCategory, brandSubCategory, brandPhone, brandEmail, brandSpeciality, brandFeatures, brandSince,
            sellerName, sellerEmail, sellerPhone,
            gstNumber, panNumber,
            bankName, accountNumber, ifscCode, bankBranch, bankUserName, upi,
            companyLocation, companyAddress,
            pickupLocation, pickupAddress } = req.body;
        
    } catch (err) {
        success: false,
        res.status(500).json({ message: "Failed to create seller pannel", error: err.message });

        
    }
}