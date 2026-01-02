import React, { use } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useContext, useState, useEffect } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'


const BestSeller = () => {

    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/bestsellers');
                // Check if response is ok (not 404 or 500)
                if (response.ok) {
                    const data = await response.json();
                    if (data && Array.isArray(data)) {
                        setBestSeller(data);
                    }
                } else {
                    console.warn("Bestsellers API not ready or returned error:", response.status);
                }
            } catch (error) {
                console.error('Error loading best sellers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Our most-loved games that keep players coming back for more! These customer favorites have earned their place on the podium. Join thousands of satisfied gamers and discover why these titles are flying off our shelves.
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    loading ? (
                        <p className="col-span-full text-center text-gray-500">Loading bestsellers...</p>
                    ) : bestSeller.length > 0 ? (
                        bestSeller.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} discount={item.discount} isNew={item.isNew} quantity={item.quantity} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No best sellers found.</p>
                    )
                }

            </div>
        </div>
    )
}

export default BestSeller
