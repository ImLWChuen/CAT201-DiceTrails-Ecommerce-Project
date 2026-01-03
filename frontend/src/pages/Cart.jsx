import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { formatPrice } from '../utils/formatPrice';
import { calculateDiscountedPrice } from '../utils/discountUtils';
import Breadcrumbs from '../components/Breadcrumbs';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);


  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        if (cartItems[items] > 0) {
          tempData.push({
            _id: Number(items), // Convert string ID to number
            quantity: cartItems[items]
          })
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t pt-14'>
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Cart', path: null }
      ]} />

      {/* Page Title */}
      <div className='text-2xl mb-3'>
        <div className='flex items-center gap-2'>
          <p className='text-[#504c41] text-2xl font-medium'>YOUR CART</p>
          <p className='w-8 h-[2px] bg-[#D0A823]'></p>
        </div>
      </div>

      {/* List of Games */}
      <div className='mb-20'>
        {cartData.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-2xl text-gray-500 mb-4'>Your cart is empty</p>
            <p className='text-gray-400 mb-6'>Looks like you haven't added any games yet</p>
            <button
              onClick={() => navigate('/catalogue')}
              className='bg-[#D0A823] hover:bg-[#b8951f] text-[#504C41] px-8 py-3 rounded transition-colors font-medium'
            >
              Start Shopping
            </button>
          </div>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            const discountedPrice = calculateDiscountedPrice(productData);
            const hasDiscount = productData.discount && productData.discount > 0;

            return (
              <div key={index} className='py-4 border-t border-b text-[#504c41] grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>

                {/* Image & Name */}
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='mt-2 flex items-center gap-2'>
                      {hasDiscount ? (
                        <>
                          <p className='text-[#D0A823] font-medium'>{formatPrice(discountedPrice)}</p>
                          <p className='text-gray-400 line-through text-sm'>{formatPrice(productData.price)}</p>
                          <span className='bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-semibold'>
                            -{productData.discount}%
                          </span>
                        </>
                      ) : (
                        <p className='text-[#D0A823] font-medium'>{formatPrice(productData.price)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Box */}
                <input
                  onChange={(e) => {
                    const newQty = Number(e.target.value);
                    if (newQty > productData.quantity) {
                      alert(`Only ${productData.quantity} items available in stock`);
                      e.target.value = productData.quantity;
                      updateQuantity(item._id, productData.quantity);
                      return;
                    }
                    if (newQty > 0) {
                      updateQuantity(item._id, newQty);
                    }
                  }}
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 outline-[#D0A823]'
                  type="number"
                  min={1}
                  max={productData.quantity}
                  defaultValue={item.quantity}
                />

                {/* Delete Bin Icon */}
                <img
                  onClick={() => updateQuantity(item._id, 0)}
                  className='w-4 mr-4 sm:w-5 cursor-pointer hover:scale-110 transition-transform'
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Section: Totals */}
      {cartData.length > 0 && (
        <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px]'>

            <CartTotal />

            <div className='w-full text-end'>
              <button
                onClick={() => {
                  // Check if user is logged in
                  const userEmail = localStorage.getItem('userEmail');
                  if (!userEmail) {
                    alert('Please log in to place an order');
                    navigate('/login');
                    return;
                  }
                  navigate('/place-order');
                }}
                className='bg-[#504c41] text-white text-sm my-8 px-8 py-3 active:bg-[#D0A823] hover:bg-[#D0A823] transition-colors'
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Cart