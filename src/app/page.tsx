import { FlipkartProductData } from '@/lib/FlipkartProduct.types';

import AddNewProduct from '@/components/AddNewProduct';
import FlipkartChart from '@/components/FlipkartChart/FlipkartChart';
import RefreshProducts from '@/components/RefreshProducts';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default async function HomePage() {
  const fetchPromise = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchAllProducts`,
    { cache: 'no-store' }
  );
  const db = await fetchPromise.json();
  const { products }: { products: FlipkartProductData[] } = db;
  return (
    <main>
      <section className='dark:bg-black bg-white py-2'>
        <FlipkartChart data={products} />
      </section>
      <section className='fixed bottom-1/2 left-2'>
        <AddNewProduct />
      </section>
      <RefreshProducts />
    </main>
  );
}
