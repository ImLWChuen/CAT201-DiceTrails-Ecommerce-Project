import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { formatPrice } from '../utils/formatPrice'

const OrderManagement = ({ searchQuery = '' }) => {
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('All')
    const [sortBy, setSortBy] = useState('newest')
    const [isLoading, setIsLoading] = useState(false)

    const filterOptions = ['All', 'Ready to ship', 'Shipped', 'Completed', 'Cancelled']
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'highest', label: 'Highest Value' },
        { value: 'lowest', label: 'Lowest Value' }
    ]

    useEffect(() => {
        loadAllOrders()
    }, [])

    const loadAllOrders = async () => {
        setIsLoading(true)
        try {
            // Fetch all orders from backend
            const response = await fetch('http://localhost:8080/api/all-orders')
            if (response.ok) {
                const data = await response.json()
                setOrders(data)
            } else {
                toast.error('Failed to load orders')
            }
        } catch (error) {
            console.error('Error loading orders:', error)
            toast.error('Error connecting to server')
        } finally {
            setIsLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch('http://localhost:8080/api/update-order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            })

            const result = await response.json()

            if (result.success) {
                toast.success(`Order ${orderId} marked as ${newStatus}`)
                loadAllOrders() // Refresh orders
            } else {
                toast.error(result.message || 'Failed to update order status')
            }
        } catch (error) {
            console.error('Error updating order:', error)
            toast.error('Error connecting to server')
        }
    }

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return

        try {
            const response = await fetch('http://localhost:8080/api/delete-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            })
            const result = await response.json()
            if (result.success) {
                toast.success('Order deleted')
                setOrders(orders.filter(o => o.orderId !== orderId))
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Error deleting order:', error)
            toast.error('Error connecting to server')
        }
    }

    const getFilteredOrders = () => {
        let filtered = filter === 'All' ? orders : orders.filter(order => order.status === filter)

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(order =>
                order.orderId.toString().toLowerCase().includes(query) ||
                order.userId.toLowerCase().includes(query) ||
                order.status.toLowerCase().includes(query) ||
                order.trackingNumber?.toLowerCase().includes(query)
            )
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.date - a.date
                case 'oldest':
                    return a.date - b.date
                case 'highest':
                    return b.totalAmount - a.totalAmount
                case 'lowest':
                    return a.totalAmount - b.totalAmount
                default:
                    return 0
            }
        })

        return sorted
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ready to ship': return 'bg-blue-100 text-blue-700'
            case 'Shipped': return 'bg-purple-100 text-purple-700'
            case 'Completed': return 'bg-green-100 text-green-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className='flex flex-wrap gap-2 mb-6 justify-between items-center'>
                <div className='flex flex-wrap gap-2'>
                    {filterOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={`px-4 py-2 rounded font-semibold transition-colors ${filter === option
                                ? 'bg-[#D0A823] text-[#504C41]'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className='flex items-center gap-2'>
                    <label className='text-gray-700 font-semibold text-sm'>Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823] bg-white'
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders List */}
            {isLoading ? (
                <div className='text-center py-10 text-gray-500'>Loading orders...</div>
            ) : getFilteredOrders().length === 0 ? (
                <div className='text-center py-10 text-gray-500'>No orders found</div>
            ) : (
                <div className='space-y-4'>
                    {getFilteredOrders().map((order) => (
                        <div key={order.orderId} className='border rounded-lg p-4 bg-white shadow-sm'>
                            {/* Order Header */}
                            <div className='flex justify-between items-start mb-3'>
                                <div>
                                    <h3 className='font-bold text-lg text-[#504C41]'>Order #{order.orderId}</h3>
                                    <p className='text-sm text-gray-500'>
                                        {order.userId} • {new Date(order.date).toLocaleDateString()}
                                    </p>
                                    {order.trackingNumber && (
                                        <p className='text-sm text-purple-600 font-medium mt-1'>
                                            Tracking Number: {order.trackingNumber}
                                        </p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className='mb-3'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Items ({order.items?.length || 0}):</p>
                                {order.items && order.items.length > 0 ? (
                                    <div className='space-y-1'>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className='text-sm text-gray-600 flex justify-between'>
                                                <span>{item.name} × {item.quantity}</span>
                                                <span className='text-[#D0A823]'>{formatPrice(item.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-sm text-red-500'>No items in this order</p>
                                )}
                            </div>

                            {/* Delivery Address */}
                            <div className='mb-3 text-sm'>
                                <p className='font-semibold text-gray-700'>Delivery Address:</p>
                                <p className='text-gray-600'>
                                    {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}, {' '}
                                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {' '}
                                    {order.deliveryAddress?.state} {order.deliveryAddress?.zipcode}
                                </p>
                                <p className='text-gray-600'>Phone: {order.deliveryAddress?.phone}</p>
                            </div>

                            {/* Payment & Total */}
                            <div className='flex justify-between items-center pt-3 border-t'>
                                <div className='text-sm'>
                                    <span className='text-gray-600'>Payment: </span>
                                    <span className='font-medium uppercase'>{order.paymentMethod}</span>
                                </div>
                                <div className='text-lg font-bold text-[#504C41]'>
                                    Total: {formatPrice(order.totalAmount)}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2 mt-4'>
                                {order.status === 'Ready to ship' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.orderId, 'Shipped')}
                                        className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors'
                                    >
                                        Mark as Shipped
                                    </button>
                                )}
                                {order.status !== 'Cancelled' && order.status !== 'Completed' && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to cancel this order?')) {
                                                updateOrderStatus(order.orderId, 'Cancelled')
                                            }
                                        }}
                                        className='border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded text-sm font-medium transition-colors'
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteOrder(order.orderId)}
                                    className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors'
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={loadAllOrders}
                                    className='border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium transition-colors ml-auto'
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrderManagement
