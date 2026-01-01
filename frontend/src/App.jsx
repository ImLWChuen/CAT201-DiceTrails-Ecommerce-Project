import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Hero from './components/Hero'
import Footer from './components/footer'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <>
      <Routes>
        {/* Admin Dashboard (no navbar/footer) */}
        <Route path='/admin' element={<AdminDashboard />} />
        
        {/* Main App with navbar and footer */}
        <Route path='*' element={
          <div className='px-4 sm:px-[5vw] md:px-[7vw] lp:px-[9vw]'>
            <ToastContainer />
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/catalogue' element={<Catalogue />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/product/:productId' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/login' element={<Login />} />
              <Route path='/place-order' element={<PlaceOrder />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  )
}

export default App
