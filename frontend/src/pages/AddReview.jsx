import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const AddReview = () => {
    const { orderId, productId } = useParams();
    const { products, user, navigate } = useContext(ShopContext);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const product = products.find(p => p._id === productId);

    if (!product) {
        return <div className="text-center py-10">Product not found</div>;
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const reviewData = {
            productId: productId,
            orderId: orderId,
            user: user ? (user.name || user.email.split('@')[0]) : "Anonymous", // Simple fallback for name
            rating: rating,
            content: content,
            helpful: 0,
            hasMedia: !!image,
            media: image ? [image] : []
        };

        try {
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Review Submitted!");
                navigate('/orders');
            } else {
                toast.error("Failed to submit review");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error submitting review");
        }
    };

    // Simulate image upload by reading file as Data URL (base64)
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="border-t pt-14 min-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between gap-12">

                {/* Product Info */}
                <div className="flex-1 max-w-[400px]">
                    <h2 className="text-2xl font-bold mb-4">Review Product</h2>
                    <div className="border rounded-lg p-4 flex gap-4">
                        <img src={product.image[0]} alt={product.name} className="w-24 h-24 object-cover rounded" />
                        <div>
                            <h3 className="font-medium text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-[#D0A823] font-medium mt-1">RM {product.price}</p>
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                <div className="flex-1 max-w-[600px]">
                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">

                        {/* Rating */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Overall Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <img
                                            src={star <= rating ? assets.star_full : assets.star_empty}
                                            alt={`${star} star`}
                                            className="w-8 h-8"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border border-gray-300 rounded p-3 h-32 outline-[#D0A823]"
                                placeholder="Write your experience with the product..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Add Photo</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded border border-dashed border-gray-400">
                                    <span>Choose File</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                {image && (
                                    <div className="relative w-16 h-16">
                                        <img src={image} alt="Preview" className="w-full h-full object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="bg-[#504c41] text-white px-8 py-3 rounded hover:bg-[#D0A823] transition-colors mt-4">
                            SUBMIT REVIEW
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddReview;
