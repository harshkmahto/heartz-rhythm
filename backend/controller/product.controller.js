import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import { uploadImage } from "../service/imagekit.service.js";
import SellerPannel from "../models/sellerPannel.model.js";



// ---- SELLER -----

// CREATE PRODUCT - BY SELLER
export const createProduct = async (req, res) => {
    try {
        let data = req.body;

        if (data.productData) {
            data = JSON.parse(data.productData);
        }

        data.seller = req.user.id; 

        const sellerPanel = await SellerPannel.findOne({ 
            user: req.user.id
        });

        if (!sellerPanel) {
            return res.status(400).json({
                success: false,
                message: "Seller profile not found. Please complete your seller registration first.",
            });
        }

        if (data.brand && data.brand !== sellerPanel.brandName) {
        return res.status(400).json({
            success: false,
            message: `Product brand must match your registered brand: ${sellerPanel.brandName}`,
        });
        }

       
        if (!data.brand) {
        data.brand = sellerPanel.brandName;
        }

        data.sellerPanel = sellerPanel._id;

        
        const files = req.files || [];

        // Process thumbnail
        const thumbnailFile = files.find(f => f.fieldname === 'thumbnail');
        if (thumbnailFile) {
            const uploadResult = await uploadImage(thumbnailFile, "products/thumbnail");
            data.thumbnail = uploadResult.url;
        }

        // Process product images
        const imageFiles = files.filter(f => f.fieldname === 'images');
        if (imageFiles.length > 0) {
            const imageUrls = [];
            for (const img of imageFiles) {
                const uploadResult = await uploadImage(img, "products/images");
                imageUrls.push(uploadResult.url);
            }
            data.images = imageUrls;
        }

        // Process gallery images
        const galleryFiles = files.filter(f => f.fieldname === 'gallery');
        if (galleryFiles.length > 0) {
            const galleryUrls = [];
            for (const gallery of galleryFiles) {
                const uploadResult = await uploadImage(gallery, 'products/gallery');
                galleryUrls.push(uploadResult.url);
            }
            data.gallery = galleryUrls;
        }

        // Process preview video
        const previewFile = files.find(f => f.fieldname === 'preview');
        if (previewFile) {
            const uploadResult = await uploadImage(previewFile, 'products/preview');
            data.preview = uploadResult.url;
        }

        // Process additional videos
        const videoFiles = files.filter(f => f.fieldname === 'videos');
        if (videoFiles.length > 0) {
            const videoUrls = [];
            for (const video of videoFiles) {
                const uploadResult = await uploadImage(video, 'products/videos');
                videoUrls.push(uploadResult.url);
            }
            data.videos = videoUrls;
        }

        // Process showcase images (dynamic field names like 'showCase_0', 'showCase_1', etc.)
        const showcaseFiles = files.filter(f => f.fieldname.startsWith('showCase_'));
        if (showcaseFiles.length > 0 && data.showCase && Array.isArray(data.showCase)) {
            for (let i = 0; i < showcaseFiles.length && i < data.showCase.length; i++) {
                const uploadResult = await uploadImage(showcaseFiles[i], 'products/showcase');
                data.showCase[i].image = uploadResult.url;
            }
        }
        
    
        const requiredFields = ['title', 'category', 'brand'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        if (!data.variants || !Array.isArray(data.variants) || data.variants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one color variant is required"
            });
        }

        
        if (data.variants && Array.isArray(data.variants)) {
            data.variants = data.variants.map(variant => {
                const { finalPrice, ...rest } = variant;
                return rest;
            });
        }
        
        if (data.variants) {
            data.totalStock = data.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
        }

        if (data.totalStock === 0) {
            data.isAvailable = false;
        }

        if (data.discount && data.discount.value > 0) {
            if (data.discount.type === 'percentage' && data.discount.value > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Percentage discount cannot exceed 100%'
                });
            }
        }

        if (data.status === 'scheduled' || data.status === 'draft') {
            if (data.isComingSoon === undefined) {
                data.isComingSoon = true;
            }
        } else if (data.status === 'active') {
            data.isComingSoon = false;
        }

        if (data.status === 'scheduled') {
            if (req.body.scheduledAt) {
                data.scheduledAt = new Date(req.body.scheduledAt);
            } else if (data.scheduledAt) {
                data.scheduledAt = new Date(data.scheduledAt);
            }
        
            if (data.scheduledAt && data.scheduledAt < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Scheduled date cannot be in the past'
                });
            }
        }

        if (data.replacement && data.replacement.isAvailable && !data.replacement.duration) {
            return res.status(400).json({
                success: false,
                message: 'Replacement duration is required when replacement is available'
            });
        }
        
        if (data.return && data.return.isAvailable && !data.return.duration) {
            return res.status(400).json({
                success: false,
                message: 'Return duration is required when return is available'
            });
        }
        
        const product = await ProductModel.create(data);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
        
    } catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET MY PRODUCTS - BY SELLER
