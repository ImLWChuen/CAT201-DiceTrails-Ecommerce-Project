import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible,setVisible] = useState(false);
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    },[location])

  return showSearch && visible ?  (
    <div className='border-t bg-[#FEED9F] text-center'>
        <div className='inline-flex items-center justify-center border border-[#D0a823] px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 bg-white'>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type="text" placeholder='Search'/>
                <img className='w-4' src={assets.search_icon} alt="search_icon"/>
        </div>
        <img onClick={()=>setShowSearch(false)} className='inline w-5 cursor-pointer' src={assets.close_icon} alt="close_icon" />
    </div>
  ) : null
}

export default SearchBar
