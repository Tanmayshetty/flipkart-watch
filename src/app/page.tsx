import { JSONFilePreset } from 'lowdb/node';

import {
  FlipkartLinks,
  FlipkartProcessed,
  FlipkartProductData,
} from '@/lib/FlipkartProduct.types';

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
  const defaultData = { products: [], flipkarLinksToWatch: [] };
  const db = await JSONFilePreset('src/app/db.json', defaultData);
  const {
    products,
    flipkarLinksToWatch,
  }: { products: FlipkartProductData[]; flipkarLinksToWatch: FlipkartLinks[] } =
    db.data;
  const processedData: FlipkartProcessed = products.reduce(
    (acc: FlipkartProcessed, product: FlipkartProductData) => {
      const { url } = product;
      (acc[url] = acc[url] || []).push(product);
      return acc;
    },
    {}
  );
  return (
    <main>
      <section className='bg-white py-2'>
        <FlipkartChart
          data={processedData}
          flipkartLinksToWatch={flipkarLinksToWatch}
        />
      </section>
      <section className='fixed bottom-1/2 left-2'>
        <AddNewProduct />
      </section>
      <RefreshProducts />
    </main>
  );
}
