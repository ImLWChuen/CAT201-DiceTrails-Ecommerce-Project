
import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {

    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);

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
                <p>{currency} {getCartAmount().toFixed(2)}</p>
            </div>
            <div className='flex justify-between py-2 border-b'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee.toFixed(2)}</p>
            </div>
            <div className='flex justify-between py-2 border-b font-bold text-lg'>
                <p>Total</p>
                <p>{currency} {getCartAmount() === 0 ? "0.00" : (getCartAmount() + delivery_fee).toFixed(2)}</p>
            </div>
        </div>
    </div>
  )
}

export default CartTotal