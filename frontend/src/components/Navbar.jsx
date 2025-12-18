import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import {Link, NavLink} from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

  const [visible, setVisible] = useState(false);

  const { getCartCount } = useContext(ShopContext);

  return (
    
    <div className='flex items-center justify-between py-5 font-medium'>

        <Link to='/'>
        <img src={assets.logo} className='w-36' alt="Logo"/>
        </Link>  

        <ul className='hidden sm:flex gap-5 text-sm text-[504C41]'>
            <NavLink to='/' className='flex flex-col items-center gap-1 cursor-pointer'>
                <p>Home</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-[#D0A823] hidden'/>
            </NavLink>
            <NavLink to='/collection' className='flex flex-col items-center gap-1 cursor-pointer'>
                <p>Collection</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-[#D0A823] hidden'/>
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1 cursor-pointer'>
                <p>About</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-[#D0A823] hidden'/>
            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1 cursor-pointer'>
                <p>Contact</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-[#D0A823] hidden'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-6'>
            <img src={assets.search_icon} className='w-5 h-5 cursor-pointer' alt="Search" />

            <div className='group relative'>
                <img src={assets.profile_icon} className='w-5 h-5 cursor-pointer' alt="Profile" />
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                        <p className='cursor-pointer hover:text-black'>My Profile</p>
                        <p className='cursor-pointer hover:text-black'>Orders</p>
                        <p className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>
            </div>
            <Link to='/cart' className='relative'>
                <img src={assets.cart_icon} className='w-5 min-w-5 h-5 min-h-5 cursor-pointer' alt="Cart" />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#D0A823] text-black aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>
            <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 h-5 cursor-pointer sm:hidden' alt="Menu" />
        </div>

        {/* Mobile Menu */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col text-black'>
                <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img className='h-5 rotate-180' src={assets.close_icon} alt="close"/>
                    <p>Back</p>
                </div>
                <NavLink onClick={()=>setVisible} className='py-2 pl-6 border border-[#D0A823]' to='/'>Home</NavLink>
                <NavLink onClick={()=>setVisible} className='py-2 pl-6 border border-[#D0A823]' to='/collection'>Collection</NavLink>
                <NavLink onClick={()=>setVisible} className='py-2 pl-6 border border-[#D0A823]' to='/about'>About</NavLink>
                <NavLink onClick={()=>setVisible} className='py-2 pl-6 border border-[#D0A823]' to='/contact'>Contact</NavLink>
            </div>
        </div>
    </div>
  )
}

export default Navbar
