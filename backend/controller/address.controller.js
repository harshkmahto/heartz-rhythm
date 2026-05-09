import AddressModel from "../models/address.model.js";

// CREATE ADDRESS
export const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name, email, phone, alternatePhone, city, state,
            country, addressType, zipCode, address, landmark, isSelected
        } = req.body;

    
        if (!name || !email || !phone || !city || !state || !zipCode || !address) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, email, phone, city, state, zipCode, address"
            });
        }

    
        if (isSelected) {
            await AddressModel.updateMany(
                { user: userId },
                { isSelected: false }
            );
        }

        const newAddress = await AddressModel.create({
            user: userId,
            name,
            email,
            phone,
            alternatePhone,
            city,
            state,
            country: country || 'India',
            addressType: addressType || 'home',
            zipCode,
            address,
            landmark,
            isSelected: isSelected || false
        });

        return res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: newAddress
        });

    } catch (error) {
        console.error('Create address error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to create address",
            error: error.message
        });
    }
};

// GET ADDRESSES OF LOGGED IN USER
export const getMyAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const addresses = await AddressModel.find({ user: userId })
            .sort({ isSelected: -1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });

    } catch (error) {
        console.error('Get addresses error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses",
            error: error.message
        });
    }
};

// GET ADDRESS BY ID
export const getAddressById = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;

        const address = await AddressModel.findOne({ _id: addressId, user: userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: address
        });

    } catch (error) {
        console.error('Get address by ID error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch address",
            error: error.message
        });
    }
};

// GET SELECTED ADDRESS
export const getSelectedAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        const selectedAddress = await AddressModel.findOne({ user: userId, isSelected: true });

        if (!selectedAddress) {
            return res.status(404).json({
                success: false,
                message: "No selected address found"
            });
        }

        return res.status(200).json({
            success: true,
            data: selectedAddress
        });

    } catch (error) {
        console.error('Get selected address error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch selected address",
            error: error.message
        });
    }
};

// UPDATE ADDRESS
export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        const address = await AddressModel.findOne({ _id: addressId, user: userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        if (updateData.isSelected === true) {
            await AddressModel.updateMany(
                { user: userId, _id: { $ne: addressId } },
                { isSelected: false }
            );
        }

        const updatedAddress = await AddressModel.findByIdAndUpdate(
            addressId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: updatedAddress
        });

    } catch (error) {
        console.error('Update address error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update address",
            error: error.message
        });
    }
};

// DELETE ADDRESS
export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;

        const address = await AddressModel.findOne({ _id: addressId, user: userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // If deleting the selected address, set another address as selected if available
        const wasSelected = address.isSelected;

        await AddressModel.findByIdAndDelete(addressId);

        // If deleted address was selected, select the most recent address
        if (wasSelected) {
            const newestAddress = await AddressModel.findOne({ user: userId })
                .sort({ createdAt: -1 });
            
            if (newestAddress) {
                newestAddress.isSelected = true;
                await newestAddress.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            data: { deletedId: addressId }
        });

    } catch (error) {
        console.error('Delete address error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete address",
            error: error.message
        });
    }
};

// SET DEFAULT/SELECTED ADDRESS
export const setSelectedAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;

        const address = await AddressModel.findOne({ _id: addressId, user: userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Deselect all addresses
        await AddressModel.updateMany(
            { user: userId },
            { isSelected: false }
        );

        // Select this address
        address.isSelected = true;
        await address.save();

        return res.status(200).json({
            success: true,
            message: "Selected address updated successfully",
            data: address
        });

    } catch (error) {
        console.error('Set selected address error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to set selected address",
            error: error.message
        });
    }
};