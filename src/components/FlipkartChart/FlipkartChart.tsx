'use client';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  FlipkartLinks,
  FlipkartProcessed,
  FlipkartProductData,
} from '@/lib/FlipkartProduct.types';

const FlipkartChart = ({
  data,
  flipkartLinksToWatch,
}: {
  data: FlipkartProcessed;
  flipkartLinksToWatch: FlipkartLinks[];
}) => {
  const urls = Object.keys(data);
  const typeSet = new Set(flipkartLinksToWatch.map((links) => links.type));
  const [filterType, setFilterType] = useState('All');
  const onFilterChange = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setFilterType(value);
  };
  return (
    <>
      <div className='join flex w-full mx-auto justify-start flex-wrap px-2'>
        <input
          className='join-item btn w-32 !bg-none'
          type='radio'
          name='options'
          aria-label='All'
          value='All'
          onChange={onFilterChange}
        />
        {Array.from(typeSet).map((type) => {
          return (
            <input
              className='join-item btn w-48 !bg-none'
              type='radio'
              name='options'
              aria-label={type}
              value={type}
              onChange={onFilterChange}
              key={type}
            />
          );
        })}
      </div>
      <div className='flex flex-wrap'>
        {urls.map((url) => {
          const product = data[url].reduce(
            (acc: FlipkartProductData[], product: FlipkartProductData) => {
              const isOldDiff = parseInt(
                (new Date() - new Date(product.date)) / (1000 * 60 * 60 * 24),
                10
              );
              if (isOldDiff > 60) {
                return acc;
              }
              return [...acc, product];
            },
            []
          );
          const lastProductIndex = product.length - 1;
          if (product.length === 0) {
            return null;
          }
          const showNotif =
            product[lastProductIndex].priceNotify >
            product[lastProductIndex].price;
          const bottomPrice = showNotif
            ? product[lastProductIndex].price
            : product[lastProductIndex].priceNotify;
          const { soldOut } = flipkartLinksToWatch.find(
            (link) => link.url === url
          ) ?? { soldOut: false };
          const lowestPrice = data[url].reduce((prev, curr) => {
            return prev.price < curr.price ? prev : curr;
          });
          if (soldOut) {
            return null;
          }
          if (filterType !== 'All' && filterType !== product[0].type) {
            return null;
          }
          return (
            <div className='w-1/2 h-96 pt-4 pb-28' key={url}>
              <span className='flex w-full pl-6'>
                URL:{' '}
                <a href={url} className='pl-1'>
                  {product[0].header}
                </a>
              </span>

              <span key={url} className='flex w-full pl-6 pb-4'>
                Price Notify: {product[lastProductIndex].priceNotify}
                <span className='pl-2'>
                  Current Price: {product[product.length - 1].price}
                </span>
                <span className='pl-2'>Lowest Price: {lowestPrice.price}</span>
                <span className='pl-2 text-red-500'>{product[0].type}</span>
                {soldOut && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6 pl-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636'
                    />
                  </svg>
                )}
                {showNotif && (
                  <button className='inline-block relative'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-gray-700'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                      />
                    </svg>
                    <span className='animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-400 bg-green-600'></span>
                  </button>
                )}
              </span>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  width={500}
                  height={300}
                  data={product}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis domain={[bottomPrice - 200, 'dataMax + 200']} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='price'
                    stroke='#8884d8'
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FlipkartChart;
