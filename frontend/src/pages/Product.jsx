import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

import ReviewSection from '../components/ReviewSection';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch product data and reviews
  useEffect(() => {
    const fetchProductData = async () => {
      products.map((item) => {
        if (item._id === productId) {
          setProductData(item);
          setImage(item.image[0]);
          return null;
        }
      })
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reviews?productId=${productId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setReviews(data);
          setTotalReviews(data.length);
          if (data.length > 0) {
            const total = data.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(total / data.length);
          } else {
            setAverageRating(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    }

    fetchProductData();
    fetchReviews();
  }, [productId, products])

  const renderStars = (rating) => {
    let tempRating = rating;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => {
          if (tempRating >= 1) {
            tempRating--;
            return <img key={i} src={assets.star_full} alt="full star" className="w-3 5" />;
          } else if (tempRating >= 0.5) {
            tempRating = 0;
            return <img key={i} src={assets.star_half} alt="half star" className="w-3 5" />;
          } else {
            return <img key={i} src={assets.star_empty} alt="empty star" className="w-3 5" />;
          }
        })}
      </div>
    );
  };

  // If productData exists, show. Otherwise, show opacity-0 (invisible)
  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      {/* ----------- Product Data Visualization ----------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* --- Product Images Section --- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* --- Product Info Section (Right Side) --- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          <div className='flex items-center gap-1 mt-2'>
            {renderStars(averageRating)}
            <p className='pl-2'>({totalReviews})</p>
          </div>

          <p className='mt-5 text-3xl font-medium text-[#D0A823]'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={() => addToCart(productData._id)}
            className='bg-[#504c41] text-white px-8 py-3 text-sm active:bg-[#D0A823] hover:bg-[#D0A823] transition-colors duration-300 mt-10'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Game.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* --- Description & Review Section --- */}
      <div className='mt-20'>
        <div className='flex'>
          <button
            onClick={() => setActiveTab('description')}
            className={`border px-5 py-3 text-sm ${activeTab === 'description' ? 'font-bold border-b-0' : 'border-gray-200'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`border px-5 py-3 text-sm ${activeTab === 'reviews' ? 'font-bold border-b-0' : 'border-gray-200'}`}
          >
            Reviews
          </button>
        </div>

        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-4">
              <p>{productData.description}</p>
              <p>An engaging board game for the whole family, perfect for game nights and gatherings.</p>
            </div>
          ) : (
            <ReviewSection reviews={reviews} />
          )}
        </div>
      </div>

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product