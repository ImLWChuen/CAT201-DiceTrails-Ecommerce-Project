import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const VoucherManagement = ({ searchQuery = '' }) => {
    const [vouchers, setVouchers] = useState([])
    const [filter, setFilter] = useState('All')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingCode, setEditingCode] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        isActive: true,
        description: ''
    })

    useEffect(() => {
        fetchVouchers()
    }, [])

    const fetchVouchers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/vouchers')
            const data = await response.json()
            setVouchers(data)
        } catch (error) {
            console.error('Error fetching vouchers:', error)
            toast.error('Failed to load vouchers')
        }
    }

    const filteredVouchers = vouchers.filter(voucher => {
        // Apply status filter
        if (filter === 'Active' && !voucher.isActive) return false
        if (filter === 'Inactive' && voucher.isActive) return false

        // Apply search query
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            voucher.code.toLowerCase().includes(query) ||
            voucher.description.toLowerCase().includes(query)
        )
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const validateForm = () => {
        if (!formData.code.trim()) {
            toast.error('Voucher code is required')
            return false
        }
        if (!formData.discountValue || formData.discountValue <= 0) {
            toast.error('Discount value must be greater than 0')
            return false
        }
        if (formData.discountType === 'percentage' && formData.discountValue > 100) {
            toast.error('Percentage discount cannot exceed 100%')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        const endpoint = editingCode
            ? 'http://localhost:8080/api/update-voucher'
            : 'http://localhost:8080/api/add-voucher'

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    discountValue: parseFloat(formData.discountValue)
                })
            })
            const result = await response.json()

            if (result.success) {
                toast.success(result.message)
                fetchVouchers()
                resetForm()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Error saving voucher:', error)
            toast.error('Error saving voucher')
        }
    }

    const handleEdit = (voucher) => {
        setFormData(voucher)
        setEditingCode(voucher.code)
        setShowAddForm(true)
    }

    const handleDelete = async (code) => {
        if (!window.confirm(`Are you sure you want to delete voucher "${code}"?`)) {
            return
        }

        try {
            const response = await fetch('http://localhost:8080/api/delete-voucher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })
            const result = await response.json()

            if (result.success) {
                toast.success('Voucher deleted successfully')
                fetchVouchers()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Error deleting voucher:', error)
            toast.error('Error deleting voucher')
        }
    }

    const handleToggleActive = async (voucher) => {
        try {
            const response = await fetch('http://localhost:8080/api/update-voucher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...voucher,
                    isActive: !voucher.isActive
                })
            })
            const result = await response.json()

            if (result.success) {
                toast.success(`Voucher ${!voucher.isActive ? 'activated' : 'deactivated'}`)
                fetchVouchers()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Error toggling voucher:', error)
            toast.error('Error updating voucher')
        }
    }

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: '',
            isActive: true,
            description: ''
        })
        setShowAddForm(false)
        setEditingCode(null)
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className='flex flex-wrap gap-2 mb-6'>
                {['All', 'Active', 'Inactive'].map(option => (
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
            {/* Add/Edit Voucher Form */}
            {showAddForm && (
                <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
                    <h2 className='text-2xl font-bold mb-6 text-[#504C41] flex items-center gap-2'>
                        <span className='text-[#D0A823]'>{editingCode ? 'Edit' : 'Add'}</span>
                        <span>Voucher</span>
                    </h2>

                    <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Voucher Code *</label>
                            <input
                                type='text'
                                name='code'
                                value={formData.code}
                                onChange={handleInputChange}
                                disabled={editingCode}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823] uppercase'
                                placeholder='e.g., WELCOME10'
                            />
                        </div>

                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>Discount Type *</label>
                            <select
                                name='discountType'
                                value={formData.discountType}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                            >
                                <option value='percentage'>Percentage (%)</option>
                                <option value='fixed'>Fixed Amount (RM)</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-gray-700 font-semibold mb-2'>
                                Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(RM)'}
                            </label>
                            <input
                                type='number'
                                name='discountValue'
                                value={formData.discountValue}
                                onChange={handleInputChange}
                                required
                                step='0.01'
                                min='0'
                                max={formData.discountType === 'percentage' ? '100' : undefined}
                                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                                placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 5.00'}
                            />
                        </div>

                        <div className='flex items-center'>
                            <label className='flex items-center cursor-pointer'>
                                <input
                                    type='checkbox'
                                    name='isActive'
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className='mr-2 w-5 h-5 text-[#D0A823] focus:ring-[#D0A823] border-gray-300 rounded'
                                />
                                <span className='text-gray-700 font-semibold'>Active</span>
                            </label>
                        </div>

                        <div className='md:col-span-2'>
                            <label className='block text-gray-700 font-semibold mb-2'>Description</label>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                rows='2'
                                className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823]'
                                placeholder='Internal description for reference...'
                            />
                        </div>

                        <div className='md:col-span-2 flex gap-4'>
                            <button
                                type='submit'
                                className='flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors'
                            >
                                {editingCode ? 'Update Voucher' : 'Add Voucher'}
                            </button>
                            <button
                                type='button'
                                onClick={resetForm}
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
                        Add New Voucher
                    </button>
                </div>
            )}

            {/* Vouchers Table */}
            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-[#504C41] text-white'>
                            <tr>
                                <th className='px-6 py-3 text-left'>Code</th>
                                <th className='px-6 py-3 text-left'>Discount</th>
                                <th className='px-6 py-3 text-left'>Description</th>
                                <th className='px-6 py-3 text-center'>Status</th>
                                <th className='px-6 py-3 text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVouchers.map((voucher) => (
                                <tr key={voucher.code} className='border-t hover:bg-gray-50'>
                                    <td className='px-6 py-4'>
                                        <div className='font-bold text-lg text-[#504C41]'>{voucher.code}</div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='font-semibold text-green-600'>
                                            {voucher.discountType === 'percentage'
                                                ? `${voucher.discountValue}% OFF`
                                                : `RM ${voucher.discountValue.toFixed(2)} OFF`}
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                            {voucher.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='text-sm text-gray-600'>
                                            {voucher.description || <span className='italic text-gray-400'>No description</span>}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 text-center'>
                                        <button
                                            onClick={() => handleToggleActive(voucher)}
                                            className={`px-3 py-1 rounded text-white text-sm font-semibold ${voucher.isActive
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-gray-500 hover:bg-gray-600'
                                                }`}
                                        >
                                            {voucher.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex gap-2 justify-center'>
                                            <button
                                                onClick={() => handleEdit(voucher)}
                                                className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1'
                                            >
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(voucher.code)}
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

                {filteredVouchers.length === 0 && (
                    <div className='text-center py-8 text-gray-500'>
                        {searchQuery ? (
                            <p className='text-lg'>No vouchers found matching "{searchQuery}"</p>
                        ) : (
                            <p className='text-lg'>No vouchers yet. Create your first voucher!</p>
                        )}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className='grid grid-cols-2 gap-4 mt-6'>
                <div className='bg-blue-100 rounded-lg p-4 text-center'>
                    <div className='text-3xl font-bold text-blue-600'>{vouchers.length}</div>
                    <div className='text-gray-700 font-semibold'>Total Vouchers</div>
                </div>
                <div className='bg-green-100 rounded-lg p-4 text-center'>
                    <div className='text-3xl font-bold text-green-600'>
                        {vouchers.filter(v => v.isActive).length}
                    </div>
                    <div className='text-gray-700 font-semibold'>Active Vouchers</div>
                </div>
            </div>
        </div>
    )
}

export default VoucherManagement
