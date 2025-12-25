import React, { useState } from 'react'
import loginBg from '../assets/Login_SignUp Page BG.jpg'

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');

  const onSubmitHandler = async () => {
    event.preventDefault();
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <img
        src={loginBg}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Background"
      />
      <form onSubmit={onSubmitHandler} className='relative z-10 flex flex-col items-center w-[90%] sm:max-w-96 m-qauto gap-4 text-gray-800 bg-white/80 p-8 rounded-lg shadow-lg'>
        <div className='inline-flex items-center gap-2 mb-2'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          {/*<hr className='border-none h-[1.5px] w-8 bg-gray-800'/>*/}
        </div>
        {currentState === 'Login' ? ' ' : <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
        <div className='w-full flex justify-between text-sm mt-[8px]'>
          <p className='cursor-pointer'>Forgot you password?</p>
          {
            currentState === 'Login'
              ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
              : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
          }
        </div>
        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
      </form>
    </div>
  )
}

export default Login