export const getMyProducts = async (req, res) => {
    try {
        const sellerId = req.user.id; 
        
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Filter parameters
        const { status, category, isFeatured, search } = req.query;
        
        // Build filter object
        let filter = { seller: sellerId };
        
        if (status) {
            filter.status = status;
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === 'true';
        }
        
        // Search functionality
        if (search) {
            filter.$text = { $search: search };
        }
        
        // Sort parameters
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };
        
        // Execute queries in parallel
        const [products, totalProducts] = await Promise.all([
            ProductModel.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-reviews') // Exclude reviews if not needed
                .lean(),
            ProductModel.countDocuments(filter)
        ]);
        
        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / limit);
        
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE PRODUCT - BY SELLER
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.user.id;
        
        const product = await ProductModel.findOne({ 
            _id: productId, 
            seller: sellerId 
        });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't have permission to access it"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT - BY SELLER
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.user.id;
        let updateData = req.body;
        
        // Parse if coming as FormData
        if (updateData.productData) {
            updateData = JSON.parse(updateData.productData);
        }
        
        // Check if product exists and belongs to seller
        const existingProduct = await ProductModel.findOne({ 
            _id: productId, 
            seller: sellerId 
        });
        
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't have permission to update it"
            });
        }
        
        const files = req.files;
        
        // Handle file uploads for updates
        if (files?.thumbnail?.[0]) {
            const uploadResult = await uploadImage(files.thumbnail[0], "products/thumbnail");
            updateData.thumbnail = uploadResult.url;
        }
        
        if (files?.images?.length > 0) {
            const imageUrls = [];
            for (let i = 0; i < files.images.length; i++) {
                const uploadResult = await uploadImage(files.images[i], "products/images");
                imageUrls.push(uploadResult.url);
            }
            // If sending new images, either replace or append based on query param
            if (req.query.appendImages === 'true') {
                updateData.images = [...(existingProduct.images || []), ...imageUrls];
            } else {
                updateData.images = imageUrls;
            }
        }
        
        if (files?.gallery?.length > 0) {
            const galleryUrls = [];
            for (const gallery of files.gallery) {
                const uploadResult = await uploadImage(gallery, 'products/gallery');
                galleryUrls.push(uploadResult.url);
            }
            if (req.query.appendGallery === 'true') {
                updateData.gallery = [...(existingProduct.gallery || []), ...galleryUrls];
            } else {
                updateData.gallery = galleryUrls;
            }
        }
        
        if (files?.preview?.[0]) {
            const uploadResult = await uploadImage(files.preview[0], 'products/preview');
            updateData.preview = uploadResult.url;
        }
        
        if (files?.videos?.length > 0) {
            const videoUrls = [];
            for (const video of files.videos) {
                const uploadResult = await uploadImage(video, 'products/videos');
                videoUrls.push(uploadResult.url);
            }
            if (req.query.appendVideos === 'true') {
                updateData.videos = [...(existingProduct.videos || []), ...videoUrls];
            } else {
                updateData.videos = videoUrls;
            }
        }
        
        // Remove finalPrice from variants if present
        if (updateData.variants && Array.isArray(updateData.variants)) {
            updateData.variants = updateData.variants.map(variant => {
                const { finalPrice, ...rest } = variant;
                return rest;
            });
            
            // Recalculate total stock
            updateData.totalStock = updateData.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
            
            // Update isAvailable based on stock
            if (updateData.totalStock === 0) {
                updateData.isAvailable = false;
            } else {
                updateData.isAvailable = true;
            }
        }
        
        // Validate discount
        if (updateData.discount && updateData.discount.value > 0) {
            if (updateData.discount.type === 'percentage' && updateData.discount.value > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Percentage discount cannot exceed 100%'
                });
            }
        }
        
        // Handle status and isComingSoon
        if (updateData.status === 'scheduled' || updateData.status === 'draft') {
            if (updateData.isComingSoon === undefined) {
                updateData.isComingSoon = true;
            }
        } else if (updateData.status === 'active') {
            updateData.isComingSoon = false;
        }
        
        // Update product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT - BY SELLER
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.user.id;
        
        // Check if product exists and belongs to seller
        const product = await ProductModel.findOne({ 
            _id: productId, 
            seller: sellerId 
        });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't have permission to delete it"
            });
        }
        
        // Optional: Check if product can be deleted (e.g., not in any orders)
        if (product.totalSold > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete product that has been sold. You can archive it instead."
            });
        }
        
        // Delete the product
        await ProductModel.findByIdAndDelete(productId);
        
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT STATUS - BY SELLER
export const updateProductStatus = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.user.id;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['active', 'draft', 'scheduled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed values: active, draft, scheduled"
            });
        }
        
        const product = await ProductModel.findOneAndUpdate(
            { _id: productId, seller: sellerId },
            { 
                status,
                isComingSoon: status === 'scheduled' || status === 'draft'
            },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't have permission"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Product status updated to ${status}`,
            data: product
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ---- ADMIN -----

// GET ALL PRODUCTS FOR ADMIN
export const getAllProducts = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        // Filter parameters
        const { 
            status, 
            category, 
            brand, 
            isFeatured, 
            search,
            minPrice,
            maxPrice,
            sellerId,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        // Build filter object
        let filter = {};
        
        if (status) {
            filter.status = status;
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (brand) {
            filter.brand = brand;
        }
        
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === 'true';
        }
        
        if (sellerId) {
            filter.seller = sellerId;
        }
        
        
        if (minPrice || maxPrice) {
            filter['variants.basePrice'] = {};
            if (minPrice) filter['variants.basePrice'].$gte = parseInt(minPrice);
            if (maxPrice) filter['variants.basePrice'].$lte = parseInt(maxPrice);
        }
        
       
        if (search) {
            filter.$text = { $search: search };
        }
        
        
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        
        
        const [products, totalProducts] = await Promise.all([
            ProductModel.find(filter)
                .populate('seller', 'name email role isBlocked verify') 
                .populate('sellerPanel', 'brandName brandCategory storeName logo coverImage') 
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(filter)
        ]);
        
       
        const totalPages = Math.ceil(totalProducts / limit);
        
     
        const stats = await Promise.all([
            ProductModel.countDocuments({ status: 'active' }),
            ProductModel.countDocuments({ status: 'draft' }),
            ProductModel.countDocuments({ status: 'scheduled' }),
            ProductModel.countDocuments({ isFeatured: true }),
            ProductModel.aggregate([
                { $group: { _id: null, totalStock: { $sum: "$totalStock" }, totalSold: { $sum: "$totalSold" } } }
            ])
        ]);
        
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                stats: {
                    activeProducts: stats[0],
                    draftProducts: stats[1],
                    scheduledProducts: stats[2],
                    featuredProducts: stats[3],
                    totalStock: stats[4][0]?.totalStock || 0,
                    totalSold: stats[4][0]?.totalSold || 0
                }
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE PRODUCT FOR ADMIN (with full details)
export const getSingleProductForAdmin = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Find product with full population
        const product = await ProductModel.findById(productId)
            .populate('seller', 'name email phone role isBlocked verify status createdAt') 
            .populate('sellerPanel', 'brandName brandSince brandDescription brandCategory brandSubCategory  logo coverImage sellerName sellerEmail sellerPhone gstNumber panNumber companyLocation pickupLocation') 
            .populate('reviews.user', 'name email') 
            .lean();
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Get additional product analytics
        const productAnalytics = {
            viewCount: product.viewCount || 0,
            searchCount: product.searchCount || 0,
            totalSold: product.totalSold || 0,
            replaceCount: product.replaceCount || 0,
            returnCount: product.returnCount || 0,
            averageRating: product.reviews?.length > 0 
                ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
                : 0,
            totalReviews: product.reviews?.length || 0
        };
        
        // Get seller's other products (for context)
        const sellerOtherProducts = await ProductModel.find({
            seller: product.seller,
            _id: { $ne: productId },
            status: 'active'
        })
        .select('title thumbnail totalSold status createdAt')
        .limit(5)
        .sort({ totalSold: -1 })
        .lean();
        
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: {
                product,
                analytics: productAnalytics,
                sellerOtherProducts: {
                    count: sellerOtherProducts.length,
                    list: sellerOtherProducts
                }
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PRODUCT STATISTICS FOR ADMIN DASHBOARD
export const getProductStatistics = async (req, res) => {
    try {
        // Date range for statistics
        const { days = 30 } = req.query;
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - parseInt(days));
        
        // Get comprehensive statistics
        const [
            totalProducts,
            activeProducts,
            draftProducts,
            scheduledProducts,
            featuredProducts,
            totalStock,
            totalSold,
            topSellingProducts,
            recentProducts,
            categoryStats,
            brandStats,
            monthlyStats
        ] = await Promise.all([
            ProductModel.countDocuments(),
            ProductModel.countDocuments({ status: 'active' }),
            ProductModel.countDocuments({ status: 'draft' }),
            ProductModel.countDocuments({ status: 'scheduled' }),
            ProductModel.countDocuments({ isFeatured: true }),
            ProductModel.aggregate([{ $group: { _id: null, total: { $sum: "$totalStock" } } }]),
            ProductModel.aggregate([{ $group: { _id: null, total: { $sum: "$totalSold" } } }]),
            ProductModel.find({ status: 'active', totalSold: { $gt: 0 } })
                .sort({ totalSold: -1 })
                .limit(10)
                .select('title thumbnail totalSold totalStock')
                .populate('seller', 'name')
                .lean(),
            ProductModel.find({ createdAt: { $gte: dateLimit } })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('title thumbnail status totalSold createdAt')
                .lean(),
            ProductModel.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            ProductModel.aggregate([
                { $group: { _id: "$brand", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            ProductModel.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        sold: { $sum: "$totalSold" }
                    }
                },
                { $sort: { "_id.year": -1, "_id.month": -1 } },
                { $limit: 12 }
            ])
        ]);
        
        return res.status(200).json({
            success: true,
            message: "Product statistics fetched successfully",
            data: {
                overview: {
                    totalProducts,
                    activeProducts,
                    draftProducts,
                    scheduledProducts,
                    featuredProducts,
                    totalStock: totalStock[0]?.total || 0,
                    totalSold: totalSold[0]?.total || 0
                },
                topSelling: topSellingProducts,
                recentProducts: recentProducts,
                topCategories: categoryStats,
                topBrands: brandStats,
                monthlyTrends: monthlyStats
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//---------PUBLIC--------

//---------PUBLIC--------

// GET ALL PRODUCTS FOR PUBLIC
export const getAllPublicProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        const { 
            category, 
            brand, 
            search,
            sortBy = 'newest',
            color,
            minPrice,
            maxPrice
        } = req.query;
        
        // Build filter - only active products
        let filter = { 
            status: 'active'
        };
        
        if (category) {
            filter.category = category;
        }
        
        if (brand) {
            filter.brand = brand;
        }
        
        // Color filter
        if (color) {
            filter['variants'] = {
                $elemMatch: {
                    name: { $regex: new RegExp(`^${color}$`, 'i') }
                }
            };
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter['variants.basePrice'] = {};
            if (minPrice) filter['variants.basePrice'].$gte = parseInt(minPrice);
            if (maxPrice) filter['variants.basePrice'].$lte = parseInt(maxPrice);
        }
        
        // Search functionality
        if (search) {
            filter.$text = { $search: search };
        }
        
        // Sort parameters
        let sort = {};
        switch(sortBy) {
            case 'priceLow':
                sort = { 'variants.basePrice': 1 };
                break;
            case 'priceHigh':
                sort = { 'variants.basePrice': -1 };
                break;
            case 'popular':
                sort = { totalSold: -1 };
                break;
            case 'newest':
            default:
                sort = { createdAt: -1 };
                break;
        }
        
        // Execute queries
        const [products, totalProducts] = await Promise.all([
            ProductModel.find(filter)
                .select('title subtitle description features thumbnail images variants discount totalStock category subCategory brand isFeatured mostOrderProduct bestSeller mostLovedProduct mostViewedProduct mostSerchedProduct totalSold viewCount searchCount createdAt')
                .populate('sellerPanel', 'brandName logo sellerName')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(filter)
        ]);
        
        // Get filter options
        const [categories, brands, colors, priceRange] = await Promise.all([
            ProductModel.aggregate([
                { $match: { status: 'active' } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            ProductModel.aggregate([
                { $match: { status: 'active' } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 }
            ]),
            ProductModel.aggregate([
                { $match: { status: 'active' } },
                { $unwind: '$variants' },
                { $group: { 
                    _id: { name: '$variants.name', code: '$variants.colorCode' },
                    count: { $sum: 1 }
                }},
                { $group: {
                    _id: '$_id.name',
                    colorCode: { $first: '$_id.code' },
                    count: { $sum: '$count' }
                }},
                { $sort: { count: -1 } },
                { $limit: 20 }
            ]),
            ProductModel.aggregate([
                { $match: { status: 'active' } },
                { $unwind: '$variants' },
                { $group: {
                    _id: null,
                    minPrice: { $min: '$variants.basePrice' },
                    maxPrice: { $max: '$variants.basePrice' }
                }}
            ])
        ]);
        
        const totalPages = Math.ceil(totalProducts / limit);
        
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                filters: {
                    categories: categories.filter(c => c._id),
                    brands: brands.filter(b => b._id),
                    colors: colors.filter(c => c._id),
                    priceRange: {
                        min: priceRange[0]?.minPrice || 0,
                        max: priceRange[0]?.maxPrice || 10000
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error in getAllPublicProducts:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE PRODUCT FOR PUBLIC
export const getSinglePublicProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await ProductModel.findOne({ 
            _id: productId, 
            status: 'active'
        })
        .select('title subtitle description features about showCase thumbnail images gallery preview videos variants discount totalStock category subCategory brand replacement return seo isFeatured mostOrderProduct bestSeller mostLovedProduct mostViewedProduct mostSerchedProduct totalSold viewCount searchCount createdAt updatedAt')
        .populate('sellerPanel', 'brandName brandDescription brandCategory brandSubCategory logo coverImage sellerName companyLocation brandSince brandSpeciality')
        .lean();
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or is not available"
            });
        }
        
        const relatedProducts = await ProductModel.find({
            category: product.category,
            _id: { $ne: productId },
            status: 'active'
        })
        .select('title thumbnail variants discount totalSold createdAt')
        .limit(8)
        .sort({ totalSold: -1 })
        .lean();
        
        const sellerOtherProducts = await ProductModel.find({
            sellerPanel: product.sellerPanel,
            _id: { $ne: productId },
            status: 'active'
        })
        .select('title thumbnail variants discount totalSold')
        .limit(6)
        .sort({ createdAt: -1 })
        .lean();
        
        // Increment view count
        ProductModel.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } }).exec();
        
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: {
                product,
                relatedProducts: {
                    count: relatedProducts.length,
                    list: relatedProducts
                },
                sellerOtherProducts: {
                    count: sellerOtherProducts.length,
                    list: sellerOtherProducts
                }
            }
        });
        
    } catch (error) {
        console.error('Error in getSinglePublicProduct:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};