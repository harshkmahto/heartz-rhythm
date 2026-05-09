import React from 'react';
import Button from '../ShowCaseSection/Buttons';

const OrderButtons = ({ 
    cartItems, 
    selectedAddress, 
    selectedPaymentMethod, 
    totals, 
    appliedCoupon, 
    onPlaceOrder 
}) => {
    const isDisabled = !cartItems || cartItems.length === 0 || !selectedAddress;

    return (
        <div className="w-full">
            <Button
                text="Place Order"
                onClick={onPlaceOrder}
                fromColor="red-500"
                toColor="orange-500"
                size="lg"
                fullWidth={true}
                disabled={isDisabled}
                shadow={true}
                shadowFrom="red-500"
                shadowTo="orange-500"
                shadowIntensity="0.3"
                shadowSize="30px"
            />
            {isDisabled && (
                <p className="text-xs text-red-500 text-center mt-3">
                    {!cartItems || cartItems.length === 0 
                        ? "Your cart is empty" 
                        : "Please select a delivery address"}
                </p>
            )}
        </div>
    );
};

export default OrderButtons;