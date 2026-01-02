import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductManagement from '../components/ProductManagement'
import ReviewManagement from '../components/ReviewManagement'
import OrderManagement from '../components/OrderManagement'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
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
    if (contextProducts) {
      setProducts(contextProducts.map(product => ({
        ...product,
        isVisible: product.isVisible !== false,
        discount: product.discount || 0,
        isNew: product.isNew || false
      })))
    }
  }, [contextProducts])

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
          <button
            onClick={handleLogout}
            className='border border-red-500 text-red-500 px-6 py-2 rounded hover:bg-red-50 transition-all font-medium text-sm uppercase'
          >
            Logout
          </button>
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
        </div>

        {/* Content Area */}
        <div className='mb-16'>
          {activeTab === 'products' && (
            <ProductManagement products={products} setProducts={setProducts} />
          )}
          {activeTab === 'orders' && (
            <OrderManagement />
          )}
          {activeTab === 'reviews' && (
            <ReviewManagement reviews={reviews} setReviews={setReviews} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
