import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  const [activeTab, setActiveTab] = useState('policies')

  // Helper component for the Accordion Items (The Q&A parts)
  const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className='border-b border-gray-200 last:border-0'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-full py-4 flex justify-between items-center text-left group hover:bg-gray-50 transition-colors px-2 rounded'
        >
          <span className={`text-lg font-semibold text-[#504C41] group-hover:text-[#D0A823] transition-colors ${isOpen ? 'text-[#D0A823]' : ''}`}>
            {question}
          </span>
          <img
            src={assets.dropdown_icon}
            className={`w-5 h-5 opacity-70 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            alt="toggle"
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
        >
          <p className='text-gray-700 leading-relaxed px-2'>{answer}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='pt-10 border-t px-4 sm:px-0'>

      {/* --- HERO SECTION (Static Story) --- */}
      <div className='mb-12 text-4xl text-center'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='max-w-4xl mx-auto'>
        <div className='mb-16 text-center animate-fadeIn'>
          <h1 className='text-3xl font-bold mb-6 text-[#504C41]'>Charting New Paths, One Dice Roll at a Time</h1>
          <p className='text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto'>
            Welcome to DiceTrails. We believe that the best stories aren't found on screens, but on tabletops, shared between friends and family.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12 mb-20'>
          <div className='bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#D0A823]'>
            <h2 className='text-2xl font-bold mb-4 text-[#504C41]'>Our Mission</h2>
            <p className='text-gray-700 leading-relaxed'>
              In an increasingly digital world, our goal is simple: to bring people back together. Whether strategizing over a map or laughing over a party classic, every game is a journey. We curate games specifically designed to spark connection.
            </p>
          </div>
          <div className='bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#504C41]'>
            <h2 className='text-2xl font-bold mb-4 text-[#504C41]'>The Trail Ahead</h2>
            <p className='text-gray-700 leading-relaxed'>
              We aren't just a store, we are fellow travelers. From the latest strategy hits to timeless classics, our catalogue is built by gamers, for gamers. We are here to help you find the perfect game for your next game night.
            </p>
          </div>
        </div>

        {/* --- INTERACTIVE INFO HUB --- */}
        <div className='mb-20'>
          <h2 className='text-2xl font-bold mb-8 text-center text-[#504C41]'>Everything You Need To Know</h2>

          {/* Tabs Navigation */}
          <div className='flex flex-wrap justify-center gap-4 border-b border-gray-200 mb-8'>
            {['policies', 'delivery', 'terms', 'privacy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-6 text-sm sm:text-base font-medium transition-all duration-300 border-b-2 uppercase tracking-wide
                  ${activeTab === tab
                    ? 'border-[#D0A823] text-[#504C41] scale-105'
                    : 'border-transparent text-gray-400 hover:text-[#D0A823]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Content Area */}
          <div className='bg-white min-h-[400px] transition-all duration-500'>

            {activeTab === 'policies' && (
              <div className='animate-fadeIn'>
                <h3 className='text-xl font-bold mb-6 text-[#504C41] border-b pb-2'>Our Policies</h3>
                <AccordionItem
                  question="Easy Exchange Policy"
                  answer="We offer a hassle-free exchange policy. If you receive a damaged or defective product, we will gladly exchange it for you. Simply contact our customer support team within 7 days of receiving your order."
                />
                <AccordionItem
                  question="7 Days Return Policy"
                  answer="We provide a 7-day free return policy on all our products. If you're not completely satisfied with your purchase, you can return it within 7 days for a full refund. The product must be in its original condition."
                />
                <AccordionItem
                  question="24/7 Customer Support"
                  answer="We provide 24/7 customer support to ensure your gaming experience is smooth. Reach us via email at support@dicetrails.com or through our contact form."
                />
                <AccordionItem
                  question="Newsletter Benefits"
                  answer="Subscribe to our newsletter and enjoy 20% off on your first order! Plus, get exclusive access to new game releases and special promotions."
                />
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className='animate-fadeIn'>
                <h3 className='text-xl font-bold mb-6 text-[#504C41] border-b pb-2'>Delivery & Shipping</h3>
                <AccordionItem
                  question="How long does delivery take?"
                  answer="We offer standard delivery within 3-5 business days and international delivery within 5-7 business days. All orders are processed within 24 hours during business days."
                />
                <AccordionItem
                  question="What are the shipping fees?"
                  answer="Shipping costs are calculated based on your location and order value. Free shipping is available for orders over RM100 for customers in West Malaysia, Free shipping is available for orders over RM150 for customers in East Malaysia, and Free shipping is available for orders over RM200 for International Customers."
                />
                <AccordionItem
                  question="Do you deliver internationally?"
                  answer="Currently, we deliver within Malaysia and offer international shipping. Please contact us for inquiries."
                />
                <AccordionItem
                  question="Can I track my order?"
                  answer="Yes! Once your order is shipped, you will receive a tracking number via email. You can track your package in real-time through our website."
                />
              </div>
            )}

            {activeTab === 'terms' && (
              <div className='animate-fadeIn'>
                <h3 className='text-xl font-bold mb-6 text-[#504C41] border-b pb-2'>Terms & Conditions</h3>
                <div className='space-y-6 text-gray-700 leading-relaxed p-2'>
                  <div>
                    <h4 className='font-bold text-[#504C41] mb-2'>Acceptance of Terms</h4>
                    <p>By accessing and placing an order with DiceTrails, you confirm that you are in agreement with and bound by the terms of service outlined below.</p>
                  </div>
                  <div>
                    <h4 className='font-bold text-[#504C41] mb-2'>Product Accuracy & Pricing</h4>
                    <p>We strive to ensure that all descriptions and prices are accurate. However, errors may occur. We reserve the right to correct any errors and to cancel orders placed based on incorrect pricing.</p>
                  </div>
                  <div>
                    <h4 className='font-bold text-[#504C41] mb-2'>Intellectual Property</h4>
                    <p>All content on this website is the property of DiceTrails or its content suppliers and is protected by Malaysian and international copyright laws.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className='animate-fadeIn'>
                <h3 className='text-xl font-bold mb-6 text-[#504C41] border-b pb-2'>Privacy Policy</h3>
                <AccordionItem
                  question="What data do we collect?"
                  answer="We collect information necessary to process your orders, including name, email, shipping address, and payment details."
                />
                <AccordionItem
                  question="How do we protect your data?"
                  answer="Your personal information is encrypted and stored securely. We never share your data with third parties without your consent."
                />
                <AccordionItem
                  question="Can I opt out of marketing emails?"
                  answer="Yes! You can unsubscribe from marketing emails at any time by clicking the unsubscribe link at the bottom of our emails."
                />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Simple Fade In Animation Style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

    </div>
  )
}

export default About