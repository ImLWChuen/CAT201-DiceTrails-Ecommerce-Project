import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id, image, name, price}) => {

    const {currency} = useContext(ShopContext)

  return (
    <Link className='text-black cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img className='hover:scale-110 transition ease-in-out border border-[#D0a823] rounded-md' src={image[0]} alt=""/>
        </div> 
        <p className='pt-3 pb-1 text-sm font-bold'>{name}</p>
        <p className='text-sm font-medium'>{currency} {price}</p>
    </Link>
  )
}

export default ProductItem
