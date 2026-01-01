import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Catalogue = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (SubCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    if (!products) return;
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (SubCategory.length > 0) {
      productsCopy = productsCopy.filter(item => SubCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, SubCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Option*/}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex ietms-center cursor-pointer gap-2 font-bold'>FILTERS
          <img className={`h-7 sm:hidden ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="dropdown_icon" />
        </p>
        {/* Category Filter*/}
        <div className={`border rounded-md border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-bold'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'board games'} onChange={toggleCategory} /> Board Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'card games'} onChange={toggleCategory} /> Card Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'accessories'} onChange={toggleCategory} /> Accessories
            </p>

          </div>
        </div>
        {/* SubCategory Filter*/}
        <div className={`border rounded-md border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-bold'>GAME TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'strategy'} onChange={toggleSubCategory} /> Strategy Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'family'} onChange={toggleSubCategory} /> Family Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'party'} onChange={toggleSubCategory} /> Party Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'abstract'} onChange={toggleSubCategory} /> Abstract Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'word'} onChange={toggleSubCategory} /> Word Games
            </p>
            <p className='flex gap-2 font-medium'>
              <input className='w-3' type="checkbox" value={'mystery'} onChange={toggleSubCategory} /> Mystery Games
            </p>

          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'CATALOGUE'} />
          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border rounded-md border-[#d0a823] text-sm px-2'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.length === 0 ? (
            <div className='col-span-full text-center py-20'>
              <p className='text-2xl text-gray-500 mb-2'>No products found</p>
              {search && (
                <p className='text-gray-400'>
                  No results for "<span className='font-semibold'>{search}</span>"
                </p>
              )}
            </div>
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} quantity={item.quantity} />
            ))
          )}

        </div>

      </div>

    </div>
  )
}

export default Catalogue
