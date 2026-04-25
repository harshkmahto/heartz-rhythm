// controllers/wishlist.controller.js
import ProductModel from "../models/product.model.js";
import wishlistModel from "../models/wishlist.model.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

         if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await ProductModel.findOne({
            _id: productId,
            status: 'active'
        }).select('_id title thumbnail variants');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or not available"
            });
        }

        let wishlist = await wishlistModel.findOne({ user: userId });

        // If wishlist doesn't exist, create new one
        if (!wishlist) {
            wishlist = await wishlistModel.create({
                user: userId,
                products: []
            });
        }

        // Check if product already exists in wishlist
        const existingItem = wishlist.products.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in wishlist"
            });
        }

        // Add product to wishlist
        wishlist.products.push({
            product: productId,
            addedAt: new Date()
        });

        await wishlist.save();

        product.wishlistCount = (product.wishlistCount || 0) + 1;
        
        if(product.wishlistCount >= 50){
            product.mostLovedProduct = true;
        }
        await product.save();


        return res.status(200).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: {
                wishlistId: wishlist._id,
                totalItems: wishlist.products.length,
                product: {
                    id: productId,
                    addedAt: new Date()
                },
                
            }
        });

    } catch (error) {
        console.error('Error in addToWishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist",
            error: error.message
        });
    }
};

// Get user's wishlist with populated products
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        let wishlist = await wishlistModel.findOne({ user: userId })
            .populate({
                path: 'products.product',
                select: 'title thumbnail variants discount brand category subCategory sellerPanel',
                populate: {
                    path: 'sellerPanel',
                    select: 'brandName logo'
                }
            });

        if (!wishlist) {
            wishlist = await wishlistModel.create({
                user: userId,
                products: []
            });
        }

        const processedProducts = wishlist.products.map(item => {
            const product = item.product;
            if (!product) return null;

            const firstVariant = product.variants?.[0];
            const isInStock = firstVariant?.stock > 0;
            const price = firstVariant?.finalPrice || 0;
            const mrp = firstVariant?.mrp || 0;
            
            // Calculate discount
            let discountPercent = 0;
            if (product.discount?.value > 0 && product.discount?.type === 'percentage') {
                discountPercent = product.discount.value;
            }

            return {
                _id: item._id,
                productId: product._id,
                title: product.title,
                subtitle: product.subtitle,
                thumbnail: product.thumbnail,
                brand: product.brand,
                category: product.category,
                seller: product.sellerPanel,
                price,
                mrp,
                discountPercent,
                isInStock,
                addedAt: item.addedAt
            };
        }).filter(item => item !== null);

        return res.status(200).json({
            success: true,
            data: {
                items: processedProducts,
                totalItems: processedProducts.length,
                wishlistId: wishlist._id
            }
        });

    } catch (error) {
        console.error('Error in getWishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist",
            error: error.message
        });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await ProductModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const wishlist = await wishlistModel.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        // Check if product exists in wishlist
        const productExists = wishlist.products.some(
            item => item.product.toString() === productId
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        product.wishlistCount = Math.max(0, (product.wishlistCount || 0) - 1);
        await product.save();


        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            data: {
                wishlistId: wishlist._id,
                totalItems: wishlist.products.length
            }
        });

    } catch (error) {
        console.error('Error in removeFromWishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove product from wishlist",
            error: error.message
        });
    }
};

// Check if product is in wishlist
export const checkInWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const wishlist = await wishlistModel.findOne({ user: userId });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                data: {
                    isInWishlist: false
                }
            });
        }

        const isInWishlist = wishlist.products.some(
            item => item.product.toString() === productId
        );

        return res.status(200).json({
            success: true,
            data: {
                isInWishlist
            }
        });

    } catch (error) {
        console.error('Error in checkInWishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to check wishlist",
            error: error.message
        });
    }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await wishlistModel.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        const productIds = wishlist.products.map(item => item.product.toString());

        for (const productId of productIds) {
            const product = await ProductModel.findById(productId);
            if(product && product.wishlistCount > 0){
                product.wishlistCount = Math.max(0, product.wishlistCount - 1);
                await product.save();
            }
        }
        

        wishlist.products = [];
        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            data: {
                wishlistId: wishlist._id,
                totalItems: 0
            }
        });

    } catch (error) {
        console.error('Error in clearWishlist:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear wishlist",
            error: error.message
        });
    }
};

// Get wishlist count
export const getWishlistCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await wishlistModel.findOne({ user: userId });

        const count = wishlist ? wishlist.products.length : 0;

        return res.status(200).json({
            success: true,
            data: {
                count
            }
        });

    } catch (error) {
        console.error('Error in getWishlistCount:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get wishlist count",
            error: error.message
        });
    }
};