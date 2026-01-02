import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';

const ReviewSection = ({ reviews }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'media', '5star', '4star', etc.
    const [sortBy, setSortBy] = useState('default'); // 'default', 'recent', 'high', 'low'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const reviewSectionRef = useRef(null);

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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center border-r pr-6 border-gray-100">
                        <span className="text-5xl font-extrabold text-[#504c41]">{averageRating}<span className="text-xl text-gray-400 font-normal">/5</span></span>
                        <div className="mt-2 scale-110">
                            {renderStars(Number(averageRating))}
                        </div>
                        <span className="text-sm font-medium text-gray-400 mt-2">{reviews.length} total reviews</span>
                    </div>
                    <div className="hidden sm:flex flex-col gap-1">
                        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer Satisfaction</p>
                        <p className="text-xs text-gray-500">Based on verified purchases</p>
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
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {review.media.map((item, idx) => (
                                        <div key={idx} className="group relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in">
                                            <img
                                                src={item}
                                                alt={`Review media ${idx}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
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
