import React, { useContext, useState } from 'react'
import loginBg from '../assets/Login_SignUp Page BG.jpg'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');
  const { login, signup } = useContext(ShopContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (currentState === 'Login') {
        await login(email, password);
      } else {
        if (!agreeToTerms) {
          alert('Please agree to the terms and conditions and privacy policy');
          return;
        }
        await signup(username, email, password);
      }
    } finally {
      setIsLoading(false);
    }
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
        {currentState === 'Login' ? '' : <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        {currentState === 'Sign Up' && (
          <div className='w-full flex items-start gap-2 text-sm mt-2'>
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className='mt-1 cursor-pointer'
            />
            <label htmlFor="terms" className='cursor-pointer'>
              I agree to the <Link to='/about#privacy' className='text-blue-600 hover:underline'>Terms & Conditions</Link> and <Link to='/about#privacy' className='text-blue-600 hover:underline'>Privacy Policy</Link>
            </label>
          </div>
        )}

        <div className='w-full flex justify-between text-sm mt-[8px]'>
          <p className='cursor-pointer'>Forgot you password?</p>
          {
            currentState === 'Login'
              ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
              : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
          }
        </div>
        <button
          disabled={isLoading}
          className={`font-light px-8 py-2 mt-4 ${isLoading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-black text-white'}`}
        >
          {isLoading ? 'Please wait...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
        </button>
      </form>
    </div>
  )
}

export default Login
