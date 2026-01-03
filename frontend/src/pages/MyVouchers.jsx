import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const MyVouchers = () => {
    const [activeVouchers, setActiveVouchers] = useState([])
    const [usedVouchers, setUsedVouchers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user, navigate } = useContext(ShopContext)

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail')
        if (!userEmail) {
            navigate('/login')
            return
        }
        fetchData(userEmail)
    }, [navigate])

    const fetchData = async (userEmail) => {
        try {
            // Fetch active vouchers
            const vouchersResponse = await fetch('http://localhost:8080/api/active-vouchers')
            const vouchersData = await vouchersResponse.json()

            // Fetch user's orders to determine used vouchers
            const ordersResponse = await fetch(`http://localhost:8080/api/user-orders?userId=${userEmail}`)
            const ordersData = await ordersResponse.json()

            // Extract unique voucher codes from orders
            const usedCodes = [...new Set(ordersData
                .filter(order => order.voucherCode)
                .map(order => order.voucherCode))]

            setUsedVouchers(usedCodes)

            // Filter out used vouchers from active vouchers
            const availableVouchers = vouchersData.filter(voucher => !usedCodes.includes(voucher.code))
            setActiveVouchers(availableVouchers)
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load vouchers')
        } finally {
            setIsLoading(false)
        }
    }

    const copyVoucherCode = (code) => {
        navigator.clipboard.writeText(code)
        toast.success(`Copied "${code}" to clipboard!`)
    }



    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8'>
            <div className='border-t pt-16'>
                {/* Page Header */}
                <div className='flex items-center gap-2 mb-10'>
                    <p className='text-[#504c41] text-3xl font-medium uppercase'>My Vouchers</p>
                    <p className='w-12 h-[2px] bg-[#D0A823]'></p>
                </div>

                {/* Newsletter Discount Section */}
                <div className='mb-8'>
                    <h2 className='text-xl font-semibold text-[#504C41] mb-4'>Newsletter Subscription Discount</h2>
                    {user?.isNewsletterSubscribed ? (
                        <div className={`border rounded-lg p-6 ${user?.hasUsedNewsletterDiscount ? 'bg-gray-50 border-gray-300' : 'bg-green-50 border-green-300'}`}>
                            {!user?.hasUsedNewsletterDiscount ? (
                                <div>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                        <p className='text-lg font-semibold text-green-700'>20% Newsletter Discount Available!</p>
                                    </div>
                                    <p className='text-green-600 text-sm'>Get 20% off your next order. This one-time discount will be automatically applied at checkout.</p>
                                    <button
                                        onClick={() => navigate('/place-order')}
                                        className='mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors'
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <svg className='w-6 h-6 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                        </svg>
                                        <p className='text-lg font-semibold text-gray-700'>Newsletter Discount Used</p>
                                    </div>
                                    <p className='text-gray-600 text-sm'>You've already redeemed your one-time newsletter discount. Thank you for being a subscriber!</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='border border-blue-300 rounded-lg p-6 bg-blue-50'>
                            <p className='text-blue-700 font-semibold mb-2'>Subscribe to Our Newsletter for 20% Off!</p>
                            <p className='text-blue-600 text-sm mb-3'>Join our mailing list and get an exclusive 20% discount on your next order.</p>
                            <button
                                onClick={() => navigate('/')}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-colors'
                            >
                                Subscribe Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Available Vouchers Section */}
                <div className='mb-8'>
                    <h2 className='text-xl font-semibold text-[#504C41] mb-4'>Available Voucher Codes</h2>
                    {isLoading ? (
                        <div className='text-center py-8'>
                            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D0A823]'></div>
                            <p className='text-gray-500 mt- 3'>Loading vouchers...</p>
                        </div>
                    ) : activeVouchers.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {activeVouchers.map((voucher) => (
                                <div
                                    key={voucher.code}
                                    className='border border-gray-300 rounded-lg p-5 bg-white hover:shadow-lg transition-shadow'
                                >
                                    <div className='flex justify-between items-start mb-3'>
                                        <div className='flex-1'>
                                            <div className='bg-[#FEED9F] text-[#504C41] font-bold text-lg px-3 py-1 rounded inline-block mb-2'>
                                                {voucher.code}
                                            </div>
                                            <p className='text-2xl font-bold text-green-600'>
                                                {voucher.discountType === 'percentage'
                                                    ? `${voucher.discountValue}% OFF`
                                                    : `RM ${voucher.discountValue.toFixed(2)} OFF`}
                                            </p>
                                        </div>
                                    </div>
                                    {voucher.description && (
                                        <p className='text-sm text-gray-600 mb-3'>{voucher.description}</p>
                                    )}
                                    <button
                                        onClick={() => copyVoucherCode(voucher.code)}
                                        className='w-full bg-[#D0A823] hover:bg-[#b8951f] text-[#504C41] font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2'
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                        </svg>
                                        Copy Code
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='border border-gray-300 rounded-lg p-8 text-center bg-gray-50'>
                            <svg className='w-16 h-16 mx-auto text-gray-400 mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' />
                            </svg>
                            <p className='text-gray-600 font-semibold'>No Active Vouchers Available</p>
                            <p className='text-gray-500 text-sm mt-2'>Check back later for new discount codes!</p>
                        </div>
                    )}
                </div>

                {/* Used Vouchers Section */}
                {usedVouchers.length > 0 && (
                    <div>
                        <h2 className='text-xl font-semibold text-[#504C41] mb-4'>Previously Used Vouchers</h2>
                        <div className='border border-gray-300 rounded-lg p-4 bg-gray-50'>
                            <div className='flex flex-wrap gap-2'>
                                {usedVouchers.map((code, index) => (
                                    <div
                                        key={index}
                                        className='bg-gray-200 text-gray-600 font-semibold px-4 py-2 rounded'
                                    >
                                        {code}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyVouchers
