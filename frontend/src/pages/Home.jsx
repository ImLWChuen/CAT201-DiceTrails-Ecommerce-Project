import React from 'react'
import Hero from '../components/Hero'
import LatestCatalogue from '../components/LatestCatalogue'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div>
        <Hero />
        <LatestCatalogue />
        <BestSeller />
        <OurPolicy />
        <NewsletterBox />
    </div>
  )
}

export default Home
