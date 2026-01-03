import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className='flex gap-2 text-sm text-gray-600 mb-6 flex-wrap'>
            {items.map((item, idx) => (
                <React.Fragment key={idx}>
                    {idx > 0 && <span className='text-gray-400'>/</span>}
                    {item.path ? (
                        <Link
                            to={item.path}
                            className='hover:text-[#D0A823] transition-colors hover:underline'
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className='text-gray-800 font-medium'>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumbs;
