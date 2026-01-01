import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const Orders = () => {

    const { currency, navigate, products } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [filter, setFilter] = useState('All');
    
    const userId = localStorage.getItem('userEmail');
    const filterOptions = ['All', 'Ready to ship', 'To Receive', 'Completed', 'Cancelled'];

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

            let allOrdersItem = [];
            
            if(data && data.length > 0){
                data.forEach((order) => {
                    order.items.forEach((item) => {
                        let itemCopy = { ...item };

                        itemCopy['status'] = order.status;
                        itemCopy['payment'] = order.paymentMethod;
                        itemCopy['date'] = new Date(order.date).toDateString();
                        
                        const productFromAssets = products.find(p => p._id === item._id);

                        if (productFromAssets) {
                            itemCopy['image'] = productFromAssets.image[0];
                            itemCopy['name'] = productFromAssets.name; 
                        } else {
                            if (Array.isArray(item.image)) itemCopy['image'] = item.image[0];
                            if (itemCopy['image'] && itemCopy['image'].startsWith('/src')) {
                                itemCopy['image'] = itemCopy['image'].replace('/src', '');
                            }
                        }
                        // ----------------------------------------------

                        allOrdersItem.push(itemCopy);
                    })
                })
                setOrderData(allOrdersItem.reverse());
            }
            
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    }

    const getFilteredOrders = () => {
        if (filter === 'All') return orderData;
        return orderData.filter(item => item.status === filter);
    }

    return (
        <div className='border-t pt-16'>

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

            <div className='flex flex-col gap-4 mt-8'>
                {getFilteredOrders().length === 0 ? (
                     <div className="text-gray-500 mt-4 text-center w-full">
                        <p>No orders found for <span className="font-semibold">{userId}</span>.</p>
                     </div>
                ) : (
                    getFilteredOrders().map((item, index) => (
                        <div key={index} className='py-4 border-t border-b text-[#504c41] flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

                            <div className='flex items-start gap-6 text-sm'>
                                {/* Image Display */}
                                <img 
                                    className='w-16 sm:w-20 object-cover border border-gray-200' 
                                    src={item.image} 
                                    alt={item.name} 
                                />
                                
                                <div>
                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                    <div className='flex items-center gap-3 mt-2 text-base text-[#504c41]'>
                                        <p className='text-[#D0A823]'>{currency}{item.price}</p>
                                        <p>Qty: {item.quantity}</p>
                                        <p className='uppercase text-xs border px-2 rounded'>{item.payment}</p>
                                    </div>
                                    <p className='mt-2 text-xs text-gray-400'>Ordered on: {item.date}</p>
                                </div>
                            </div>

                            <div className='md:w-1/2 flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <p className={`min-w-2 h-2 rounded-full ${item.status === 'Ready to ship' ? 'bg-green-500' : 'bg-gray-400'}`}></p>
                                    <p className='text-sm md:text-base'>{item.status}</p>
                                </div>
                                <button onClick={loadOrderData} className='border border-gray-200 px-4 py-2 text-sm font-medium rounded-sm hover:bg-[#504c41] hover:text-white transition-all duration-300'>
                                    Refresh Status
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Orders