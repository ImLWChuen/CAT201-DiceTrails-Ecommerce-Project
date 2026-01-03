import React, { useState } from 'react'
import loginBg from '../assets/Login_SignUp Page BG.jpg'

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Hardcoded credentials for admin access
    if (username === 'admin' && password === 'admin123') {
      setError('')
      localStorage.setItem('adminAuthenticated', 'true')
      onLoginSuccess()
    } else {
      setError('Invalid username or password')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <img
        src={loginBg}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Background"
      />
      <form onSubmit={handleLogin} className='relative z-10 flex flex-col items-center w-[90%] sm:max-w-96 gap-6 text-gray-800 bg-white/90 p-8 rounded-lg shadow-lg'>
        <div className='text-center'>
          <p className='prata-regular text-4xl text-[#504C41] mb-2'>Admin Portal</p>
          <p className='text-gray-600 text-sm'>DiceTrails Management</p>
        </div>

        {error && (
          <div className='w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        )}

        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
          className='w-full px-4 py-2 border border-gray-800 rounded focus:outline-none focus:border-[#D0A823]'
          placeholder='Username'
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className='w-full px-4 py-2 border border-gray-800 rounded focus:outline-none focus:border-[#D0A823]'
          placeholder='Password'
          required
        />

        <button type='submit' className='w-full bg-[#D0A823] text-black font-bold px-8 py-2 rounded hover:bg-[#b8921d] transition-colors'>
          Login to Dashboard
        </button>

        <p className='text-xs text-gray-500 mt-2'>
          Demo: admin / admin123
        </p>
      </form>
    </div>
  )
}

export default AdminLogin
