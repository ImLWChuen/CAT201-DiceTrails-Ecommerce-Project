import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const NewsletterBox = () => {
  const { user, subscribeNewsletter } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please log in to subscribe to our newsletter");
      return;
    }

    if (user.isNewsletterSubscribed) {
      toast.info("You are already subscribed to our newsletter!");
      return;
    }

    setIsSubmitting(true);
    const success = await subscribeNewsletter(user.email);
    if (success) {
      setEmail('');
    }
    setIsSubmitting(false);
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-bold text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>Sign up or log in to join our gaming community and get 20% off your first order! Subscribe to receive exclusive promotions, early access to new game releases, and expert gaming tips delivered straight to your inbox.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 mb-20 bg-white rounded-lg'>
        <input
          className='w-full sm:flex-1 outline-none'
          type="email"
          placeholder={user?.isNewsletterSubscribed ? 'Already subscribed!' : 'Enter your email'}
          value={user?.email || email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!user || user?.isNewsletterSubscribed || isSubmitting}
        />
        <button
          type='submit'
          className={`text-white text-xs px-10 py-4 font-bold rounded-lg ${!user || user?.isNewsletterSubscribed || isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#d0a823] hover:bg-[#b8941f]'
            }`}
          disabled={!user || user?.isNewsletterSubscribed || isSubmitting}
        >
          {isSubmitting ? 'SUBSCRIBING...' : (user?.isNewsletterSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE')}
        </button>
      </form>
    </div>
  )
}

export default NewsletterBox
