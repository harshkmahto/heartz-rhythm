// controllers/cart.controller.js
import AddressModel from '../models/address.model.js';
import Cart from '../models/cart.model.js';
import Checkout from '../models/checkout.model.js';
import Product from '../models/product.model.js';

// ==================== ADD TO CART ====================
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantId, quantity = 1 } = req.body;

        if (!productId || !variantId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and Variant ID are required'
            });
        }

        if (quantity < 1 || quantity > 3) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 3'
            });
        }

        // Get product
        const product = await Product.findOne({
            _id: productId,
            status: 'active',
            isBlocked: false
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
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

        // Check stock
        if (!variant.isAvailable || variant.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: `${variant.name} is out of stock`
            });
        }

        if (variant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock} units available`
            });
        }

        // Check if variant already in cart
        let cartItem = await Cart.findOne({
            user: userId,
            product: productId,
            variantId: variantId
        });

        if (cartItem) {
            
             return res.status(400).json({
                success: false,
                message: 'Item already in cart',
                alreadyInCart: true,
                data: cartItem
            });
        }


        // Create new cart item
        cartItem = await Cart.create({
            user: userId,
            product: productId,
            variantId: variantId,
            quantity: quantity,
            mrp: variant.mrp,
            finalPrice: variant.finalPrice,
            thumbnail: product.thumbnail,
            title: product.title,
            brand: product.brand,
            category: product.category,
            subCategory: product.subCategory,
            colorName: variant.name,
            colorCode: variant.colorCode,
            stock: variant.stock
        });

        return res.status(200).json({
            success: true,
            message: 'Added to cart',
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

// ==================== GET CART ====================
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        let cartItems = await Cart.find({ user: userId })
            .populate('product', 'title thumbnail brand category subCategory variants');

        const validItems = [];
        
        for (const item of cartItems) {
            const product = item.product;
            
            if (!product) {
                await Cart.findByIdAndDelete(item._id);
                continue;
            }
            
            const variant = product.variants?.find(
                v => v._id.toString() === item.variantId.toString()
            );
            
            if (!variant || !variant.isAvailable || variant.stock <= 0) {
                await Cart.findByIdAndDelete(item._id);
                continue;
            }
            
            // Update stock
            if (variant.stock !== item.stock) {
                item.stock = variant.stock;
                await item.save();
            }
            
           
            item.mrp = variant.mrp;
            item.finalPrice = variant.finalPrice;
            
        
            if (item.quantity > variant.stock) {
                item.quantity = variant.stock;
                await item.save();
            }
            if (item.quantity > 3) {
                item.quantity = 3;
                await item.save();
            }
            
            validItems.push(item);
        }
        
        // Calculate totals
        let totalItems = 0;
        let totalMrp = 0;
        let totalFinalPrice = 0;
        
        for (const item of validItems) {
            totalItems += item.quantity;
            totalMrp += (item.mrp * item.quantity);
            totalFinalPrice += (item.finalPrice * item.quantity);
        }
        
        return res.status(200).json({
            success: true,
            data: {
                items: validItems,
                summary: {
                    totalItems,
                    totalMrp,
                    totalFinalPrice,
                    youSave: totalMrp - totalFinalPrice
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

// ==================== UPDATE QUANTITY ====================
export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params;
        const {  quantity } = req.body;
        
        if (!cartItemId) {
            return res.status(400).json({
                success: false,
                message: 'Cart item ID required'
            });
        }
        
        if (!quantity || quantity < 1 || quantity > 3) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 3'
            });
        }
        
        const cartItem = await Cart.findOne({
            _id: cartItemId,
            user: userId
        }).populate('product', 'variants');
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        const product = cartItem.product;
        const variant = product.variants.find(
            v => v._id.toString() === cartItem.variantId.toString()
        );
        
        if (!variant || !variant.isAvailable || variant.stock <= 0) {
            await Cart.findByIdAndDelete(cartItemId);
            return res.status(400).json({
                success: false,
                message: `${cartItem.colorName} is no longer available`
            });
        }
        
        if (variant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock} units available`
            });
        }
        
        cartItem.quantity = quantity;
        await cartItem.save();
        
        // Get updated totals
        const allItems = await Cart.find({ user: userId });
        let totalItems = 0, totalMrp = 0, totalFinalPrice = 0;
        
        for (const item of allItems) {
            totalItems += item.quantity;
            totalMrp += (item.mrp * item.quantity);
            totalFinalPrice += (item.finalPrice * item.quantity);
        }
        
        return res.status(200).json({
            success: true,
            message: 'Quantity updated',
            data: {
                item: cartItem,
                summary: {
                    totalItems,
                    totalMrp,
                    totalFinalPrice,
                    youSave: totalMrp - totalFinalPrice
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

// ==================== CHANGE VARIANT ====================
export const changeVariant = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params;
        const {  newVariantId, quantity = 1 } = req.body;
        
        if (!cartItemId || !newVariantId) {
            return res.status(400).json({
                success: false,
                message: 'Cart item ID and new variant ID required'
            });
        }
        
        if (quantity < 1 || quantity > 3) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 3'
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
        const newVariant = product.variants.find(
            v => v._id.toString() === newVariantId
        );
        
        if (!newVariant) {
            return res.status(404).json({
                success: false,
                message: 'New variant not found'
            });
        }
        
        if (!newVariant.isAvailable || newVariant.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: `${newVariant.name} is out of stock`
            });
        }
        
        if (newVariant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${newVariant.stock} units available`
            });
        }
        
        // Check if new variant already in cart
        const existingVariant = await Cart.findOne({
            user: userId,
            product: cartItem.product,
            variantId: newVariantId,
            _id: { $ne: cartItemId }
        });
        
        if (existingVariant) {
            return res.status(400).json({
                success: false,
                message: `${newVariant.name} is already in your cart`
            });
        }
        
        const oldName = cartItem.colorName;
        
        // Update to new variant
        cartItem.variantId = newVariantId;
        cartItem.quantity = quantity;
        cartItem.mrp = newVariant.mrp;
        cartItem.finalPrice = newVariant.finalPrice;
        cartItem.colorName = newVariant.name;
        cartItem.colorCode = newVariant.colorCode;
        cartItem.stock = newVariant.stock;
        await cartItem.save();
        
        return res.status(200).json({
            success: true,
            message: `Changed from ${oldName} to ${newVariant.name}`,
            data: { item: cartItem }
        });
        
    } catch (error) {
        console.error('Change variant error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== REMOVE FROM CART ====================
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
        const remainingItems = await Cart.find({ user: userId });
        let totalItems = 0, totalMrp = 0, totalFinalPrice = 0;
        
        for (const item of remainingItems) {
            totalItems += item.quantity;
            totalMrp += (item.mrp * item.quantity);
            totalFinalPrice += (item.finalPrice * item.quantity);
        }
        
        return res.status(200).json({
            success: true,
            message: 'Item removed',
            data: {
                items: remainingItems,
                summary: {
                    totalItems,
                    totalMrp,
                    totalFinalPrice,
                    youSave: totalMrp - totalFinalPrice
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



// ==================== CHECK VARIANT IN CART ====================
export const checkVariantInCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantId } = req.params;

        if (!productId || !variantId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and Variant ID are required'
            });
        }

        // Check if variant exists in user's cart
        const cartItem = await Cart.findOne({
            user: userId,
            product: productId,
            variantId: variantId
        });

        return res.status(200).json({
            success: true,
            inCart: !!cartItem,
            data: cartItem || null
        });

    } catch (error) {
        console.error('Check variant in cart error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



//------------------------CHECKOUT------------------------

export const createCheckout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId, discountCode, discountValue } = req.body;

        const cartItems = await Cart.find({ user: userId })
            .populate('product', 'title thumbnail brand category subCategory variants');

        if (!cartItems || !cartItems.length) {
            return res.status(404).json({
                success: false,
                message: 'No items in cart'
            });
        }

        const checkoutItems = [];
        let subTotal = 0;

        for (const item of cartItems) {
            const product = item.product;
            const variant = product.variants.find(
                v => v._id.toString() === item.variantId.toString()
            );

            if (!variant || !variant.isAvailable || variant.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.title} - ${variant?.name || 'Variant'} is out of stock`
                });
            }

            let sellingPrice = variant.finalPrice * item.quantity;
            
            if (discountCode && discountValue) {
                sellingPrice = sellingPrice - discountValue;
            }
            
            checkoutItems.push({
                product: product._id,
                variantId: item.variantId,
                quantity: item.quantity,
                title: product.title,
                thumbnail: product.thumbnail,
                brand: product.brand,
                category: product.category,
                subCategory: product.subCategory,
                colorName: variant.name,
                colorCode: variant.colorCode,
                mrp: variant.mrp,
                finalPrice: variant.finalPrice,
                sellingPrice: sellingPrice
            });

            subTotal += sellingPrice;
        }

        const shippingCharge = 49;
        const platformFee = 12;
        const totalPrice = subTotal + shippingCharge + platformFee;

        let address = null;
        if (addressId) {
            address = await AddressModel.findOne({ _id: addressId, user: userId });
            if (!address) {
                return res.status(404).json({
                    success: false,
                    message: 'Address not found'
                });
            }
        }

        const checkout = await Checkout.findOneAndUpdate(
            { user: userId },
            {
                user: userId,
                address: address?._id || null,
                items: checkoutItems,
                subtotal: subTotal,
                shippingCharge: shippingCharge,
                platformFee: platformFee,
                discount: !!(discountCode && discountValue),
                discountValue: discountCode && discountValue ? discountValue : 0,
                discountCode: discountCode || null,
                totalPrice: totalPrice,
                isActive: true,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000)
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Checkout created successfully',
            data: checkout
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getMyCheckout = async (req, res) => {
    try {
        const userId = req.user.id;

        const checkout = await Checkout.findOne({ user: userId })
            .populate('user', 'name email')
            .populate('address')
            .populate('items.product', 'title thumbnail');

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: 'No checkout found'
            });
        }

        return res.status(200).json({
            success: true,
            data: checkout
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};