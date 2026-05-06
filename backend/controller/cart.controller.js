// controllers/cart.controller.js
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Get user's cart with all items
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const cartItems = await Cart.find({ user: userId })
            .populate('product', 'title thumbnail brand category subCategory variants');
        
        let needsUpdate = false;
        const validatedItems = [];
        
        for (const item of cartItems) {
            const product = item.product;
            if (!product) {
                await Cart.findByIdAndDelete(item._id);
                needsUpdate = true;
                continue;
            }
            
            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
            
            if (!variant || variant.stock === 0 || !variant.isAvailable) {
                await Cart.findByIdAndDelete(item._id);
                needsUpdate = true;
                continue;
            }
            
            // Update stock info
            if (variant.stock !== item.stock) {
                item.stock = variant.stock;
                await item.save();
                needsUpdate = true;
            }
            
            // Adjust quantity if exceeds current stock
            if (item.quantity > variant.stock) {
                item.quantity = variant.stock;
                await item.save();
                needsUpdate = true;
            }
            
            validatedItems.push(item);
        }
        
        // Calculate totals
        const totalItems = validatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = validatedItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
        const grandTotal = validatedItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
        const discountTotal = subtotal - grandTotal;
        
        return res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            data: {
                items: validatedItems,
                summary: {
                    totalItems,
                    subtotal,
                    discountTotal,
                    grandTotal
                }
            }
        });
        
    } catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantId } = req.body;

        if (!productId || !variantId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and Variant ID are required'
            });
        }

        // Check product
        const product = await Product.findOne({
            _id: productId,
            status: 'active',
            isBlocked: false
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or unavailable'
            });
        }

        // Find variant
        const variant = product.variants.find(
            v => v._id.toString() === variantId
        );

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'Variant not found'
            });
        }

        if (!variant.isAvailable || variant.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Item is out of stock'
            });
        }

        // Check existing cart item
        let cartItem = await Cart.findOne({
            user: userId,
            variantId: variantId
        });

        if (cartItem) {
            // increase quantity by 1
            if (cartItem.quantity + 1 > variant.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock limit reached'
                });
            }

            cartItem.quantity += 1;
            await cartItem.save();

            return res.status(200).json({
                success: true,
                message: 'Quantity increased',
                data: cartItem
            });
        }

        // Create new cart item (quantity = 1)
        cartItem = await Cart.create({
            user: userId,
            product: productId,
            variantId: variantId,
            quantity: 1,
            price: variant.basePrice, // keep simple
            title: product.title,
            thumbnail: product.thumbnail
        });

        return res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: cartItem
        });

    } catch (error) {
        console.error('Add to cart error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update cart item quantity
export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId, quantity } = req.body;
        
        if (!cartItemId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Cart item ID and valid quantity are required'
            });
        }
        
        const cartItem = await Cart.findOne({
            _id: cartItemId,
            user: userId
        }).populate('product');
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        // Get product and variant
        const product = cartItem.product;
        const variant = product.variants.find(v => v._id.toString() === cartItem.variantId.toString());
        
        if (!variant || !variant.isAvailable) {
            await Cart.findByIdAndDelete(cartItemId);
            return res.status(400).json({
                success: false,
                message: `${cartItem.colorName} variant is no longer available and has been removed from cart`
            });
        }
        
        // Check stock
        if (variant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock} units available for ${cartItem.colorName}`
            });
        }
        
        // Update quantity
        cartItem.quantity = quantity;
        cartItem.stock = variant.stock;
        await cartItem.save();
        
        // Get updated cart
        const cartItems = await Cart.find({ user: userId });
        
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
        const grandTotal = cartItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
        
        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: {
                item: cartItem,
                summary: {
                    totalItems,
                    subtotal,
                    grandTotal,
                    discountTotal: subtotal - grandTotal
                }
            }
        });
        
    } catch (error) {
        console.error('Update quantity error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change variant
export const changeVariant = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId, newVariantId, quantity = 1 } = req.body;
        
        if (!cartItemId || !newVariantId) {
            return res.status(400).json({
                success: false,
                message: 'Cart item ID and new variant ID are required'
            });
        }
        
        const cartItem = await Cart.findOne({
            _id: cartItemId,
            user: userId
        }).populate('product');
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        const product = cartItem.product;
        
        // Find old variant and new variant
        const oldVariant = product.variants.find(v => v._id.toString() === cartItem.variantId.toString());
        const newVariant = product.variants.find(v => v._id.toString() === newVariantId);
        
        if (!newVariant) {
            return res.status(404).json({
                success: false,
                message: 'New variant not found'
            });
        }
        
        // Check if new variant is available
        if (!newVariant.isAvailable) {
            return res.status(400).json({
                success: false,
                message: `${newVariant.name} is currently out of stock`
            });
        }
        
        // Check stock
        if (newVariant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${newVariant.stock} units available for ${newVariant.name}`
            });
        }
        
        // Check if new variant already exists in cart
        const existingVariant = await Cart.findOne({
            user: userId,
            product: cartItem.product,
            variantId: newVariantId,
            _id: { $ne: cartItemId }
        });
        
        if (existingVariant) {
            return res.status(400).json({
                success: false,
                message: `${newVariant.name} variant is already in your cart. Update that item instead.`
            });
        }
        
        // Calculate final price with discounts
        const discountPercent = product.discount?.value || 0;
        const discountType = product.discount?.type || 'percentage';
        
        let finalPrice = newVariant.basePrice;
        if (discountPercent > 0) {
            if (discountType === 'percentage') {
                finalPrice = newVariant.basePrice - (newVariant.basePrice * discountPercent / 100);
            } else {
                finalPrice = newVariant.basePrice - discountPercent;
            }
        }
        
        // Update cart item with new variant
        cartItem.variantId = newVariantId;
        cartItem.quantity = quantity;
        cartItem.basePrice = newVariant.basePrice;
        cartItem.finalPrice = finalPrice;
        cartItem.colorName = newVariant.name;
        cartItem.colorCode = newVariant.colorCode;
        cartItem.stock = newVariant.stock;
        await cartItem.save();
        
        return res.status(200).json({
            success: true,
            message: `Changed from ${oldVariant?.name || 'previous'} to ${newVariant.name}`,
            data: {
                item: cartItem
            }
        });
        
    } catch (error) {
        console.error('Change variant error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params;
        
        const cartItem = await Cart.findOneAndDelete({
            _id: cartItemId,
            user: userId
        });
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        // Get updated cart
        const cartItems = await Cart.find({ user: userId });
        
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
        const grandTotal = cartItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
        
        return res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: {
                items: cartItems,
                summary: {
                    totalItems,
                    subtotal,
                    grandTotal,
                    discountTotal: subtotal - grandTotal
                }
            }
        });
        
    } catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await Cart.deleteMany({ user: userId });
        
        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: {
                items: [],
                summary: {
                    totalItems: 0,
                    subtotal: 0,
                    discountTotal: 0,
                    grandTotal: 0
                }
            }
        });
        
    } catch (error) {
        console.error('Clear cart error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get cart count
export const getCartCount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const count = await Cart.countDocuments({ user: userId });
        
        return res.status(200).json({
            success: true,
            data: { count }
        });
        
    } catch (error) {
        console.error('Get cart count error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get available variants for a product in cart
export const getAvailableVariants = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const cartItems = await Cart.find({
            user: userId,
            product: productId
        });
        
        const cartVariantIds = cartItems.map(item => item.variantId.toString());
        
        const availableVariants = product.variants.map(variant => ({
            _id: variant._id,
            name: variant.name,
            colorCode: variant.colorCode,
            basePrice: variant.basePrice,
            stock: variant.stock,
            isAvailable: variant.isAvailable && variant.stock > 0,
            isInCart: cartVariantIds.includes(variant._id.toString()),
            cartItemId: cartItems.find(item => item.variantId.toString() === variant._id.toString())?._id
        }));
        
        return res.status(200).json({
            success: true,
            data: {
                productId,
                variants: availableVariants
            }
        });
        
    } catch (error) {
        console.error('Get available variants error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};