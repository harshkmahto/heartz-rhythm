import ProductModel from "../models/product.model.js";
import SellerPannel from "../models/sellerPannel.model.js";
import { uploadImage, deleteImage, updateImage } from "../service/imagekit.service.js";

export const createSellerPannel = async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            brandName, brandDescription, 
            brandCategory, brandSubCategory, brandPhone, brandEmail, 
            brandSpeciality, brandFeatures, brandSince,
            sellerName, sellerEmail, sellerPhone,
            gstNumber, panNumber,
            bankName, accountNumber, ifscCode, bankBranch, bankUserName, upi,
            companyLocation, companyAddress,
            pickupLocation, pickupAddress, status
        } = req.body;

        // Check if seller panel already exists
        const existingPanel = await SellerPannel.findOne({ user: userId });
        
        if (existingPanel) {
            return res.status(400).json({
                success: false,
                message: "Seller panel already exists for this user. Use update endpoint instead."
            });
        }

         let parsedFeatures = brandFeatures;
        if (typeof brandFeatures === 'string') {
            try {
                parsedFeatures = JSON.parse(brandFeatures);
            } catch (e) {
                parsedFeatures = brandFeatures.split(',').map(f => f.trim());
            }
        }
        if (!Array.isArray(parsedFeatures)) {
            parsedFeatures = [];
        }


        // Upload images to ImageKit
        let coverImageUrl = null;
        let logoUrl = null;
        let previewImageUrls = [];

        // Upload cover image if provided
        if (req.files?.coverImage) {
            const uploadResult = await uploadImage(req.files.coverImage[0], "seller-panel/cover");
            coverImageUrl = uploadResult.url;
        }

        // Upload logo if provided
        if (req.files?.logo) {
            const uploadResult = await uploadImage(req.files.logo[0], "seller-panel/logo");
            logoUrl = uploadResult.url;
        }

        // Upload preview images (max 3)
        if (req.files?.previewImage && req.files.previewImage.length > 0) {
            const maxImages = Math.min(req.files.previewImage.length, 3);
            for (let i = 0; i < maxImages; i++) {
                const uploadResult = await uploadImage(req.files.previewImage[i], "seller-panel/previews");
                previewImageUrls.push(uploadResult.url);
            }
        }

        // Create new seller panel
        const newSellerPanel = await SellerPannel.create({
            user: userId,
            coverImage: coverImageUrl,
            logo: logoUrl,
            previewImage: previewImageUrls,
            brandName, 
            brandDescription,
            brandCategory, 
            brandSubCategory, 
            brandPhone, 
            brandEmail,
            brandSpeciality, 
            brandFeatures: parsedFeatures, 
            brandSince,
            sellerName, 
            sellerEmail, 
            sellerPhone,
            gstNumber, 
            panNumber,
            bankName, 
            accountNumber, 
            ifscCode, 
            bankBranch, 
            bankUserName, 
            upi,
            companyLocation, 
            companyAddress,
            pickupLocation, 
            pickupAddress,
            status: status || 'inactive'
        });

        return res.status(201).json({
            success: true,
            message: "Seller panel created successfully",
            data: newSellerPanel  
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to create seller panel", 
            error: err.message 
        });
    }
};


