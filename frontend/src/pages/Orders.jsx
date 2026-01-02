import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { formatPrice } from '../utils/formatPrice'
import { calculateDiscountedPrice } from '../utils/discountUtils'
import Breadcrumbs from '../components/Breadcrumbs'
import { toast } from 'react-toastify'

const Orders = () => {

    const { currency, navigate, products } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [filter, setFilter] = useState('All');


    const userId = localStorage.getItem('userEmail');
    const filterOptions = ['All', 'Ready to ship', 'Shipped', 'Completed', 'Cancelled'];

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        loadOrderData();
    }, [userId, products])


    const loadOrderData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user-orders?userId=${userId}`);


            if (!response.ok) {
                console.error("Server returned:", response.status);
                return;
            }

            const data = await response.json();

            if (data && data.length > 0) {
                // Process orders to add product details
                const processedOrders = data.map(order => {
                    const processedItems = order.items?.map(item => {
                        const productFromAssets = products.find(p => p._id === item._id);

                        if (productFromAssets) {
                            return {
                                ...item,
                                image: productFromAssets.image[0],
                                name: productFromAssets.name
                                // Do NOT add current discount - use only the discount saved with the order
                            };
                        } else {
                            let image = Array.isArray(item.image) ? item.image[0] : item.image;
                            if (image && image.startsWith('/src')) {
                                image = image.replace('/src', '');
                            }
                            return { ...item, image };
                        }
                    }) || [];

                    return {
                        ...order,
                        items: processedItems,
                        isEmpty: !order.items || order.items.length === 0
                    };
                });

                setOrderData(processedOrders.reverse());
            }


        } catch (error) {
            console.error("Error loading orders:", error);
        }
    }

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/cancel-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, userId })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Order cancelled successfully');
                loadOrderData();
            } else {
                toast.error(result.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Error connecting to server');
        }
    }

    const handleMarkAsReceived = async (orderId) => {
        if (!window.confirm('Confirm that you have received this order?')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/update-order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: 'Completed' })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Order marked as completed!');
                loadOrderData();
            } else {
                toast.error(result.message || 'Failed to update order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Error connecting to server');
        }
    }

    const getFilteredOrders = () => {
        if (filter === 'All') return orderData;
        return orderData.filter(order => order.status === filter);
    }

    return (
        <div className='border-t pt-16'>
            <Breadcrumbs items={[
                { label: 'Home', path: '/' },
                { label: 'My Orders', path: null }
            ]} />

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <p className='text-[#504c41] text-2xl font-medium uppercase'>My Orders</p>
                    <p className='w-8 h-[2px] bg-[#D0A823]'></p>
                </div>
                <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                    {filterOptions.map((opt) => (
                        <button key={opt} onClick={() => setFilter(opt)} className={`pb-1 border-b-2 transition-all ${filter === opt ? 'border-[#D0A823] text-black font-medium' : 'border-transparent hover:text-gray-700'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex flex-col gap-6 mt-8'>
                {getFilteredOrders().length === 0 ? (
                    <div className="text-gray-500 mt-4 text-center w-full">
                        <div className="text-gray-500 mt-4 text-center w-full">
                            <p>No orders found for <span className="font-semibold">{userId}</span>.</p>
                        </div>
                    </div>
                ) : (
                    getFilteredOrders().map((order, index) => (
                        <div key={index} className={`border rounded-lg p-6 ${order.isEmpty ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                            {/* Order Header */}
                            <div className='flex justify-between items-start mb-4 pb-4 border-b'>
                                <div>
                                    <h3 className='font-bold text-lg text-[#504C41]'>Order #{order.orderId}</h3>
                                    <p className='text-sm text-gray-500 mt-1'>
                                        Placed on {new Date(order.date).toLocaleDateString()} • Payment: {order.paymentMethod.toUpperCase()}
                                    </p>
                                    {order.trackingNumber && (
                                        <p className='text-sm text-purple-600 font-medium mt-1'>
                                            Tracking Number: {order.trackingNumber}
                                        </p>
                                    )}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <p className={`min-w-2 h-2 rounded-full ${order.status === 'Ready to ship' ? 'bg-green-500' : order.status === 'Shipped' ? 'bg-purple-500' : order.status === 'Completed' ? 'bg-blue-500' : order.status === 'Cancelled' ? 'bg-red-500' : 'bg-gray-400'}`}></p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Ready to ship' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' : order.status === 'Completed' ? 'bg-blue-100 text-blue-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            {order.isEmpty ? (
                                <div className='text-center py-4'>
                                    <p className='text-red-600 font-medium'>Error: No items in order</p>
                                    <p className='text-sm text-red-500 mt-1'>This order was created with an error. Please place a new order.</p>
                                </div>
                            ) : (
                                <div className='space-y-3 mb-4'>
                                    {order.items.map((item, itemIdx) => {
                                        const discountedPrice = calculateDiscountedPrice(item);
                                        const hasDiscount = item.discount && item.discount > 0;

                                        return (
                                            <div key={itemIdx} className='flex items-center gap-4 py-2'>
                                                {item.image ? (
                                                    <img className='w-16 h-16 object-cover border border-gray-200 rounded' src={item.image} alt={item.name} />
                                                ) : (
                                                    <div className='w-16 h-16 bg-gray-200 flex items-center justify-center border border-gray-300 rounded'>
                                                        <span className='text-xs text-gray-500'>No Image</span>
                                                    </div>
                                                )}
                                                <div className='flex-1'>
                                                    <p className='font-medium text-[#504c41]'>{item.name}</p>
                                                    <div className='flex items-center gap-3 mt-1 text-sm text-gray-600'>
                                                        {hasDiscount ? (
                                                            <>
                                                                <span className='text-[#D0A823] font-medium'>{formatPrice(discountedPrice)}</span>
                                                                <span className='text-gray-400 line-through text-xs'>{formatPrice(item.price)}</span>
                                                                <span className='bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded font-semibold'>
                                                                    -{item.discount}%
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className='text-[#D0A823] font-medium'>{formatPrice(item.price)}</span>
                                                        )}
                                                        <span>×</span>
                                                        <span>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-semibold text-[#504c41]'>{formatPrice(discountedPrice * item.quantity)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Order Total and Actions */}
                            <div className='flex flex-col gap-3 pt-4 border-t'>
                                {/* Price Breakdown */}
                                <div className='space-y-2 text-sm'>
                                    {/* Calculate subtotal from items */}
                                    {(() => {
                                        const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
                                        const discountAmount = order.newsletterDiscountApplied ? subtotal * 0.2 : 0;

                                        // Check if order has breakdown fields (new orders after update)
                                        const hasBreakdown = order.hasOwnProperty('shippingFee') || order.hasOwnProperty('newsletterDiscountApplied');

                                        // For old orders, just show total
                                        if (!hasBreakdown) {
                                            return (
                                                <div className='flex justify-between text-lg font-bold text-[#504C41]'>
                                                    <span>Total:</span>
                                                    <span>{formatPrice(order.totalAmount)}</span>
                                                </div>
                                            );
                                        }

                                        // For new orders, show full breakdown
                                        return (
                                            <>
                                                <div className='flex justify-between text-gray-600'>
                                                    <span>Subtotal:</span>
                                                    <span>{formatPrice(subtotal)}</span>
                                                </div>
                                                {order.newsletterDiscountApplied && (
                                                    <div className='flex justify-between text-green-600 font-medium'>
                                                        <span>Newsletter Discount (20%):</span>
                                                        <span>-{formatPrice(discountAmount)}</span>
                                                    </div>
                                                )}
                                                <div className='flex justify-between text-gray-600'>
                                                    <span>Shipping Fee{order.region ? ` (${order.region})` : ''}:</span>
                                                    <span>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'FREE'}</span>
                                                </div>
                                                <div className='flex justify-between text-lg font-bold text-[#504C41] pt-2 border-t'>
                                                    <span>Total:</span>
                                                    <span>{formatPrice(order.totalAmount)}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-2 justify-end'>
                                    {order.status === 'Ready to ship' && !order.isEmpty && (
                                        <button
                                            onClick={() => handleCancelOrder(order.orderId)}
                                            className='border border-red-500 text-red-500 px-4 py-2 text-sm font-medium rounded hover:bg-red-50 transition-all'
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {order.status === 'Shipped' && !order.isEmpty && (
                                        <button
                                            onClick={() => handleMarkAsReceived(order.orderId)}
                                            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded transition-all'
                                        >
                                            Mark as Received
                                        </button>
                                    )}
                                    <button onClick={loadOrderData} className='border border-gray-200 px-4 py-2 text-sm font-medium rounded hover:bg-[#504c41] hover:text-white transition-all'>
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Orders
