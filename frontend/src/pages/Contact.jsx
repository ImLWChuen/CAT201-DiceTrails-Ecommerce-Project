import React, { useState } from 'react'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      toast.success('Message sent! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
    } else {
      toast.error('Please fill in all fields')
    }
  }

  return (
    <div className='pt-10 border-t'>
      <div className='mb-12'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <h1 className='text-4xl font-bold mb-6 text-[#504C41]'>Let's Connect</h1>
      
      <p className='text-lg text-gray-700 mb-12 leading-relaxed'>
        Have a question about a rule? Need a recommendation for your next game night? Or maybe there is an issue with your order? We are here to help guide you.
      </p>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Get in Touch</h2>
        
        <div className='border border-gray-300 rounded-lg p-6 mb-8 bg-gray-50'>
          <div className='mb-4'>
            <p className='text-lg font-semibold text-[#504C41] mb-2'>Email Us:</p>
            <p className='text-gray-700'>support@dicetrails.com</p>
          </div>
          
          <div className='mb-4'>
            <p className='text-lg font-semibold text-[#504C41] mb-2'>Follow the Trail:</p>
            <p className='text-gray-700'>@DiceTrails (Instagram/Twitter/Facebook)</p>
          </div>
          
          <div>
            <p className='text-lg font-semibold text-[#504C41] mb-2'>Response Time:</p>
            <p className='text-gray-700'>We aim to reply to all queries within 24 hours.</p>
          </div>
        </div>
      </div>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Visit Our HQ</h2>
        <p className='text-gray-700 text-lg'>123 Tabletop Avenue, Creative District, Kuala Lumpur.</p>
      </div>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Send us a Message</h2>
        <form onSubmit={handleSubmit} className='max-w-2xl'>
          <div className='mb-6'>
            <label className='block text-gray-700 font-semibold mb-2'>Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Your Name'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D0A823]'
            />
          </div>
          
          <div className='mb-6'>
            <label className='block text-gray-700 font-semibold mb-2'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='your.email@example.com'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D0A823]'
            />
          </div>
          
          <div className='mb-6'>
            <label className='block text-gray-700 font-semibold mb-2'>Message</label>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              placeholder='Your message...'
              rows='5'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D0A823]'
            ></textarea>
          </div>
          
          <button
            type='submit'
            className='bg-[#D0A823] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#b8921d] transition-colors'
          >
            Send us a Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