// Update Media - cover, logo, preview images
export const updateSellerMedia = async (req, res) => {
    try {
        const { userId } = req.params;
        const { removeCoverImage, removeLogo, removePreviewImages } = req.body;

        // Check if seller panel exists
        const existingPanel = await SellerPannel.findOne({ user: userId });
        
        if (!existingPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found. Please create one first."
            });
        }

        let updateData = {};

        // Handle Cover Image
        if (req.files?.coverImage) {
            // Delete old cover image if exists (you need to store fileId in schema)
            if (existingPanel.coverImage && existingPanel.coverImageId) {
                await deleteImage(existingPanel.coverImageId);
            }
            
            const uploadResult = await uploadImage(req.files.coverImage[0], "seller-panel/cover");
            updateData.coverImage = uploadResult.url;
            updateData.coverImageId = uploadResult.fileId;
        } else if (removeCoverImage === 'true' && existingPanel.coverImage) {
            if (existingPanel.coverImageId) {
                await deleteImage(existingPanel.coverImageId);
            }
            updateData.coverImage = null;
            updateData.coverImageId = null;
        }

        // Handle Logo
        if (req.files?.logo) {
            if (existingPanel.logo && existingPanel.logoId) {
                await deleteImage(existingPanel.logoId);
            }
            
            const uploadResult = await uploadImage(req.files.logo[0], "seller-panel/logo");
            updateData.logo = uploadResult.url;
            updateData.logoId = uploadResult.fileId;
        } else if (removeLogo === 'true' && existingPanel.logo) {
            if (existingPanel.logoId) {
                await deleteImage(existingPanel.logoId);
            }
            updateData.logo = null;
            updateData.logoId = null;
        }

        // Handle Preview Images
        if (req.files?.previewImage && req.files.previewImage.length > 0) {
            const maxImages = Math.min(req.files.previewImage.length, 3);
            const newPreviewImages = [];
            const newPreviewImageIds = [];
            
            // Delete old preview images if replacing
            if (removePreviewImages === 'true' && existingPanel.previewImageIds) {
                for (const fileId of existingPanel.previewImageIds) {
                    await deleteImage(fileId);
                }
                updateData.previewImage = [];
                updateData.previewImageIds = [];
            }
            
            // Upload new preview images
            for (let i = 0; i < maxImages; i++) {
                const uploadResult = await uploadImage(req.files.previewImage[i], "seller-panel/previews");
                newPreviewImages.push(uploadResult.url);
                newPreviewImageIds.push(uploadResult.fileId);
            }
            
            if (removePreviewImages === 'true') {
                updateData.previewImage = newPreviewImages;
                updateData.previewImageIds = newPreviewImageIds;
            } else {
                const existingPreviews = existingPanel.previewImage || [];
                const existingIds = existingPanel.previewImageIds || [];
                updateData.previewImage = [...existingPreviews, ...newPreviewImages].slice(0, 3);
                updateData.previewImageIds = [...existingIds, ...newPreviewImageIds].slice(0, 3);
            }
        } else if (removePreviewImages === 'true' && existingPanel.previewImageIds) {
            for (const fileId of existingPanel.previewImageIds) {
                await deleteImage(fileId);
            }
            updateData.previewImage = [];
            updateData.previewImageIds = [];
        }

        // Update seller panel
        const updatedSellerPanel = await SellerPannel.findByIdAndUpdate(
            existingPanel._id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Media updated successfully",
            data: updatedSellerPanel
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to update media", 
            error: err.message 
        });
    }
};


// Update Basic Details - Public view
export const updateBasicDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            brandName, brandDescription, 
            brandCategory, brandSubCategory, brandPhone, brandEmail, 
            brandSpeciality, brandFeatures, brandSince,
            companyLocation, companyAddress,
            sellerName, status
        } = req.body;

        // Check if seller panel exists
        const existingPanel = await SellerPannel.findOne({ user: userId });
        
        if (!existingPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found. Please create one first."
            });
        }

        // Parse brandFeatures if it's a string
        let parsedFeatures = brandFeatures;
        if (typeof brandFeatures === 'string') {
            try {
                parsedFeatures = JSON.parse(brandFeatures);
            } catch (e) {
                parsedFeatures = brandFeatures.split(',').map(f => f.trim());
            }
        }

        // Update only basic details fields
        const updateData = {
            brandName,
            brandDescription,
            brandCategory,
            brandSubCategory,
            brandPhone,
            brandEmail,
            brandSpeciality,
            brandFeatures: parsedFeatures,
            brandSince,
            companyLocation,
            companyAddress,
            sellerName,
            status
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedSellerPanel = await SellerPannel.findByIdAndUpdate(
            existingPanel._id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Basic details updated successfully",
            data: updatedSellerPanel
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to update basic details", 
            error: err.message 
        });
    }
};


// Update Personal Details - Private
export const updatePersonalDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            sellerEmail, sellerPhone,
            gstNumber, panNumber,
            bankName, accountNumber, ifscCode, bankBranch, bankUserName, upi,
            pickupLocation, pickupAddress, status
        } = req.body;

        // Check if seller panel exists
        const existingPanel = await SellerPannel.findOne({ user: userId });
        
        if (!existingPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found. Please create one first."
            });
        }

        // Update only personal details fields
        const updateData = {
            sellerEmail,
            sellerPhone,
            gstNumber,
            panNumber,
            bankName,
            accountNumber,
            ifscCode,
            bankBranch,
            bankUserName,
            upi,
            pickupLocation,
            pickupAddress,
            status
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedSellerPanel = await SellerPannel.findByIdAndUpdate(
            existingPanel._id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Personal details updated successfully",
            data: updatedSellerPanel
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to update personal details", 
            error: err.message 
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'active' or 'inactive'."
            });
        }

        const sellerPanel = await SellerPannel.findOne({ user: userId });

        if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
        
        }

        sellerPanel.status = status;
        await sellerPanel.save();

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: sellerPanel
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: error.message
        });
        
    }
}

// Get Seller Panel
export const getMySellerPanel = async (req, res) => {
    try {
        
        const userId = req.user.id; 

        const sellerPanel = await SellerPannel.findOne({ user: userId })
            .populate('user', 'name email'); 

       

        // Return all data 
        return res.status(200).json({
            success: true,
            data: sellerPanel
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to fetch seller panel", 
            error: err.message 
        });
    }
};


// GET ALL SELLER FOR PUBLIC
export const getAllSellerPanels = async (req, res) => {
    try {

        const query = { status: 'active'}

        const sellerPanels = await SellerPannel.find(query)
            .select('coverImage logo previewImage brandName brandDescription brandCategory brandSubCategory brandPhone brandEmail brandSpeciality brandFeatures brandSince sellerName companyLocation reviews  ');
            
        return res.status(200).json({
            success: true,
            count: sellerPanels.length,
            data: sellerPanels
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to fetch seller panels", 
            error: err.message 
        });
    }
};


// GET SINGLE SELLER FOR PUBLIC
export const getSellerPanelById = async (req, res) => {
    try {
        const { panelId } = req.params;


        const sellerPanel = await SellerPannel.findOne({
            _id: panelId,
            status: 'active'
        }).select('coverImage logo previewImage brandName brandDescription brandCategory brandSubCategory brandPhone brandEmail brandSpeciality brandFeatures brandSince sellerName companyLocation reviews ');

        if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
        }

        
        const products = await ProductModel.find({ 
            sellerPanel: panelId,
            status: 'active',
            isBlocked: false, 
        })
        .select('title thumbnail category  discount ') 
        .sort({ createdAt: -1 }); 

        return res.status(200).json({
            success: true,
            data: {
                sellerInfo: sellerPanel,
                products: {
                    count: products.length,
                    list: products
                }
            }
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to fetch seller panel", 
            error: err.message 
        });
    }
};

//GET SELLER FOR ADMIN
export const getSellerForAdmin = async (req, res) => {
    try {
        const sellerPanels = await SellerPannel.find()
        
        return res.status(200).json({
            success: true,
            count: sellerPanels.length,
            data: sellerPanels
        });
     
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to fetch seller panels", 
            error: err.message 
        });
    }
};

// GET SINGLE SELLER FOR ADMIN
export const getSellerByIdForAdmin = async (req, res) => {
    try {
        const { pannelId } = req.params;  

        const sellerPanel = await SellerPannel.findById(pannelId)  
            .populate('user', 'name email');

        if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: sellerPanel  
        });

    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to fetch seller information", 
            error: err.message 
        });
    }
};

