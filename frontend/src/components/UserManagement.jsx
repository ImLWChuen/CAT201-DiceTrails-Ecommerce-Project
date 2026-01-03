import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const UserManagement = ({ searchQuery }) => {
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState('All')
    const [isLoading, setIsLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(null) // { userEmail, username }
    const [currentAdminEmail, setCurrentAdminEmail] = useState('')

    useEffect(() => {
        const adminEmail = localStorage.getItem('userEmail')
        setCurrentAdminEmail(adminEmail || '')
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/all-users')
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteUser = async (userEmail, username) => {
        try {
            const response = await fetch('http://localhost:8080/api/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: userEmail,
                    adminEmail: currentAdminEmail
                })
            })

            const result = await response.json()

            if (result.success) {
                toast.success(`User "${username}" deleted successfully`)
                setUsers(users.filter(u => u.email !== userEmail))
                setDeleteConfirm(null)
            } else {
                toast.error(result.message || 'Failed to delete user')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Error connecting to server')
        }
    }

    // Filter users based on role filter and search query
    const filteredUsers = users.filter(user => {
        // Apply role filter
        if (filter === 'Admins' && !user.isAdmin) return false
        if (filter === 'Users' && user.isAdmin) return false

        // Apply search query
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            user.username?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.userId?.toString().includes(query)
        )
    })

    if (isLoading) {
        return (
            <div className='text-center py-12'>
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0A823]'></div>
                <p className='text-gray-500 mt-4'>Loading users...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className='flex flex-wrap gap-2 mb-6'>
                {['All', 'Admins', 'Users'].map(option => (
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

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
                        <h3 className='text-xl font-bold text-red-600 mb-4'>⚠️ Delete User Account</h3>
                        <p className='text-gray-700 mb-2'>
                            Are you sure you want to delete <strong>{deleteConfirm.username}</strong>
                            ({deleteConfirm.userEmail})?
                        </p>
                        <div className='bg-red-50 border border-red-200 rounded p-3 mb-4'>
                            <p className='text-red-700 text-sm font-semibold'>This action cannot be undone!</p>
                            <p className='text-red-600 text-xs mt-1'>
                                This will permanently delete:
                            </p>
                            <ul className='text-red-600 text-xs mt-1 ml-4 list-disc'>
                                <li>User account</li>
                                <li>All orders</li>
                                <li>All reviews</li>
                            </ul>
                        </div>
                        <div className='flex gap-3'>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className='flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteUser(deleteConfirm.userEmail, deleteConfirm.username)}
                                className='flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold'
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    User ID
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Username
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Role
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Newsletter
                                </th>
                                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    const isCurrentAdmin = user.email === currentAdminEmail
                                    return (
                                        <tr key={user.email} className={isCurrentAdmin ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {user.userId || 'N/A'}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {user.username}
                                                    {isCurrentAdmin && (
                                                        <span className='ml-2 text-xs text-blue-600 font-semibold'>(You)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                {user.email}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${user.isAdmin
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.isAdmin ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                {user.isNewsletterSubscribed ? (
                                                    <span className='text-green-600'>✓ Subscribed</span>
                                                ) : (
                                                    <span className='text-gray-400'>Not subscribed</span>
                                                )}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                                                {isCurrentAdmin ? (
                                                    <span className='text-gray-400 text-xs'>Cannot delete own account</span>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm({
                                                            userEmail: user.email,
                                                            username: user.username
                                                        })}
                                                        className='text-red-600 hover:text-red-900 font-medium'
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan='6' className='px-6 py-12 text-center text-gray-500'>
                                        {searchQuery ? 'No users found matching your search' : 'No users found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div className='mt-4 text-sm text-gray-600'>
                Showing {filteredUsers.length} of {users.length} users
            </div>
        </div>
    )
}

export default UserManagement
