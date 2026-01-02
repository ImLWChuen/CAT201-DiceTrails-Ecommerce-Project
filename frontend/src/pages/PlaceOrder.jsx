import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'

const PlaceOrder = () => {

    const { navigate, cartItems, products, getCartAmount, clearCart } = useContext(ShopContext);
    const [method, setMethod] = useState('cod');

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        let orderItems = [];
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = products.find(product => product._id === itemId);
                if (itemInfo) {
                    let itemEntry = { ...itemInfo, quantity: cartItems[itemId] };
                    orderItems.push(itemEntry);
                }
            }
        }
        const storedEmail = localStorage.getItem('userEmail');

        if (!storedEmail) {
            alert("Please log in to place an order.");
            return;
        }

        let orderData = {
            userId: storedEmail,
            deliveryAddress: formData,
            paymentMethod: method,
            items: orderItems,
            totalAmount: getCartAmount() + 10
        }

        try {
            const response = await fetch('http://localhost:8080/api/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                clearCart();
                navigate('/orders');
            } else {
                alert("Order failed: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server");
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
                    <input name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='First name' />
                    <input name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Last name' />
                </div>
                <input name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="email" placeholder='Email address' />
                <input name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input name='city' onChange={onChangeHandler} value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='City' />
                    <input name='state' onChange={onChangeHandler} value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input name='zipcode' onChange={onChangeHandler} value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="number" placeholder='Zipcode' />
                    <input name='country' onChange={onChangeHandler} value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="text" placeholder='Country' />
                </div>
                <input name='phone' onChange={onChangeHandler} value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-[#D0A823]' type="number" placeholder='Phone' />

            </div>

            {/* ------------- RIGHT SIDE: Totals & Payment ------------- */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <div className='text-xl sm:text-2xl my-3'>
                        <div className='flex items-center gap-2'>
                            <p className='text-[#504c41] text-2xl font-medium'>PAYMENT METHOD</p>
                            <p className='w-8 h-[2px] bg-[#D0A823]'></p>
                        </div>
                    </div>

                    {/* Payment Selection Boxes */}
                    <div className='flex gap-3 flex-col lg:flex-row'>

                        {/* 1. Credit/Debit Card */}
                        <div onClick={() => setMethod('card')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'card' ? 'bg-[#D0A823]' : ''}`}></p>
                            <div className='flex gap-2 mx-4'>
                                <img className='h-5' src={assets.visa_logo} alt="Visa" />
                                <img className='h-5' src={assets.mastercard_logo} alt="Mastercard" />
                            </div>
                        </div>

                        {/* 2. Touch 'n Go E-Wallet */}
                        <div onClick={() => setMethod('tng')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'tng' ? 'bg-[#D0A823]' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.tng_logo} alt="Touch 'n Go" />
                        </div>

                        {/* 3. Cash on Delivery (COD) */}
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-[#D0A823]'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-[#D0A823]' : ''}`}></p>
                            <p className='text-[#504c41] text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>

                    </div>

                    {/* Final Place Order Button */}
                    <div className='w-full text-end mt-8'>
                        <button
                            onClick={onSubmitHandler}
                            className='bg-[#504c41] text-white px-16 py-3 text-sm active:bg-[#D0A823] hover:bg-[#D0A823] transition-colors'
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder