import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductManagement from '../components/ProductManagement'
import ReviewManagement from '../components/ReviewManagement'
import OrderManagement from '../components/OrderManagement'
import ContactManagement from '../components/ContactManagement'
import VoucherManagement from '../components/VoucherManagement'
import UserManagement from '../components/UserManagement'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const { products: contextProducts, user, logout } = useContext(ShopContext)

  useEffect(() => {
    // Check if user is logged in and is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    const userEmail = localStorage.getItem('userEmail')

    if (!userEmail || !isAdmin) {
      navigate('/login')
      return
    }
  }, [navigate])

  useEffect(() => {
    const fetchFreshData = async () => {
        try {
            // The timestamp (?t=...) forces the browser to get the REAL file
            const response = await fetch('http://localhost:8080/api/products?t=' + Date.now());
            const data = await response.json();
            
            if (data) {
                // Format the data exactly like you did before
                const formattedData = data.map(product => ({
                    ...product,
                    isVisible: product.isVisible !== false,
                    discount: product.discount || 0,
                    isNew: product.isNew || false
                }));
                setProducts(formattedData);
                console.log("Admin loaded fresh data:", formattedData.length);
            }
        } catch (error) {
            console.error("Failed to load admin products:", error);
        }
    }

    fetchFreshData(); // Run immediately when Admin Dashboard opens
  }, [])

  /**useEffect(() => {
    if (contextProducts) {
      setProducts(contextProducts.map(product => ({
        ...product,
        isVisible: product.isVisible !== false,
        discount: product.discount || 0,
        isNew: product.isNew || false
      })))
    }
  }, [contextProducts]) **/

  const handleLogout = () => {
    logout()
  }

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='border-t pt-16'>

        {/* Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10'>
          <div className='flex items-center gap-2'>
            <p className='text-[#504c41] text-3xl font-medium uppercase'>Admin Dashboard</p>
            <p className='w-12 h-[2px] bg-[#D0A823]'></p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={() => navigate('/')}
              className='border border-[#D0A823] text-[#D0A823] px-6 py-2 rounded hover:bg-[#FEED9F] transition-all font-medium text-sm uppercase'
            >
              Return to Store
            </button>
            <button
              onClick={handleLogout}
              className='border border-red-500 text-red-500 px-6 py-2 rounded hover:bg-red-50 transition-all font-medium text-sm uppercase'
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-6'>
          <div className='relative max-w-md'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'products' ? 'products...' :
                  activeTab === 'orders' ? 'orders...' :
                    activeTab === 'reviews' ? 'reviews...' :
                      activeTab === 'vouchers' ? 'vouchers...' :
                        activeTab === 'users' ? 'users...' :
                          'messages...'
                }`}
              className='w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D0A823] focus:ring-1 focus:ring-[#D0A823]'
            />
            <svg
              className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex flex-wrap gap-4 text-sm text-gray-500 border-b border-gray-200 mb-8'>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-1 border-b-2 transition-all font-medium ${activeTab === 'products'
              ? 'border-[#D0A823] text-[#504c41]'
              : 'border-transparent hover:text-gray-700'
              }`}
          >
            Products & Inventory
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 border-b-2 transition-all font-medium ${activeTab === 'orders'
              ? 'border-[#D0A823] text-[#504c41]'
              : 'border-transparent hover:text-gray-700'
              }`}
          >
            Order Management
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-1 border-b-2 transition-all font-medium ${activeTab === 'reviews'
              ? 'border-[#D0A823] text-[#504c41]'
              : 'border-transparent hover:text-gray-700'
              }`}
          >
            Reviews Management
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-1 border-b-2 transition-all font-medium ${activeTab === 'messages'
              ? 'border-[#D0A823] text-[#504c41]'
              : 'border-transparent hover:text-gray-700'
              }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 px-1 border-b-2 transition-all font-medium ${activeTab === 'vouchers'
              ? 'border-[#D0A823] text-[#504c41]'
              : 'border-transparent hover:text-gray-700'
              }`}
          >
            Vouchers
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-1 border-b-2 transition-all font-medium ${activeTab === 'users'
              ? 'border-[#D0A823] text-[#504c41]'
              : 'border-transparent hover:text-gray-700'
              }`}
          >
            Users
          </button>
        </div>

        {/* Content Area */}
        <div className='mb-16'>
          {activeTab === 'products' && (
            <ProductManagement products={products} setProducts={setProducts} searchQuery={searchQuery} />
          )}
          {activeTab === 'orders' && (
            <OrderManagement searchQuery={searchQuery} />
          )}
          {activeTab === 'reviews' && (
            <ReviewManagement reviews={reviews} setReviews={setReviews} searchQuery={searchQuery} products={products} />
          )}
          {activeTab === 'messages' && (
            <ContactManagement searchQuery={searchQuery} />
          )}
          {activeTab === 'vouchers' && (
            <VoucherManagement searchQuery={searchQuery} />
          )}
          {activeTab === 'users' && (
            <UserManagement searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
