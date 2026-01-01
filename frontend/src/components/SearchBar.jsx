import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch, products, navigate } = useContext(ShopContext);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (search && showSearch) {
            const filtered = products
                .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
                .slice(0, 3);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [search, showSearch, products]);

    return showSearch ? (
        <div className='absolute right-full mr-2 top-1/2 -translate-y-1/2 flex items-center border border-[#D0a823] px-3 py-1.5 rounded-full bg-white w-40 sm:w-64 transition-all duration-300 shadow-sm'>
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='flex-1 outline-none bg-inherit text-xs sm:text-sm'
                type="text"
                placeholder='Search'
            />
            <img className='w-3.5 cursor-pointer' src={assets.search_icon} alt="search_icon" />

            {/* Suggestions Dropdown */}
            {search && suggestions.length > 0 && (
                <div className='absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-[#D0a823] rounded-md shadow-lg z-50 text-left overflow-hidden min-w-[200px]'>
                    {suggestions.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => {
                                setSearch(item.name);
                                setSuggestions([]);
                                setShowSearch(false);
                                navigate(`/product/${item._id}`);
                            }}
                            className='px-3 py-2 hover:bg-[#FEED9F] cursor-pointer text-xs sm:text-sm flex items-center gap-3 border-b last:border-b-0 border-gray-100'
                        >
                            <img src={item.image[0]} className='w-6 h-6 object-cover rounded' alt="" />
                            <span className='truncate font-medium text-[#504C41]'>{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null
}

export default SearchBar
