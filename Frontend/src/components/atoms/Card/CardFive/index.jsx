import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';

const CardFive = () => {
  return (
    <Link
      to='/overtime'
      className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition hover:border-primary hover:shadow-md dark:border-strokedark dark:bg-boxdark'
    >
      <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
        <FaRegClock className='text-xl text-primary dark:text-white' />
      </div>

      <div className='mt-4 flex items-end justify-between'>
        <div>
          <h4 className='text-title-md font-bold text-black dark:text-white'>
            Form
          </h4>
          <span className='text-sm font-medium'>Overtime</span>
        </div>
      </div>
    </Link>
  )
}

export default CardFive;
