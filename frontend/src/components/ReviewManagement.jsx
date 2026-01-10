import React, { useState, useEffect } from 'react'
// import { products } from '../assets/assets'

const ReviewManagement = ({ reviews, setReviews, searchQuery = '', products = [] }) => {
  const [allReviews, setAllReviews] = useState([])
  const [filterProduct, setFilterProduct] = useState('all')
  const [showLightbox, setShowLightbox] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
  ]

  // Fetch reviews from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reviews')
        if (response.ok) {
          const data = await response.json()
          console.log('[ReviewManagement] Loaded reviews from API:', data.length)

          // Map backend reviews to frontend format if needed
          // The backend returns the list of reviews directly
          // We might need to ensure productName is attached. 
          // The backend Review model might not have productName if it just stores productId.
          // We need to map productId to productName using the 'products' prop.

          const enrichedReviews = data.map(review => {
            const product = products.find(p => String(p._id) === String(review.productId))
            return {
              ...review,
              productName: product ? product.name : 'Unknown Product'
            }
          })

          setAllReviews(enrichedReviews)
        } else {
          console.error('Failed to fetch reviews:', response.status)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    if (products.length > 0) {
      fetchReviews()
    }

    // Refresh occasionally
    const interval = setInterval(fetchReviews, 5000)
    return () => clearInterval(interval)
  }, [products])

  const handleDeleteReview = (reviewId, productId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    // Get reviews for this product
    const productReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || []

    // Filter out the review to delete
    const updatedReviews = productReviews.filter(r => r.id !== reviewId)

    // Save back to localStorage
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews))

    // Update local state
    setAllReviews(allReviews.filter(r => !(r.id === reviewId && r.productId === productId)))
  }

  const getStarRating = (rating) => {
    return (
      <div className='flex gap-0.5'>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
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

  // Filter reviews
  let filteredReviews = filterProduct === 'all'
    ? allReviews
    : filterProduct === 'flagged'
      ? allReviews.filter(r => r.isFlagged)
      : allReviews.filter(r => r.productId === Number(filterProduct))

  // Apply search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredReviews = filteredReviews.filter(review =>
      review.productName.toLowerCase().includes(query) ||
      review.user.toLowerCase().includes(query) ||
      review.content.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  filteredReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const averageRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : 0

  return (
    <div>
      {/* Summary Stats */}
      <div className='grid grid-cols-4 gap-4 mb-6'>
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
        <div className='bg-red-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-red-600'>{allReviews.filter(r => r.isFlagged).length}</div>
          <div className='text-gray-700 font-semibold'>Flagged Reviews</div>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='flex gap-4 flex-wrap'>
          <div className='flex-1'>
            <label className='block text-gray-700 font-semibold mb-2'>Filter by Product</label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
            >
              <option value='all'>All Products ({allReviews.length})</option>
              <option value='flagged'>Flagged Reviews ({allReviews.filter(r => r.isFlagged).length})</option>
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

          <div className='flex-1'>
            <label className='block text-gray-700 font-semibold mb-2'>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className='space-y-4'>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={`${review.productId}_${review.id} `} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${review.isFlagged ? 'border-red-600' : 'border-[#D0A823]'} `}>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-bold text-[#504C41]'>{review.productName}</h3>
                    {review.isFlagged && (
                      <span className='bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                        </svg>
                        FLAGGED
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 text-sm'>by {review.user}</p>

                  {/* Show report details if flagged */}
                  {review.isFlagged && review.reports && review.reports.length > 0 && (
                    <div className='mt-2 bg-red-50 border border-red-200 rounded p-2'>
                      <p className='text-xs font-semibold text-red-700 mb-1'>
                        Reports ({review.reports.length}):
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {review.reports.map((report, idx) => (
                          <span key={idx} className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded'>
                            {report.reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className='text-right'>
                  <p className='text-xs text-gray-500'>{formatDate(review.date)}</p>
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-2'>{getStarRating(review.rating)}</div>
                <p className='text-gray-800 leading-relaxed'>{review.content}</p>

                {/* Display media if exists */}
                {review.media && review.media.length > 0 && (
                  <div className='mt-3'>
                    <p className='text-xs font-semibold text-gray-600 mb-2'>Attached Media:</p>
                    <div className='flex gap-2 flex-wrap'>
                      {review.media.map((item, idx) => (
                        <div key={idx} className='relative group'>
                          {item.type === 'image' ? (
                            <img
                              src={item.data}
                              alt={`Review media ${idx + 1} `}
                              className='w-20 h-20 object-cover rounded border border-gray-300 cursor-pointer hover:border-[#D0A823] hover:opacity-90 transition-all'
                              onClick={() => {
                                setSelectedMedia(item);
                                setShowLightbox(true);
                              }}
                            />
                          ) : (
                            <video
                              src={item.data}
                              className='w-20 h-20 object-cover rounded border border-gray-300 cursor-pointer hover:border-[#D0A823] transition-all'
                              onClick={() => {
                                setSelectedMedia(item);
                                setShowLightbox(true);
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='flex justify-end gap-2'>
                {review.isFlagged && (
                  <button
                    onClick={() => {
                      if (window.confirm('Remove flag from this review?')) {
                        const productReviews = JSON.parse(localStorage.getItem(`reviews_${review.productId}`)) || [];
                        const updatedProductReviews = productReviews.map(r =>
                          r.id === review.id ? { ...r, isFlagged: false, reports: [] } : r
                        );
                        localStorage.setItem(`reviews_${review.productId}`, JSON.stringify(updatedProductReviews));

                        setAllReviews(allReviews.map(r =>
                          r.id === review.id ? { ...r, isFlagged: false, reports: [] } : r
                        ));
                      }
                    }}
                    className='bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition-colors flex items-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    Unflag
                  </button>
                )}
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
              {searchQuery
                ? `No reviews found matching "${searchQuery}"`
                : filterProduct === 'all'
                  ? 'No reviews yet'
                  : 'No reviews for this product'
              }
            </p>
            <p className='text-gray-400 text-sm mt-2'>
              Reviews will appear here when customers submit them on product pages
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Media */}
      {showLightbox && selectedMedia && (
        <div
          className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'
          onClick={() => {
            setShowLightbox(false);
            setSelectedMedia(null);
          }}
        >
          <div className='relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center'>
            {/* Close button */}
            <button
              onClick={() => {
                setShowLightbox(false);
                setSelectedMedia(null);
              }}
              className='absolute top-4 right-4 bg-white hover:bg-gray-200 text-gray-800 rounded-full p-2 z-10 transition-colors'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>

            {/* Media content */}
            <div onClick={(e) => e.stopPropagation()} className='w-full h-full flex items-center justify-center'>
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.data}
                  alt='Review media enlarged'
                  className='max-w-full max-h-full object-contain rounded-lg'
                />
              ) : (
                <video
                  src={selectedMedia.data}
                  controls
                  autoPlay
                  className='max-w-full max-h-full rounded-lg'
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewManagement
