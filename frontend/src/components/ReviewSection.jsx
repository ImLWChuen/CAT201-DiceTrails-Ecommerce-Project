import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';

// Mock Data Generator
const generateReviews = (count) => {
    const users = ['Alice M.', 'Bob D.', 'Charlie K.', 'Dana S.', 'Evan Wright', 'Fiona G.', 'George T.', 'Hannah P.'];
    const comments = [
        "Absolutely love this game! Great for family nights.",
        "Good quality components, but the rules were a bit confusing at first.",
        "Fast shipping, item arrived in perfect condition.",
        "One of the best strategy games I've played in years.",
        "It's okay, but I prefer the original version.",
        "Highly recommended! excessive fun.",
        "Dissappointed with the packaging, box was slightly dented.",
        "Perfect gift for my nephew, he loves it!"
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: i,
        user: users[i % users.length],
        rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        content: comments[i % comments.length],
        helpful: Math.floor(Math.random() * 50),
        hasMedia: Math.random() > 0.7 // 30% chance of having media
    }));
};

const MOCK_REVIEWS = generateReviews(45); // Generate 45 mock reviews

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'media', '5star', '4star', etc.
    const [sortBy, setSortBy] = useState('default'); // 'default', 'recent', 'high', 'low'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const reviewSectionRef = useRef(null);

    useEffect(() => {
        // "Fetch" reviews
        setReviews(MOCK_REVIEWS);
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
                        <span className="text-sm text-gray-500 mt-1">{reviews.length} Ratings</span>
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
                            <option value="5star">5 StarsOnly</option>
                            <option value="4star">4 StarsOnly</option>
                            <option value="3star">3 StarsOnly</option>
                            <option value="2star">2 StarsOnly</option>
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

                            {review.hasMedia && (
                                <div className="flex gap-2 mt-2">
                                    {/* Placeholder for user uploaded images */}
                                    <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400">Image</div>
                                    <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400">Video</div>
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
