import React, { useState, useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

// Review Submission Form Component
const AddReviewForm = ({ productId, onReviewAdded, user }) => {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [userName, setUserName] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);

    // Check if user has purchased this product
    useEffect(() => {
        const checkPurchaseHistory = async () => {
            if (!user) {
                setHasPurchased(false);
                setIsCheckingPurchase(false);
                return;
            }

            setIsCheckingPurchase(true);

            try {
                // Add timestamp to prevent caching issues
                const response = await fetch(`http://localhost:8080/api/user-orders?userId=${encodeURIComponent(user.email)}&t=${Date.now()}`);



                if (response.ok) {
                    const orders = await response.json();


                    // Check if any completed order contains this product
                    const purchased = orders.some(order => {
                        const isCompleted = order.status === 'Completed' || order.status === 'Shipped';
                        const hasProduct = order.items.some(item => {
                            // Robust comparison: handle strings, numbers, and scientific notation
                            // Parse both to integers to avoid floating point precision issues with equality
                            const itemId = parseInt(Number(item._id));
                            const targetId = parseInt(Number(productId));

                            const matches = itemId === targetId;
                            // Log comparison details


                            if (matches) {

                            }
                            return matches;
                        });

                        return isCompleted && hasProduct;
                    });


                    setHasPurchased(purchased);
                } else {
                    console.error('[ReviewSection] API response not OK:', response.status);
                    setHasPurchased(false);

                }
            } catch (error) {
                console.error('[ReviewSection] Error checking purchase history:', error);
                setHasPurchased(false);
            } finally {
                setIsCheckingPurchase(false);
            }
        };

        checkPurchaseHistory();

        // Re-check when page becomes visible (user returns from orders page)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && user) {
                console.log('[ReviewSection] Page visible, re-checking purchase');
                checkPurchaseHistory();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, productId]);

    const handleMediaUpload = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = [];
        let loadedCount = 0;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newMedia.push({
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    data: reader.result
                });
                loadedCount++;

                if (loadedCount === files.length) {
                    setMediaFiles(prev => [...prev, ...newMedia]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = (index) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        const newReview = {
            id: Date.now().toString(),
            user: userName || 'Anonymous',
            rating: rating,
            date: new Date().toISOString(),
            content: reviewText,
            helpful: 0,
            media: mediaFiles, // Include uploaded media
            hasMedia: mediaFiles.length > 0, // Flag for filtering
            productId: productId // Required for backend
        };

        onReviewAdded(newReview);

        // Reset form
        setRating(0);
        setReviewText('');
        setUserName('');
        setMediaFiles([]); // Reset media files
        setShowForm(false);

        alert('Thank you for your review!');
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
            {isCheckingPurchase ? (
                <div className="text-center py-4">
                    <p className="text-gray-500">Checking purchase history...</p>
                </div>
            ) : !user ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-semibold text-blue-900">Login Required</p>
                            <p className="text-sm text-blue-700 mt-1">
                                Please <a href="/login" className="underline font-semibold">log in</a> to write a review.
                            </p>
                        </div>
                    </div>
                </div>
            ) : !hasPurchased ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-semibold text-yellow-900">Purchase Required</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Only customers who have purchased this product can write a review.
                            </p>
                        </div>
                    </div>
                </div>
            ) : !showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#D0A823] hover:bg-[#b8951f] text-[#504C41] font-semibold px-6 py-3 rounded transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Write a Review
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-[#504C41]">Write Your Review</h3>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <svg
                                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                                            ? 'text-yellow-500'
                                            : 'text-gray-300'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name (optional)</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]"
                            placeholder="Enter your name or leave blank for Anonymous"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review *</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]"
                            placeholder="Share your thoughts about this product..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Add Photos or Videos (optional)</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleMediaUpload}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FEED9F] file:text-[#504C41] hover:file:bg-[#D0A823] file:cursor-pointer"
                        />
                        {mediaFiles.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {mediaFiles.map((media, index) => (
                                    <div key={index} className="relative group">
                                        {media.type === 'image' ? (
                                            <img src={media.data} alt={`Upload ${index + 1}`} className="h-20 w-20 object-cover border-2 border-gray-300 rounded" />
                                        ) : (
                                            <video src={media.data} className="h-20 w-20 object-cover border-2 border-gray-300 rounded" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition-colors"
                        >
                            Submit Review
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setRating(0);
                                setReviewText('');
                                setUserName('');
                                setMediaFiles([]);
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};


const ReviewSection = ({ productId, reviews: propReviews }) => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'media', '5star', '4star', etc.
    const [sortBy, setSortBy] = useState('default'); // 'default', 'recent', 'high', 'low'
    const [currentPage, setCurrentPage] = useState(1);
    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [openReportDropdown, setOpenReportDropdown] = useState(null); // Track which review's report dropdown is open
    const itemsPerPage = 5;
    const reviewSectionRef = useRef(null);
    const { user } = useContext(ShopContext);

    useEffect(() => {
        if (propReviews) {
            setReviews(propReviews);
        }
    }, [propReviews]);

    // Close report dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openReportDropdown !== null && !event.target.closest('.relative')) {
                setOpenReportDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openReportDropdown]);

    // Derived State: Filtered & Sorted Reviews
    const getProcessedReviews = () => {
        let processed = [...reviews];

        // 1. Filter
        if (filter === 'media') {
            processed = processed.filter(r => r.hasMedia);
        } else if (filter === '5star') {
            processed = processed.filter(r => r.rating === 5);
        } else if (filter === '4star') {
            processed = processed.filter(r => r.rating === 4);
        } else if (filter === '3star') {
            processed = processed.filter(r => r.rating === 3);
        } else if (filter === '2star') {
            processed = processed.filter(r => r.rating === 2);
        } else if (filter === '1star') {
            processed = processed.filter(r => r.rating === 1);
        }

        // 2. Sort
        if (sortBy === 'recent') {
            processed.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'high') {
            processed.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'low') {
            processed.sort((a, b) => a.rating - b.rating);
        }

        return processed;
    };

    const processedReviews = getProcessedReviews();
    const totalPages = Math.ceil(processedReviews.length / itemsPerPage);
    const currentReviews = processedReviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1);

    // Helpers
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const renderStars = (rating) => {
        let tempRating = rating;
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                    if (tempRating >= 1) {
                        tempRating--;
                        return <img key={i} src={assets.star_full} alt="full star" className="w-3" />;
                    } else if (tempRating >= 0.5) {
                        tempRating = 0; // Consume the half star
                        return <img key={i} src={assets.star_half} alt="half star" className="w-3" />;
                    } else {
                        return <img key={i} src={assets.star_empty} alt="empty star" className="w-3" />;
                    }
                })}
            </div>
        );
    };

    return (
        <div ref={reviewSectionRef} className="flex flex-col gap-8">

            {/* Header: Rating & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-gray-800">{averageRating}<span className="text-lg text-gray-400">/5</span></span>
                        {renderStars(Math.round(averageRating))}
                        <span className="text-sm text-gray-500 mt-1">{reviews.length} {reviews.length === 1 ? 'Rating' : 'Ratings'}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => { setFilter('all'); setCurrentPage(1); }}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${filter === 'all' ? 'bg-[#D0A823] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setFilter('media'); setCurrentPage(1); }}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${filter === 'media' ? 'bg-[#D0A823] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            With Images/Videos
                        </button>
                        <select
                            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                            className={`px-4 py-2 text-sm rounded-full border bg-white text-gray-600 outline-none transition-all duration-200 focus:border-[#D0A823] cursor-pointer ${['5star', '4star', '3star', '2star', '1star'].includes(filter) ? 'border-[#D0A823] text-[#D0A823] bg-[#fdfcf5]' : 'border-gray-200 hover:bg-gray-50'}`}
                            value={['5star', '4star', '3star', '2star', '1star'].includes(filter) ? filter : 'stars'}
                        >
                            <option value="stars" disabled>Filter by Stars</option>
                            <option value="5star">5 Stars Only</option>
                            <option value="4star">4 Stars Only</option>
                            <option value="3star">3 Stars Only</option>
                            <option value="2star">2 Stars Only</option>
                            <option value="5star">5 Stars Only</option>
                            <option value="4star">4 Stars Only</option>
                            <option value="3star">3 Stars Only</option>
                            <option value="2star">2 Stars Only</option>
                            <option value="1star">1 Star Only</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 text-sm rounded-full border border-gray-200 bg-white text-gray-600 outline-none transition-all duration-200 hover:bg-gray-50 focus:border-[#D0A823] cursor-pointer"
                        >
                            <option value="default">Sort by: Default</option>
                            <option value="recent">Sort by: Recent</option>
                            <option value="high">Sort by: Highest Rating</option>
                            <option value="low">Sort by: Lowest Rating</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Review Submission Form */}
            <AddReviewForm productId={productId} user={user} onReviewAdded={async (newReview) => {
                try {
                    const response = await fetch('http://localhost:8080/api/reviews', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newReview),
                    });

                    if (response.ok) {
                        const updatedReviews = [newReview, ...reviews];
                        setReviews(updatedReviews);
                        // Optionally refresh from server to ensure sync
                    } else {
                        console.error('Failed to submit review:', response.statusText);
                        alert('Failed to submit review. Please try again.');
                    }
                } catch (error) {
                    console.error('Error submitting review:', error);
                    alert('Error submitting review.');
                }
            }} />

            {/* Reviews List */}
            <div className="flex flex-col gap-6">
                {currentReviews.length > 0 ? (
                    currentReviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {review.user.charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-800">{review.user}</span>
                                </div>
                                <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                            </div>

                            <div className="mb-2">
                                {renderStars(review.rating)}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {review.content}
                            </p>

                            {review.media && review.media.length > 0 && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {review.media.map((item, idx) => (
                                        <div key={idx} className="relative group">
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.data}
                                                    alt={`Review media ${idx + 1}`}
                                                    className="w-24 h-24 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-90 hover:border-[#D0A823] transition-all"
                                                    onClick={() => {
                                                        setSelectedMedia(item);
                                                        setShowLightbox(true);
                                                    }}
                                                />
                                            ) : (
                                                <video
                                                    src={item.data}
                                                    className="w-24 h-24 object-cover rounded-md border border-gray-200 cursor-pointer hover:border-[#D0A823] transition-all"
                                                    onClick={() => {
                                                        setSelectedMedia(item);
                                                        setShowLightbox(true);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={() => {
                                        const updatedReviews = reviews.map(r => {
                                            if (r.id === review.id) {
                                                // Track if user has already liked this review
                                                const likedReviewsKey = `liked_reviews_${productId}`;
                                                const likedReviews = JSON.parse(localStorage.getItem(likedReviewsKey) || '[]');

                                                if (likedReviews.includes(review.id)) {
                                                    // Unlike
                                                    const newLikedReviews = likedReviews.filter(id => id !== review.id);
                                                    localStorage.setItem(likedReviewsKey, JSON.stringify(newLikedReviews));
                                                    return { ...r, helpful: (r.helpful || 0) - 1 };
                                                } else {
                                                    // Like
                                                    likedReviews.push(review.id);
                                                    localStorage.setItem(likedReviewsKey, JSON.stringify(likedReviews));
                                                    return { ...r, helpful: (r.helpful || 0) + 1 };
                                                }
                                            }
                                            return r;
                                        });
                                        setReviews(updatedReviews);
                                        localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
                                    }}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#D0A823] transition-colors"
                                >
                                    <img src={assets.thumbs_up_icon} alt="thumbs up" className="w-4 h-4 opacity-50" />
                                    <span>Helpful?</span>
                                    <span>({review.helpful || 0})</span>
                                </button>

                                {/* Report Button with Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenReportDropdown(openReportDropdown === review.id ? null : review.id)}
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                        </svg>
                                        <span>Report</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openReportDropdown === review.id && (
                                        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[150px] z-50">
                                            {['Not Relevant', 'Inappropriate', 'Spam', 'Other'].map((reason) => (
                                                <button
                                                    key={reason}
                                                    onClick={() => {
                                                        const updatedReviews = reviews.map(r => {
                                                            if (r.id === review.id) {
                                                                const reports = r.reports || [];
                                                                return {
                                                                    ...r,
                                                                    reports: [...reports, { reason, date: new Date().toISOString() }],
                                                                    isFlagged: true
                                                                };
                                                            }
                                                            return r;
                                                        });
                                                        setReviews(updatedReviews);
                                                        localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
                                                        setOpenReportDropdown(null); // Close dropdown after reporting
                                                        alert(`Review reported as: ${reason}`);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    {reason}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No reviews match your filter.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => {
                            setCurrentPage(1);
                            reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); // View scrolls back to the top of the review section
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                    >
                        First
                    </button>
                    <button
                        onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                            reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => {
                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                            reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => {
                            setCurrentPage(totalPages);
                            reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                    >
                        Last
                    </button>
                </div>
            )}

            {/* Lightbox Modal for Media */}
            {showLightbox && selectedMedia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => {
                        setShowLightbox(false);
                        setSelectedMedia(null);
                    }}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowLightbox(false);
                                setSelectedMedia(null);
                            }}
                            className="absolute top-4 right-4 bg-white hover:bg-gray-200 text-gray-800 rounded-full p-2 z-10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Media content */}
                        <div onClick={(e) => e.stopPropagation()} className="w-full h-full flex items-center justify-center">
                            {selectedMedia.type === 'image' ? (
                                <img
                                    src={selectedMedia.data}
                                    alt="Review media enlarged"
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            ) : (
                                <video
                                    src={selectedMedia.data}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
