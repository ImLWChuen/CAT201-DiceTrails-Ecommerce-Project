import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, logout, navigate } = useContext(ShopContext);

    if (!user) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
                <p className='text-2xl font-medium text-[#504C41]'>Please login to view your profile</p>
                <button
                    onClick={() => navigate('/login')}
                    className='bg-[#D0A823] text-black px-8 py-2 rounded-sm font-medium hover:bg-[#b8951f] transition-all'
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl mb-10'>
                <div className='flex items-center gap-2 mb-8'>
                    <p className='text-[#504c41] text-3xl font-medium uppercase'>MY PROFILE</p>
                    <p className='w-12 h-[2px] bg-[#D0A823]'></p>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-10 bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
                {/* Left Section: User Info Card */}
                <div className='md:col-span-1 flex flex-col items-center p-6 border-r border-gray-100'>
                    <div className='w-32 h-32 bg-[#FEED9F] rounded-full flex items-center justify-center text-[#D0A823] text-5xl font-bold mb-4 border-2 border-[#D0A823] capitalize'>
                        {user.username ? user.username[0] : (user.email ? user.email[0] : 'U')}
                    </div>
                    <h2 className='text-2xl font-bold text-[#504C41] capitalize'>{user.username || 'User'}</h2>
                    <p className='text-gray-500 mb-6'>{user.email}</p>
                    <button
                        onClick={logout}
                        className='w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 transition-all font-medium text-sm'
                    >
                        LOGOUT
                    </button>
                </div>

                {/* Right Section: Account Details & Settings */}
                <div className='md:col-span-2 flex flex-col gap-8'>
                    <section>
                        <h3 className='text-lg font-bold text-[#504C41] border-b pb-2 mb-4 uppercase flex items-center gap-2'>
                            Account Details
                            <span className='text-xs font-normal text-gray-400'>(Synced from Server)</span>
                        </h3>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-xs text-gray-400 font-bold uppercase'>User ID</span>
                                <span className='text-[#504C41] font-mono'>{user.userId || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-xs text-gray-400 font-bold uppercase'>Account Status</span>
                                <span className='text-green-600 font-medium flex items-center gap-1 text-sm italic underline decoration-green-300'>
                                    <span className='w-2 h-2 rounded-full bg-green-500'></span> Active
                                </span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-xs text-gray-400 font-bold uppercase'>Email Address</span>
                                <span className='text-[#504C41]'>{user.email}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-xs text-gray-400 font-bold uppercase'>Name</span>
                                <span className='text-[#504C41]'>{user.username}</span>
                            </div>
                        </div>
                    </section>

                    <section className='mt-4'>
                        <h3 className='text-lg font-bold text-[#504C41] border-b pb-2 mb-4 uppercase'>Quick Links</h3>
                        <div className='flex flex-wrap gap-4'>
                            <button
                                onClick={() => navigate('/orders')}
                                className='bg-[#FEED9F] text-[#504C41] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#D0A823] transition-all'
                            >
                                View Orders
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className='bg-gray-100 text-[#504C41] px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-all'
                            >
                                Edit Cart
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
