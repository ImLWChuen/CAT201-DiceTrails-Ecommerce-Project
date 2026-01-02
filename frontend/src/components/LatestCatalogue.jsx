import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCatalogue = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Sort products by ID (newest first)
            const sorted = [...products].sort((a, b) => b._id - a._id);
            setLatestProducts(sorted.slice(0, 10));
        }
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'CATALOGUE'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover our newest board game arrivals! From strategic masterpieces to party favorites, explore fresh additions to our collection. Be the first to experience the latest releases and bring home your next gaming adventure today.
                </p>
            </div>

            {/* Rendering Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    latestProducts.length > 0 ? (
                        latestProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} discount={item.discount} isNew={item.isNew} quantity={item.quantity} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">Loading products...</p>
                    )
                }
            </div>
        </div>
    )
}

export default LatestCatalogue
