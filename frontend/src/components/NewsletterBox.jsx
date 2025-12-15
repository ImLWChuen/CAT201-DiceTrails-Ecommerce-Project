import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-bold text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro laborum, veniam ipsam earum, harum neque illum incidunt doloremque esse quaerat ab laudantium ad at assumenda voluptate! Dolores magnam voluptas accusantium.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 mb-20 bg-white rounded-lg'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
            <button type='submit' className='bg-[#d0a823] text-white text-xs px-10 py-4 font-bold rounded-lg'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox
