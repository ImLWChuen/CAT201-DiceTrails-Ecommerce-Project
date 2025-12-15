import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <hr className='mt-20'/>
        <div className='grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-7 text-sm '>
            
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="logo"/>
                <p className='w-full md:w-2/3 text-gray-600'>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus expedita consequuntur alias officia sequi quaerat ea iure debitis odit culpa amet, recusandae quae ratione aut eos pariatur illo excepturi asperiores?
                </p>
            </div>
            <div>
                <p className='text-xl font-bold mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-bold mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+60 12-345 6789</li>
                    <li>contact@dicetrails.com</li>
                </ul>
            </div>
        </div>

        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025@ dicetrails.com - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer
