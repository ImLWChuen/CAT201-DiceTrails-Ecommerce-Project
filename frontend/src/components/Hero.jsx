import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 bg-[#FEED9F]'>
        {/* Left Side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className="text-[#504c41]">
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#D0A823]'></p>
                    <p className='font-medium texture-sm md:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='montserrat-bold text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[2px] bg-[#D0A823]'></p>
                </div>
            </div>
        </div>
        {/* Right Side */}
        <img className='w-full sm:w-1/2' src={assets.hero_img} alt="Hero Image" />
    </div>
  )
}

export default Hero
