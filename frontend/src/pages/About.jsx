import React from 'react'
import Title from '../components/Title'

const About = () => {
  return (
    <div className='pt-10 border-t'>
      <div className='mb-12 text-4xl'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <h1 className='text-2xl font-bold mb-6 text-[#504C41]'>Charting New Paths, One Dice Roll at a Time</h1>

      <p className='text-lg text-gray-700 mb-8 leading-relaxed'>
        Welcome to DiceTrails. We believe that the best stories aren't found on screens, but on tabletops, shared between friends and family.
      </p>

      <div className='mb-10'>
        <h2 className='text-2xl font-bold mb-4 text-[#504C41]'>Our Mission: Games That Connect</h2>
        <p className='text-lg text-gray-700 leading-relaxed mb-4'>
          In an increasingly digital world, we started DiceTrails with a simple goal: to bring people back together. Whether you are strategizing over a complex map, bluffing your way through a card game, or laughing over a party classic, every game is a journey.
        </p>
        <p className='text-lg text-gray-700 leading-relaxed'>
          We curate a specific collection of board games and card games designed to spark conversation and build connections.
        </p>
      </div>

      <div className='mb-10'>
        <h2 className='text-2xl font-bold mb-4 text-[#504C41]'>The Trail Ahead</h2>
        <p className='text-lg text-gray-700 leading-relaxed'>
          We aren't just a store; we are fellow travelers. From the latest strategy hits to timeless classics, our catalogue is built by gamers, for gamers. We are here to help you find the perfect game for your next game night.
        </p>
      </div>

      {/* Policies Section */}
      <div id='policies' className='mb-12 pt-8 border-t'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Our Policies</h2>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Easy Exchange Policy</h3>
          <p className='text-gray-700 leading-relaxed'>We offer a hassle-free exchange policy. If you receive a damaged or defective product, we will gladly exchange it for you. Simply contact our customer support team within 7 days of receiving your order, and we'll arrange for a replacement at no extra cost.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>7 Days Return Policy</h3>
          <p className='text-gray-700 leading-relaxed'>We provide a 7-day free return policy on all our products. If you're not completely satisfied with your purchase, you can return it within 7 days for a full refund. The product must be in its original condition and packaging. Return shipping costs will be covered by us if the product is defective or damaged.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>24/7 Customer Support</h3>
          <p className='text-gray-700 leading-relaxed'>We provide 24/7 customer support to ensure your gaming experience is smooth and enjoyable. Whether you have questions about our products, need help with an order, or want game recommendations, our dedicated support team is always here to help. Reach us via email at support@dicetrails.com or through our contact form.</p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Newsletter Subscriber Benefits</h3>
          <p className='text-gray-700 leading-relaxed'>Subscribe to our newsletter and enjoy 20% off on your first order! Plus, get exclusive access to new game releases, special promotions, and gaming tips delivered straight to your inbox.</p>
        </div>
      </div>

      {/* Delivery Section */}
      <div id='delivery' className='mb-12 pt-8 border-t'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Delivery & Shipping</h2>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>How long does delivery take?</h3>
          <p className='text-gray-700 leading-relaxed'>We offer standard delivery within 3-5 business days and international delivery within 5-7 business days. All orders are processed within 24 hours during business days.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>What are the shipping fees?</h3>
          <p className='text-gray-700 leading-relaxed'>Shipping costs are calculated based on your location and total order value. Free shipping is available for orders over RM100 for customers in West Malaysia. For customers in East Malaysia, free shipping for orders over RM150. For international customers, International shipping is free for orders over RM200.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Do you deliver internationally?</h3>
          <p className='text-gray-700 leading-relaxed'>Currently, we deliver within Malaysia and offer International Shipping. Please contact us at support@dicetrails.com for inquiries.</p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Can I track my order?</h3>
          <p className='text-gray-700 leading-relaxed'>Yes! Once your order is shipped, you will receive a tracking number via email. You can track your package in real-time through our website or the courier's portal.</p>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div id='terms' className='mb-12 pt-8 border-t'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Terms & Conditions</h2>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Acceptance of Terms</h3>
          <p className='text-gray-700 leading-relaxed'>By accessing and placing an order with DiceTrails, you confirm that you are in agreement with and bound by the terms of service outlined below. These terms apply to the entire website and any email or other type of communication between you and DiceTrails.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Product Accuracy & Pricing</h3>
          <p className='text-gray-700 leading-relaxed'>We strive to ensure that all board game descriptions, images, and prices are accurate. However, errors may occur. All prices are listed in Malaysian Ringgit (RM). We reserve the right to correct any errors in pricing or descriptions and to cancel or refuse any order placed based on incorrect pricing.</p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Intellectual Property</h3>
          <p className='text-gray-700 leading-relaxed'>All content on this website, including text, graphics, logos, and images, is the property of DiceTrails or its content suppliers and is protected by Malaysian and international copyright laws.</p>
        </div>
      </div>

      {/* Privacy Policy Section */}
      <div id='privacy' className='mb-12 pt-8 border-t'>
        <h2 className='text-2xl font-bold mb-6 text-[#504C41]'>Privacy Policy</h2>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>What data do we collect?</h3>
          <p className='text-gray-700 leading-relaxed'>We collect information necessary to process your orders, including name, email, shipping address, and payment details. We also track browsing behavior to improve your shopping experience.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>How do we protect your data?</h3>
          <p className='text-gray-700 leading-relaxed'>Your personal information is encrypted and stored securely. We never share your data with third parties without your consent, except for payment processing and order fulfillment.</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>Can I opt out of marketing emails?</h3>
          <p className='text-gray-700 leading-relaxed'>Yes! You can unsubscribe from marketing emails at any time by clicking the unsubscribe link at the bottom of our emails or by contacting us directly.</p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-3 text-[#504C41]'>How long do we keep your data?</h3>
          <p className='text-gray-700 leading-relaxed'>We retain your data for as long as your account is active or as needed to provide our services. You can request data deletion at any time by contacting support@dicetrails.com.</p>
        </div>
      </div>
    </div>
  )
}

export default About
