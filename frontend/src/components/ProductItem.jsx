import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'

const ProductItem = ({ id, image, name, price, quantity = 10 }) => {

  const { currency } = useContext(ShopContext)
  const isOutOfStock = quantity === 0;

  return (
    <Link
      className={`text-black cursor-pointer ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}
      to={`/product/${id}`}
    >
      <div className='overflow-hidden relative'>
        <img className='hover:scale-110 transition ease-in-out border border-[#D0a823] rounded-md' src={image[0]} alt="" />
        {isOutOfStock && (
          <div className='absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded'>
            SOLD OUT
          </div>
        )}
      </div>
      <p className='pt-3 pb-1 text-sm font-bold'>{name}</p>
      <p className='text-sm font-medium'>{formatPrice(price)}</p>
    </Link>
  )
}

export default ProductItem
