import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const { navigate, cartItems, products, getCartAmount, setCartItems, user } = useContext(ShopContext);
    const [method, setMethod] = useState('card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [region, setRegion] = useState('west'); // Default to West Malaysia

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    // Calculate shipping fee based on region and cart total
    const calculateShippingFee = () => {
        const subtotal = getCartAmount();
        const discountAmount = (user?.isNewsletterSubscribed && !user?.hasUsedNewsletterDiscount)
            ? subtotal * 0.2
            : 0;
        const subtotalAfterDiscount = subtotal - discountAmount;

        if (region === 'west') {
            return subtotalAfterDiscount >= 100 ? 0 : 10;
        } else if (region === 'east') {
            return subtotalAfterDiscount >= 150 ? 0 : 15;
        } else { // International
            return subtotalAfterDiscount >= 200 ? 0 : 25;
        }
    };

    // Check if user is eligible for newsletter discount
    const getNewsletterDiscount = () => {
        if (user?.isNewsletterSubscribed && !user?.hasUsedNewsletterDiscount) {
            return 0.2; // 20% discount
        }
        return 0;
    };

    const shippingFee = calculateShippingFee();
    const newsletterDiscount = getNewsletterDiscount();

    const validateForm = () => {
        // Check if cart is empty
        const cartEmpty = Object.keys(cartItems).length === 0 ||
            Object.values(cartItems).every(qty => qty === 0);
        if (cartEmpty) {
            toast.error("Your cart is empty. Please add items before checkout.");
            return false;
        }

        // Check all required fields
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() ||
            !formData.street.trim() || !formData.city.trim() || !formData.state.trim() ||
            !formData.zipcode.trim() || !formData.country.trim() || !formData.phone.trim()) {
            toast.error("Please fill in all delivery information fields");
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Validate phone (digits only, reasonable length)
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
            toast.error("Phone number should be 10-15 digits");
            return false;
        }

        return true;
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        let orderItems = [];
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = products.find(product => product._id === Number(itemId)); // Convert string to number
                if (itemInfo) {
                    let itemEntry = { ...itemInfo, quantity: cartItems[itemId] };
                    orderItems.push(itemEntry);
                }
            }
        }
        const storedEmail = localStorage.getItem('userEmail');

        if (!storedEmail) {
            toast.error("Please log in to place an order.");
            setIsSubmitting(false);
            return;
        }

        const subtotal = getCartAmount();
        const discountAmount = newsletterDiscount > 0 ? subtotal * newsletterDiscount : 0;
        const finalTotal = (subtotal - discountAmount) + shippingFee;

        let orderData = {
            userId: storedEmail,
            deliveryAddress: formData,
            paymentMethod: method,
            items: orderItems,
            region: region,
            shippingFee: shippingFee,
            newsletterDiscountApplied: newsletterDiscount > 0,
            totalAmount: finalTotal
        }

        try {
            const response = await fetch('http://localhost:8080/api/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                // If newsletter discount was used, mark it as used
                if (newsletterDiscount > 0) {
                    localStorage.setItem('hasUsedNewsletterDiscount', 'true');
                }

                // Clear cart in all locations
                setCartItems({}); // Clear React state
                localStorage.setItem('cartItems', JSON.stringify({})); // Clear localStorage

                // Clear cart on backend
                try {
                    await fetch('http://localhost:8080/api/update-cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: storedEmail,
                            cart: {}
                        })
                    });
                } catch (error) {
                    console.error('Failed to clear backend cart:', error);
                }

                toast.success("Order placed successfully!");
                navigate('/orders');
            } else {
                toast.error("Order failed: " + result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error connecting to server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

            {/* ------------- LEFT SIDE: Delivery Form ------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <div className='flex items-center gap-2'>
                        <p className='text-[#504c41] text-2xl font-medium'>DELIVERY INFORMATION</p>
                        <p className='w-8 h-[2px] bg-[#D0A823]'></p>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <input name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='First name' required minLength="2" maxLength="50" />
                    <input name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Last name' required minLength="2" maxLength="50" />
                </div>
                <input name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="email" placeholder='Email address' required />
                <input name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Street' required minLength="5" maxLength="200" />
                <div className='flex gap-3'>
                    <input name='city' onChange={onChangeHandler} value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='City' required minLength="2" maxLength="50" />
                    <input name='state' onChange={onChangeHandler} value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='State' required minLength="2" maxLength="50" />
                </div>
                <div className='flex gap-3'>
                    <input name='zipcode' onChange={onChangeHandler} value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Zipcode' required pattern="[0-9]{4,10}" title="Enter valid postal code (4-10 digits)" />
                    <input name='country' onChange={onChangeHandler} value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Country' required minLength="2" maxLength="50" />
                </div>
                <input name='phone' onChange={onChangeHandler} value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="tel" placeholder='Phone' required pattern="[0-9]{10,15}" title="Enter valid phone number (10-15 digits)" />

                {/* Region Selection */}
                <div className='mt-4'>
                    <label className='block text-[#504c41] font-medium mb-2'>Select Region</label>
                    <select
                        value={region}
                        onChange={(e) => {
                            setRegion(e.target.value);
                            // Reset payment method for International if COD/TNG was selected
                            if (e.target.value === 'international' && (method === 'cod' || method === 'tng')) {
                                setMethod('card');
                            }
                        }}
                        className='border border-gray-300 rounded py-2 px-3.5 w-full outline-[#D0A823] bg-white'
                    >
                        <option value='west'>West Malaysia (Free shipping ≥ RM 100)</option>
                        <option value='east'>East Malaysia (Free shipping ≥ RM 150)</option>
                        <option value='international'>International (Free shipping ≥ RM 200)</option>
                    </select>
                </div>

                {/* Newsletter Discount Indicator */}
                {newsletterDiscount > 0 && (
                    <div className='bg-green-50 border border-green-300 rounded p-3 mt-2'>
                        <p className='text-green-700 text-sm font-semibold'>✓ Newsletter Discount Active!</p>
                        <p className='text-green-600 text-xs mt-1'>You're getting 20% off this order!</p>
                    </div>
                )}

            </div>

            {/* ------------- RIGHT SIDE: Totals & Payment ------------- */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal
                        shippingFee={shippingFee}
                        newsletterDiscount={newsletterDiscount}
                        region={region === 'west' ? 'West Malaysia' : region === 'east' ? 'East Malaysia' : 'International'}
                    />
                </div>

                <div className='mt-12'>
                    <div className='text-xl sm:text-2xl my-3'>
                        <div className='flex items-center gap-2'>
                            <p className='text-[#504c41] text-2xl font-medium'>PAYMENT METHOD</p>
                            <p className='w-8 h-[2px] bg-[#D0A823]'></p>
                        </div>
                    </div>

                    {/* Payment Selection Boxes */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>

                        {/* 1. Credit/Debit Card - Available for all regions */}
                        <div onClick={() => setMethod('card')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'card' ? 'bg-[#D0A823]' : ''}`}></p>
                            <div className='flex gap-2 mx-4'>
                                <img className='h-5' src={assets.visa_logo} alt="Visa" />
                                <img className='h-5' src={assets.mastercard_logo} alt="Mastercard" />
                            </div>
                        </div>

                        {/* 2. Apple Pay - Available for all regions */}
                        <div onClick={() => setMethod('applepay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'applepay' ? 'bg-[#D0A823]' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.apple_pay_logo} alt="Apple Pay" />
                        </div>

                        {/* 3. Google Pay - Available for all regions */}
                        <div onClick={() => setMethod('googlepay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'googlepay' ? 'bg-[#D0A823]' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.google_pay_logo} alt="Google Pay" />
                        </div>

                        {/* 4. Touch 'n Go E-Wallet - Only for Malaysia */}
                        {(region === 'west' || region === 'east') && (
                            <div onClick={() => setMethod('tng')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'tng' ? 'bg-[#D0A823]' : ''}`}></p>
                                <img className='h-5 mx-4' src={assets.tng_logo} alt="Touch 'n Go" />
                            </div>
                        )}

                    </div>

                    {/* Final Place Order Button */}
                    <div className='w-full text-end mt-8'>
                        <button
                            onClick={onSubmitHandler}
                            disabled={isSubmitting}
                            className={`px-16 py-3 text-sm transition-colors ${isSubmitting
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-[#504c41] text-white active:bg-[#D0A823] hover:bg-[#D0A823]'
                                }`}
                        >
                            {isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder