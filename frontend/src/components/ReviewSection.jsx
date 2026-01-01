import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';

// Review Submission Form Component
const AddReviewForm = ({ productId, onReviewAdded }) => {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [userName, setUserName] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);

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
            hasMedia: false
        };

        onReviewAdded(newReview);

        // Reset form
        setRating(0);
        setReviewText('');
        setUserName('');
        setShowForm(false);

        alert('Thank you for your review!');
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
            {!showForm ? (
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


const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'media', '5star', '4star', etc.
    const [sortBy, setSortBy] = useState('default'); // 'default', 'recent', 'high', 'low'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const reviewSectionRef = useRef(null);

    useEffect(() => {
        // Load product-specific reviews from localStorage
        const loadProductReviews = () => {
            const storedReviews = localStorage.getItem(`reviews_${productId}`);
            if (storedReviews) {
                try {
                    const parsed = JSON.parse(storedReviews);
                    setReviews(parsed);
                } catch (error) {
                    console.error('Error parsing reviews:', error);
                    setReviews([]);
                }
            } else {
                // Initialize with empty array for new products
                setReviews([]);
            }
        };

        loadProductReviews();
    }, [productId]);

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

                <div className="flex flex-wrap gap-3">
                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFilter('all'); setCurrentPage(1); }}
                            className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === 'all' ? 'bg-[#D0A823] text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setFilter('media'); setCurrentPage(1); }}
                            className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === 'media' ? 'bg-[#D0A823] text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                        >
                            With Images/Videos
                        </button>
                        <select
                            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                            className={`px-4 py-2 text-sm rounded-full border bg-white text-gray-600 outline-none focus:border-[#D0A823] ${['5star', '4star', '3star', '2star', '1star'].includes(filter) ? 'border-[#D0A823] text-[#D0A823]' : ''}`}
                            value={['5star', '4star', '3star', '2star', '1star'].includes(filter) ? filter : 'stars'}
                        >
                            <option value="stars" disabled>Filter by Stars</option>
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
                            className="px-4 py-2 text-sm rounded-full border bg-white text-gray-600 outline-none focus:border-[#D0A823] cursor-pointer"
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
            <AddReviewForm productId={productId} onReviewAdded={(newReview) => {
                const updatedReviews = [newReview, ...reviews];
                setReviews(updatedReviews);
                localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
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
                                                    className="w-24 h-24 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-90"
                                                    onClick={() => window.open(item.data, '_blank')}
                                                />
                                            ) : (
                                                <video
                                                    src={item.data}
                                                    controls
                                                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#D0A823] transition-colors">
                                    <img src={assets.thumbs_up_icon} alt="thumbs up" className="w-4 h-4 opacity-50" />
                                    <span>Helpful?</span>
                                    <span>({review.helpful})</span>
                                </button>
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
        </div>
    );
};

export default ReviewSection;
