
import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = ({ shippingFee = null, newsletterDiscount = 0, region = null, voucherDiscount = 0, appliedVoucher = null }) => {

    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    // Use provided shipping fee or default delivery fee
    const finalShippingFee = shippingFee !== null ? shippingFee : delivery_fee;
    const subtotal = getCartAmount();

    // Calculate discount amount (voucher takes priority)
    const discountAmount = voucherDiscount > 0 ? voucherDiscount : (newsletterDiscount > 0 ? subtotal * newsletterDiscount : 0);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const total = subtotalAfterDiscount + finalShippingFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <div className='flex items-center gap-2'>
                    <p className='text-[#504c41] text-2xl font-medium'>CART TOTALS</p>
                    <p className='w-8 h-[2px] bg-[#D0A823]'></p>
                </div>
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm text-[#504c41]'>
                <div className='flex justify-between py-2 border-b'>
                    <p>Subtotal</p>
                    <p>{currency} {subtotal.toFixed(2)}</p>
                </div>

                {voucherDiscount > 0 && (
                    <div className='flex justify-between py-2 border-b text-green-600'>
                        <p>
                            Voucher Discount ({appliedVoucher?.code})
                            {appliedVoucher?.discountType === 'percentage' && (
                                <span className='text-xs ml-1'>({appliedVoucher.discountValue}% off)</span>
                            )}
                        </p>
                        <p>-{currency} {voucherDiscount.toFixed(2)}</p>
                    </div>
                )}

                {newsletterDiscount > 0 && voucherDiscount === 0 && (
                    <div className='flex justify-between py-2 border-b text-green-600'>
                        <p>Newsletter Discount (20% off)</p>
                        <p>-{currency} {discountAmount.toFixed(2)}</p>
                    </div>
                )}

                <div className='flex justify-between py-2 border-b'>
                    <p>Shipping Fee {region && `(${region})`}</p>
                    <p className={finalShippingFee === 0 ? 'text-green-600 font-semibold' : ''}>
                        {finalShippingFee === 0 ? 'FREE' : `${currency} ${finalShippingFee.toFixed(2)}`}
                    </p>
                </div>

                <div className='flex justify-between py-2 border-b font-bold text-lg'>
                    <p>Total</p>
                    <p>{currency} {subtotal === 0 ? "0.00" : total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal