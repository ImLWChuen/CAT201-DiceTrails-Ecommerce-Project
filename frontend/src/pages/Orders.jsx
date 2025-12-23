import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Orders = () => {

  const { products, currency } = useContext(ShopContext);

  return (
    <div className='border-t pt-16'>
        
        <div className='text-2xl'>
            <div className='flex items-center gap-2'>
                <p className='text-[#504c41] text-2xl font-medium'>MY ORDERS</p>
                <p className='w-8 h-[2px] bg-[#D0A823]'></p>
            </div>
        </div>

        <div className='flex flex-col gap-4 mt-8'>
            {/* We simulate orders by taking the first 4 items from your product list */}
            {products.slice(1, 4).map((item, index) => (
                <div key={index} className='py-4 border-t border-b text-[#504c41] flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    
                    {/* Left Side: Image & Details */}
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                        <div>
                            <p className='sm:text-base font-medium'>{item.name}</p>
                            <div className='flex items-center gap-3 mt-2 text-base text-[#504c41]'>
                                <p className='text-[#D0A823]'>{currency}{item.price}</p>
                                <p>Quantity: 1</p>
                                <p>Method: COD</p>
                            </div>
                            <p className='mt-2'>Date: <span className='text-gray-400'>25 Jul, 2024</span></p>
                        </div>
                    </div>

                    {/* Middle: Status */}
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>Ready to ship</p>
                        </div>
                        
                        {/* Right: Button */}
                        <button className='border border-gray-200 px-4 py-2 text-sm font-medium rounded-sm hover:bg-[#504c41] hover:text-white transition-all duration-300'>
                            Track Order
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Orders