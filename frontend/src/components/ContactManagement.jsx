import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const ContactManagement = ({ searchQuery = '' }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortOrder, setSortOrder] = useState('newest')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/contact')
            if (response.ok) {
                const data = await response.json()
                // Sort by newest first
                const sortedData = data.sort((a, b) => b.date - a.date)
                setMessages(sortedData)
            } else {
                toast.error('Failed to load messages')
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
            toast.error('Error loading messages')
        } finally {
            setLoading(false)
        }
    }



    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return

        try {
            const response = await fetch(`http://localhost:8080/api/contact?id=${id}`, {
                method: 'DELETE',
            })
            const result = await response.json()

            if (result.success) {
                toast.success('Message deleted')
                setMessages(messages.filter(msg => msg.id !== id))
            } else {
                toast.error('Failed to delete message')
            }
        } catch (error) {
            console.error('Error deleting message:', error)
            toast.error('Error connecting to server')
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getSortedMessages = () => {
        let filtered = messages;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(query) ||
                msg.email.toLowerCase().includes(query) ||
                msg.message.toLowerCase().includes(query)
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortOrder === 'newest') return b.date - a.date
            return a.date - b.date
        })
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-[#504C41]'>Customer Messages</h2>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D0A823] bg-white text-sm'
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {loading ? (
                <p className='text-gray-500'>Loading messages...</p>
            ) : messages.length === 0 ? (
                <div className='bg-white rounded-lg shadow p-8 text-center'>
                    <p className='text-gray-500'>No messages received yet.</p>
                </div>
            ) : (
                <div className='grid gap-4'>
                    {getSortedMessages().map((msg) => (
                        <div key={msg.id} className='bg-white rounded-lg shadow p-6 border-l-4 border-[#D0A823]'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='font-bold text-lg text-[#504C41]'>{msg.name}</h3>
                                    <a href={`mailto:${msg.email}`} className='text-blue-600 hover:underline text-sm'>
                                        {msg.email}
                                    </a>
                                </div>
                                <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                                    {formatDate(msg.date)}
                                </span>
                            </div>
                            <div className='bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap mb-4'>
                                {msg.message}
                            </div>
                            <div className='flex justify-end'>
                                <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className='text-red-500 hover:text-red-700 text-sm font-medium hover:underline'
                                >
                                    Delete Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ContactManagement
