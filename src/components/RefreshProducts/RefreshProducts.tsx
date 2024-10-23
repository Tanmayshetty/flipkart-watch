'use client';

import { useState } from 'react';

const RefreshProducts = () => {
  const [refreshActive, setRefreshActive] = useState(false);
  const refreshHandler = (event: React.FormEvent<EventTarget>) => {
    if (!refreshActive) {
      setRefreshActive(true);
      event.preventDefault();
      fetch('/api/updateProductPrices');
    }
    setTimeout(() => {
      setRefreshActive(false);
      location.reload();
    }, 30000);
  };
  return (
    <section className='fixed bottom-1/3 left-2'>
      <a
        href='#_'
        onClick={refreshHandler}
        className='relative rounded px-5 py-2.5 overflow-hidden group bg-red-300 hover:bg-gradient-to-r hover:from-red-500 text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300'
      >
        <svg
          className='h-4 w-4 text-red-500 inline-block'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          strokeWidth='2'
          stroke='currentColor'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {' '}
          <path stroke='none' d='M0 0h24v24H0z' />{' '}
          <path d='M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5' />{' '}
          <path d='M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5' />
        </svg>
      </a>
    </section>
  );
};

export default RefreshProducts;
