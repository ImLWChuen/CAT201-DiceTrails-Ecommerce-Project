import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'

const ProductItem = ({ id, image, name, price, quantity = 10, discount = 0, isNew = false }) => {

  const { currency } = useContext(ShopContext)
  const isOutOfStock = quantity === 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;

  return (
    <Link
      className={`text-black cursor-pointer ${isOutOfStock ? 'opacity-75' : ''}`}
      to={`/product/${id}`}
    >
      <div className={`overflow-hidden relative ${isOutOfStock ? 'grayscale' : ''}`}>
        <img className='hover:scale-110 transition ease-in-out border border-[#D0a823] rounded-md' src={image[0]} alt="" />
        {isOutOfStock && (
          <div className='absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded'>
            SOLD OUT
          </div>
        )}
        {!isOutOfStock && isNew && (
          <div className='absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded'>
            NEW
          </div>
        )}
        {hasDiscount && (
          <div className='absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded'>
            -{discount}%
          </div>
        )}
      </div>
      <p className='pt-3 pb-1 text-sm font-bold'>{name}</p>
      {hasDiscount ? (
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium text-gray-400 line-through'>{formatPrice(price)}</p>
          <p className='text-sm font-bold text-red-600'>{formatPrice(discountedPrice)}</p>
        </div>
      ) : (
        <p className='text-sm font-medium'>{formatPrice(price)}</p>
      )}
    </Link>
  )
}

export default ProductItem
