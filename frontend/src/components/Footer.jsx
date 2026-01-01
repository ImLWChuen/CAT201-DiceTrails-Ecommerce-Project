import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div>
            <hr className='mt-20' />
            <div className='grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-7 text-sm '>

                <div>
                    <img src={assets.logo} className='mb-5 w-32' alt="logo" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        DiceTrails is your destination for premium board games, card games, and gaming accessories. We curate the best selection of games for families, strategy enthusiasts, and party lovers. Roll the dice and embark on your next gaming adventure with us!
                    </p>
                </div>
                <div>
                    <p className='text-xl font-bold mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li><Link to='/' className='hover:text-[#D0A823] transition-colors'>Home</Link></li>
                        <li><Link to='/about' className='hover:text-[#D0A823] transition-colors'>About Us</Link></li>
                        <li><Link to='/about#delivery' className='hover:text-[#D0A823] transition-colors'>Delivery</Link></li>
                        <li><Link to='/about#privacy' className='hover:text-[#D0A823] transition-colors'>Privacy Policy</Link></li>
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
                <hr />
                <p className='py-5 text-sm text-center'>Copyright {new Date().getFullYear()}@ dicetrails.com - All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer
