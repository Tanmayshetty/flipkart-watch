'use client';
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

import { FlipkartLinks, FlipkartProcessed } from '@/lib/FlipkartProduct.types';

const FlipkartChart = ({
  data,
  flipkartLinksToWatch,
}: {
  data: FlipkartProcessed;
  flipkartLinksToWatch: FlipkartLinks[];
}) => {
  const urls = Object.keys(data);
  const typeSet = new Set(flipkartLinksToWatch.map((links) => links.type));
  return (
    <>
      <div className='join flex w-full mx-auto justify-center'>
        <input
          className='join-item btn w-32'
          type='radio'
          name='options'
          aria-label='All'
        />
        {Array.from(typeSet).map((type) => {
          return (
            <input
              className='join-item btn w-32'
              type='radio'
              name='options'
              aria-label={type}
              key={type}
            />
          );
        })}
      </div>
      <div className='flex flex-wrap'>
        {urls.map((url) => {
          const product = data[url];
          const lastProductIndex = product.length - 1;
          const showNotif =
            product[lastProductIndex].priceNotify >
            product[lastProductIndex].price;
          return (
            <div className='w-1/2 h-96 pt-2 pb-24' key={url}>
              <span className='flex w-full pl-6'>
                URL:{' '}
                <a href={url} className='pl-1'>
                  {product[0].header}
                </a>
              </span>

              <span key={url} className='flex w-full pl-6 pb-4'>
                Price Notify: {product[0].priceNotify}
                <span className='pl-2'>
                  Current Price: {product[product.length - 1].price}
                </span>
                <span className='pl-2 text-red-500'>{product[0].type}</span>
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
                  <YAxis
                    domain={[product[0].priceNotify - 100, 'dataMax + 200']}
                  />
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
