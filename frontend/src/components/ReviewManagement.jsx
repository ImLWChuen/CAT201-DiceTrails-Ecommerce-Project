import React, { useState, useEffect } from 'react'
import { products } from '../assets/assets'

const ReviewManagement = ({ reviews, setReviews }) => {
  const [allReviews, setAllReviews] = useState([])
  const [filterProduct, setFilterProduct] = useState('all')

  // Load reviews from localStorage (simulating sync with ReviewSection data)
  useEffect(() => {
    const loadedReviews = []
    products.forEach(product => {
      const productReviews = JSON.parse(localStorage.getItem(`reviews_${product._id}`)) || []
      productReviews.forEach(review => {
        loadedReviews.push({
          ...review,
          productId: product._id,
          productName: product.name
        })
      })
    })
    setAllReviews(loadedReviews.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }, [])

  const handleDeleteReview = (reviewId, productId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      // Remove from localStorage
      const productReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || []
      const updatedReviews = productReviews.filter(r => r.id !== reviewId)
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews))

      // Update local state
      setAllReviews(allReviews.filter(r => r.id !== reviewId))
    }
  }

  const getStarRating = (rating) => {
    return (
      <div className='flex gap-1'>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredReviews = filterProduct === 'all'
    ? allReviews
    : allReviews.filter(r => r.productId === filterProduct)

  const averageRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : 0

  return (
    <div>
      {/* Summary Stats */}
      <div className='grid grid-cols-3 gap-4 mb-6'>
        <div className='bg-blue-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-blue-600'>{allReviews.length}</div>
          <div className='text-gray-700 font-semibold'>Total Reviews</div>
        </div>
        <div className='bg-green-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-green-600'>{averageRating}</div>
          <div className='text-gray-700 font-semibold'>Average Rating</div>
        </div>
        <div className='bg-orange-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-orange-600'>{products.length}</div>
          <div className='text-gray-700 font-semibold'>Products</div>
        </div>
      </div>

      {/* Filter */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <label className='block text-gray-700 font-semibold mb-2'>Filter by Product</label>
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
        >
          <option value='all'>All Products ({allReviews.length})</option>
          {products.map(product => {
            const count = allReviews.filter(r => r.productId === product._id).length
            return count > 0 ? (
              <option key={product._id} value={product._id}>
                {product.name} ({count})
              </option>
            ) : null
          })}
        </select>
      </div>

      {/* Reviews List */}
      <div className='space-y-4'>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={`${review.productId}_${review.id}`} className='bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#D0A823]'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='text-lg font-bold text-[#504C41]'>{review.productName}</h3>
                  <p className='text-gray-600 text-sm'>by {review.user}</p>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-gray-500'>{formatDate(review.date)}</p>
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2'>{getStarRating(review.rating)}</div>
                <p className='text-gray-800 leading-relaxed'>{review.content}</p>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={() => handleDeleteReview(review.id, review.productId)}
                  className='bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors flex items-center gap-2'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-12 bg-white rounded-lg shadow-lg'>
            <p className='text-gray-500 text-lg'>
              {filterProduct === 'all' ? 'No reviews yet' : 'No reviews for this product'}
            </p>
            <p className='text-gray-400 text-sm mt-2'>
              Reviews will appear here when customers submit them on product pages
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewManagement
