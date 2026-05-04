import PriceRule from "../models/priceRules.model.js";
import ProductModel from "../models/product.model.js";

// CREATE PRICE RULE
export const createPriceRule = async (req, res) => {
    try {
        const ruleData = {
            ...req.body,
            createdBy: req.user.id
        };
        
        const rule = await PriceRule.create(ruleData);
        
        return res.status(201).json({
            success: true,
            message: "Price rule created successfully",
            data: rule
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL PRICE RULES
export const getAllPriceRules = async (req, res) => {
    try {
        const rules = await PriceRule.find()
            .sort({ priority: -1, createdAt: -1 })
            .populate('createdBy', 'name email');
        
        return res.status(200).json({
            success: true,
            data: rules
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRICE RULE (toggle active/inactive)
export const updatePriceRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        const { isActive, priority, description } = req.body;
        
        const rule = await PriceRule.findByIdAndUpdate(
            ruleId,
            { isActive, priority, description },
            { new: true }
        );
        
        if (!rule) {
            return res.status(404).json({
                success: false,
                message: "Rule not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Price rule updated",
            data: rule
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRICE RULE
export const deletePriceRule = async (req, res) => {
    try {
        const { ruleId } = req.params;
        
        await PriceRule.findByIdAndDelete(ruleId);
        
        return res.status(200).json({
            success: true,
            message: "Price rule deleted successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// APPLY PRICE RULES TO PRODUCTS
export const applyPriceRules = async (req, res) => {
    try {
        // Get all active rules
        const activeRules = await PriceRule.find({
            isActive: true,
            startDate: { $lte: new Date() },
            $or: [
                { endDate: { $exists: false } },
                { endDate: { $gte: new Date() } }
            ]
        }).sort({ priority: -1 });
        
        if (activeRules.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No active price rules"
            });
        }
        
        let totalProductsUpdated = 0;
        const appliedRules = [];
        
        // Apply each rule
        for (const rule of activeRules) {
            // Build filter based on rule
            let filter = {};
            
            if (rule.applyTo === 'category') {
                filter.category = rule.targetId;
            } else if (rule.applyTo === 'brand') {
                filter.brand = rule.targetId;
            } else if (rule.applyTo === 'product') {
                filter._id = { $in: rule.targetIds };
            }
            
            // Apply additional filters
            if (rule.filters?.hasReplacement !== undefined) {
                filter['replacement.isAvailable'] = rule.filters.hasReplacement;
            }
            if (rule.filters?.hasReturn !== undefined) {
                filter['return.isAvailable'] = rule.filters.hasReturn;
            }
            if (rule.filters?.minStock !== undefined) {
                filter.totalStock = { $gte: rule.filters.minStock };
            }
            if (rule.filters?.maxStock !== undefined) {
                filter.totalStock = { ...filter.totalStock, $lte: rule.filters.maxStock };
            }
            
            // Get products to update
            const products = await ProductModel.find(filter);
            
            // Apply price change
            for (const product of products) {
                let hasChange = false;
                
                for (const variant of product.variants) {
                    // FIXED: Use basePrice as the source price for calculation
                    // Because finalPrice might be from previous rules
                    const sourcePrice = variant.basePrice;  // Always use basePrice as source
                    let newFinalPrice = sourcePrice;
                    
                    if (rule.adjustmentType === 'percentage') {
                        const percent = rule.operator === 'increase' 
                            ? (1 + rule.value / 100) 
                            : (1 - rule.value / 100);
                        newFinalPrice = sourcePrice * percent;
                    } else { // fixed amount
                        newFinalPrice = rule.operator === 'increase' 
                            ? sourcePrice + rule.value 
                            : sourcePrice - rule.value;
                    }
                    
                    // Round and ensure not negative
                    newFinalPrice = Math.round(Math.max(0, newFinalPrice));
                    
                    // Check if price changed
                    if (variant.finalPrice !== newFinalPrice) {
                        variant.finalPrice = newFinalPrice;
                        hasChange = true;
                    }
                }
                
                if (hasChange) {
                    await product.save();
                    totalProductsUpdated++;
                }
            }
            
            appliedRules.push({
                ruleId: rule._id,
                ruleName: rule.ruleName,
                productsAffected: products.length
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Applied ${appliedRules.length} rules to ${totalProductsUpdated} products`,
            data: {
                rulesApplied: appliedRules,
                totalProductsUpdated
            }
        });
        
    } catch (error) {
        console.error('Apply price rules error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PRICE RULE OPTIONS (for UI dropdown)
export const getPriceRuleOptions = async (req, res) => {
    try {
        const [categories, brands] = await Promise.all([
            ProductModel.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]),
            ProductModel.aggregate([
                { $group: { _id: '$brand', count: { $sum: 1 } } }
            ])
        ]);
        
        return res.status(200).json({
            success: true,
            data: {
                categories: categories.filter(c => c._id),
                brands: brands.filter(b => b._id),
                adjustmentTypes: [
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'fixed', label: 'Fixed Amount (₹)' }
                ],
                operators: [
                    { value: 'increase', label: 'Increase (+)' },
                    { value: 'decrease', label: 'Decrease (-)' }
                ],
                applyOptions: [
                    { value: 'all', label: 'All Products' },
                    { value: 'category', label: 'Specific Category' },
                    { value: 'brand', label: 'Specific Brand' },
                    { value: 'product', label: 'Specific Products' }
                ]
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};