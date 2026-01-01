import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

import ReviewSection from '../components/ReviewSection';
import { formatPrice } from '../utils/formatPrice';
import Breadcrumbs from '../components/Breadcrumbs';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch the product data based on ID
  useEffect(() => {
    const fetchProductData = async () => {
      // Convert productId from URL (string) to number for comparison
      const numericProductId = Number(productId);

      products.map((item) => {
        if (item._id === numericProductId) {  // match numeric IDs
          setProductData(item);
          setImage(item.image[0]);     // set the first photo as the main photo

          // Load review count and calculate average rating
          const storedReviews = localStorage.getItem(`reviews_${productId}`);
          if (storedReviews) {
            try {
              const parsed = JSON.parse(storedReviews);
              setReviewCount(parsed.length);

              // Calculate average rating
              if (parsed.length > 0) {
                const totalRating = parsed.reduce((sum, review) => sum + review.rating, 0);
                const avg = totalRating / parsed.length;
                setAverageRating(avg);
              } else {
                setAverageRating(0);
              }
            } catch (error) {
              setReviewCount(0);
              setAverageRating(0);
            }
          } else {
            setReviewCount(0);
            setAverageRating(0);
          }

          return null;
        }
      })
    }
    fetchProductData();
  }, [productId, products])

  // If productData exists, show. Otherwise, show opacity-0 (invisible)
  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Catalogue', path: '/catalogue' },
        { label: productData.category, path: null },
        { label: productData.name, path: null }
      ]} />

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
            {[1, 2, 3, 4, 5].map((star) => {
              if (averageRating >= star) {
                return <img key={star} src={assets.star_full} alt="" className="w-3 5" />;
              } else if (averageRating >= star - 0.5) {
                return <img key={star} src={assets.star_half} alt="" className="w-3 5" />;
              } else {
                return <img key={star} src={assets.star_empty} alt="" className="w-3 5" />;
              }
            })}
            <p className='pl-2'>({reviewCount})</p>
          </div>

          <p className='mt-5 text-3xl font-medium text-[#D0A823]'>{formatPrice(productData.price)}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={() => {
              if (productData.quantity === 0) {
                alert('This product is currently out of stock');
                return;
              }
              addToCart(productData._id);
            }}
            disabled={productData.quantity === 0}
            className={`px-8 py-3 text-sm transition-colors duration-300 mt-10 ${productData.quantity === 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-[#504c41] text-white active:bg-[#D0A823] hover:bg-[#D0A823]'
              }`}
          >
            {productData.quantity === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
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
            Reviews ({reviewCount})
          </button>
        </div>

        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-4">
              <p>{productData.description}</p>
              <p>An engaging board game for the whole family, perfect for game nights and gatherings.</p>
            </div>
          ) : (
            <ReviewSection productId={productId} />
          )}
        </div>
      </div>

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product