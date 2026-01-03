import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ProductManagement = ({ products, setProducts, searchQuery = '' }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    image: [],
    category: 'board games',
    subCategory: 'strategy',
    quantity: 10
  })

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.subCategory.toLowerCase().includes(query) ||
      product._id.toString().includes(query)
    )
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value
    }))
  }

  const validateProduct = () => {
    // Validate name
    if (!formData.name.trim()) {
      alert('Product name is required');
      return false;
    }

    // Validate description
    if (!formData.description.trim()) {
      alert('Product description is required');
      return false;
    }

    // Validate price
    if (!formData.price || formData.price <= 0) {
      alert('Price must be greater than 0');
      return false;
    }

    // Validate quantity
    if (formData.quantity < 0) {
      alert('Quantity cannot be negative');
      return false;
    }

    // Validate at least one image
    if (!formData.image || formData.image.length === 0) {
      alert('At least one product image is required');
      return false;
    }

    return true;
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    // Validate before proceeding
    if (!validateProduct()) {
      return;
    }

    if (editingId) {
      // Update existing product
      const updatedProduct = { ...formData }

      try {
        const response = await fetch('http://localhost:8080/api/update-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        })
        const result = await response.json()

        if (result.success) {
          setProducts(products.map(p =>
            p._id === editingId ? updatedProduct : p
          ))
          toast.success('Product updated successfully')
          setEditingId(null)
        } else {
          toast.error(result.message || 'Failed to update product')
          return
        }
      } catch (error) {
        console.error('Error updating product:', error)
        toast.error('Error connecting to server')
        return
      }
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        image: formData.image || ['https://via.placeholder.com/300']
      }

      try {
        const response = await fetch('http://localhost:8080/api/add-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        })
        const result = await response.json()

        if (result.success) {
          // Use the ID returned by the backend
          const productWithId = { ...newProduct, _id: result.productId }
          setProducts([...products, productWithId])
          toast.success('Product added successfully')
        } else {
          toast.error(result.message || 'Failed to add product')
          return
        }
      } catch (error) {
        console.error('Error adding product:', error)
        toast.error('Error connecting to server')
        return
      }
    }
    setFormData({
      _id: '',
      name: '',
      description: '',
      price: '',
      image: [],
      category: 'board games',
      subCategory: 'strategy',
      quantity: 10
    })
    setShowAddForm(false)
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingId(product._id)
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      })
      const result = await response.json()

      if (result.success) {
        setProducts(products.filter(p => p._id !== id))
        toast.success('Product deleted successfully')
      } else {
        toast.error(result.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error connecting to server')
    }
  }

  const handleToggleVisibility = async (id) => {
    const product = products.find(p => p._id === id)
    if (!product) return

    const updatedProduct = { ...product, isVisible: !product.isVisible }

    try {
      const response = await fetch('http://localhost:8080/api/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      })
      const result = await response.json()

      if (result.success) {
        setProducts(products.map(p =>
          p._id === id ? updatedProduct : p
        ))
        toast.success(`Product ${updatedProduct.isVisible ? 'shown' : 'hidden'} successfully`)
      } else {
        toast.error(result.message || 'Failed to update visibility')
      }
    } catch (error) {
      console.error('Error updating visibility:', error)
      toast.error('Error connecting to server')
    }
  }

  const handleApplyDiscount = async (id, percentage) => {
    const product = products.find(p => p._id === id)
    if (!product) return

    const updatedProduct = { ...product, discount: percentage }

    try {
      const response = await fetch('http://localhost:8080/api/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      })
      const result = await response.json()

      if (result.success) {
        setProducts(products.map(p =>
          p._id === id ? updatedProduct : p
        ))
        toast.success(`Discount ${percentage}% applied successfully`)
      } else {
        toast.error(result.message || 'Failed to apply discount')
      }
    } catch (error) {
      console.error('Error applying discount:', error)
      toast.error('Error connecting to server')
    }
  }

  const handleTagAsNew = async (id) => {
    const product = products.find(p => p._id === id)
    if (!product) return

    const updatedProduct = { ...product, isNew: !product.isNew }

    try {
      const response = await fetch('http://localhost:8080/api/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      })
      const result = await response.json()

      if (result.success) {
        setProducts(products.map(p =>
          p._id === id ? updatedProduct : p
        ))
        toast.success(`Product ${updatedProduct.isNew ? 'tagged as new' : 'removed new tag'} successfully`)
      } else {
        toast.error(result.message || 'Failed to update tag')
      }
    } catch (error) {
      console.error('Error updating tag:', error)
      toast.error('Error connecting to server')
    }
  }

  const handleStockChange = async (id, change) => {
    const product = products.find(p => p._id === id)
    if (!product) return

    const newQuantity = Math.max(0, (product.quantity || 0) + change)
    const updatedProduct = { ...product, quantity: newQuantity }

    try {
      const response = await fetch('http://localhost:8080/api/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      })
      const result = await response.json()

      if (result.success) {
        setProducts(products.map(p =>
          p._id === id ? updatedProduct : p
        ))
        toast.success(`Stock updated to ${newQuantity}`)
      } else {
        toast.error(result.message || 'Failed to update stock')
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      toast.error('Error connecting to server')
    }
  }

  const calculateDiscountedPrice = (price, discount) => {
    return (price * (1 - discount / 100)).toFixed(2)
  }

  return (
    <div>
      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-6 text-[#504C41] flex items-center gap-2'>
            <span className='text-[#D0A823]'>{editingId ? 'Edit' : 'Add'}</span>
            <span>Product</span>
          </h2>

          <form onSubmit={handleAddProduct} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Product Name *</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                placeholder='e.g., Catan: The Game'
              />
            </div>

            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Price (RM) *</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                required
                step='0.01'
                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                placeholder='29.99'
              />
            </div>

            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Category *</label>
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
              >
                <option value='board games'>Board Games</option>
                <option value='card games'>Card Games</option>
                <option value='accessories'>Accessories</option>
              </select>
            </div>

            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Sub-Category *</label>
              <select
                name='subCategory'
                value={formData.subCategory}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
              >
                <option value='strategy'>Strategy Games</option>
                <option value='family'>Family Games</option>
                <option value='party'>Party Games</option>
                <option value='abstract'>Abstract Games</option>
                <option value='word'>Word Games</option>
                <option value='mystery'>Mystery Games</option>
              </select>
            </div>

            <div className='md:col-span-2'>
              <label className='block text-gray-700 font-semibold mb-2'>Description *</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
                rows='3'
                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                placeholder='Describe the product...'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-gray-700 font-semibold mb-2'>Product Images</label>
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>Upload from Computer (Multiple)</label>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files)
                      if (files.length > 0) {
                        const newImages = []
                        let loadedCount = 0

                        files.forEach((file) => {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            newImages.push(reader.result)
                            loadedCount++

                            if (loadedCount === files.length) {
                              setFormData(prev => ({
                                ...prev,
                                image: [...(prev.image || []), ...newImages]
                              }))
                            }
                          }
                          reader.readAsDataURL(file)
                        })
                      }
                    }}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FEED9F] file:text-[#504C41] hover:file:bg-[#D0A823] file:cursor-pointer'
                  />
                  <p className='text-xs text-gray-500 mt-1'>First uploaded image will be the front cover</p>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>Or enter Image URL</label>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      id='imageUrlInput'
                      className='flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                      placeholder='https://example.com/image.jpg'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        const input = document.getElementById('imageUrlInput')
                        if (input.value.trim()) {
                          setFormData(prev => ({
                            ...prev,
                            image: [...(prev.image || []), input.value.trim()]
                          }))
                          input.value = ''
                        }
                      }}
                      className='px-4 py-2 bg-[#D0A823] hover:bg-[#b8951f] text-[#504C41] font-semibold rounded text-sm'
                    >
                      Add URL
                    </button>
                  </div>
                </div>
                {formData.image && formData.image.length > 0 && (
                  <div className='mt-3'>
                    <p className='text-sm text-gray-600 mb-2'>Preview ({formData.image.length} image{formData.image.length > 1 ? 's' : ''}):</p>
                    <div className='flex flex-wrap gap-3'>
                      {formData.image.map((img, index) => (
                        <div key={index} className='relative group'>
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className='h-24 w-24 object-cover border-2 border-gray-300 rounded'
                          />
                          <div className='absolute top-1 left-1 bg-[#D0A823] text-[#504C41] text-xs font-bold px-2 py-0.5 rounded'>
                            {index === 0 ? 'COVER' : `#${index + 1}`}
                          </div>
                          <button
                            type='button'
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                image: prev.image.filter((_, i) => i !== index)
                              }))
                            }}
                            className='absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                            title='Remove image'
                          >
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='md:col-span-2 flex gap-4'>
              <button
                type='submit'
                className='flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors'
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({
                    _id: '',
                    name: '',
                    description: '',
                    price: '',
                    image: [],
                    category: 'board games',
                    subCategory: 'strategy',
                    quantity: 10
                  })
                }}
                className='flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded transition-colors'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddForm && (
        <div className='mb-6'>
          <button
            onClick={() => setShowAddForm(true)}
            className='bg-[#D0A823] hover:bg-[#b8951f] text-[#504C41] font-bold px-6 py-3 rounded transition-colors flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
            </svg>
            Add New Product
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-[#504C41] text-white'>
              <tr>
                <th className='px-6 py-3 text-left'>Product Name</th>
                <th className='px-6 py-3 text-left'>Price</th>
                <th className='px-6 py-3 text-center'>Stock</th>
                <th className='px-6 py-3 text-center'>Discount</th>
                <th className='px-6 py-3 text-center'>Tags</th>
                <th className='px-6 py-3 text-center'>Visibility</th>
                <th className='px-6 py-3 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className='border-t hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='font-semibold text-gray-800'>{product.name}</div>
                    <div className='text-xs text-gray-500'>{product.category}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='font-semibold'>RM {product.price}</div>
                    {product.discount > 0 && (
                      <div className='text-xs text-green-600'>
                        RM {calculateDiscountedPrice(product.price, product.discount)}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => handleStockChange(product._id, -1)}
                        className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm'
                      >
                        −
                      </button>
                      <span className='font-bold w-8 text-center'>{product.quantity || 0}</span>
                      <button
                        onClick={() => handleStockChange(product._id, 1)}
                        className='bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm'
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='number'
                        min='0'
                        max='100'
                        value={product.discount || 0}
                        onChange={(e) => handleApplyDiscount(product._id, parseInt(e.target.value))}
                        className='w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm'
                        placeholder='%'
                      />
                      <span className='text-xs text-gray-600'>%</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-wrap gap-2 justify-center'>
                      {product.isNew && (
                        <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>New</span>
                      )}
                      {product.discount > 0 && (
                        <span className='bg-red-100 text-red-800 text-xs px-2 py-1 rounded'>
                          -{product.discount}% OFF
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleTagAsNew(product._id)}
                      className='mt-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded'
                    >
                      {product.isNew ? 'Remove New' : 'Tag as New'}
                    </button>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => handleToggleVisibility(product._id)}
                      className={`px-3 py-1 rounded text-white text-sm font-semibold flex items-center gap-1 ${product.isVisible
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                    >
                      {product.isVisible ? (
                        <>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                          </svg>
                          Visible
                        </>
                      ) : (
                        <>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                          </svg>
                          Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2 justify-center'>
                      <button
                        onClick={() => handleEdit(product)}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            {searchQuery ? (
              <p className='text-lg'>No products found matching "{searchQuery}"</p>
            ) : (
              <p className='text-lg'>No products yet. Create your first product!</p>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className='grid grid-cols-3 gap-4 mt-6'>
        <div className='bg-blue-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-blue-600'>{products.length}</div>
          <div className='text-gray-700 font-semibold'>Total Products</div>
        </div>
        <div className='bg-green-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-green-600'>
            {products.filter(p => p.isVisible).length}
          </div>
          <div className='text-gray-700 font-semibold'>Visible Products</div>
        </div>
        <div className='bg-orange-100 rounded-lg p-4 text-center'>
          <div className='text-3xl font-bold text-orange-600'>
            {products.filter(p => p.discount > 0).length}
          </div>
          <div className='text-gray-700 font-semibold'>On Discount</div>
        </div>
      </div>
    </div>
  )
}

export default ProductManagement
