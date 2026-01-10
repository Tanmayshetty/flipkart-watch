import { FlipkartProductData } from '@/lib/FlipkartProduct.types';

import { pool } from '@/app/api/db';

export async function GET() {
  const productPricesResult = await pool.query({
    text: `SELECT products.product_id,price,date,type,price_notify,url,header,sold_out,should_notify,header
FROM products INNER JOIN history ON products.product_id = history.product_id order by history.date`,
  });
  let productPrices: FlipkartProductData[] = productPricesResult.rows.reduce(
    (productList, productPrice) => {
      let isNew = false;
      let product = productList.find(
        (produ) => produ.productId === productPrice.product_id
      );
      if (!product) {
        product = {};
        isNew = true;
      }
      (product.history ??= []).push({
        price: productPrice.price,
        date: productPrice.date.toLocaleDateString(),
        shouldNotify: productPrice.should_notify,
      });

      product.currentPrice = productPrice.price;
      product.shouldNotify = productPrice.should_notify;
      if (isNew) {
        product = {
          ...product,
          ecommName: productPrice.ecomm_name,
          url: productPrice.url,
          type: productPrice.type,
          priceNotify: productPrice.price_notify,
          productId: productPrice.product_id,
          isSoldOut: productPrice.isSoldOut,
          header: productPrice.header,
        };
        productList.push(product);
      }
      return productList;
    },
    []
  );
  productPrices = productPrices.map((product) => {
    const lowestPrice = Math.min(...product.history.map((hist) => hist.price));
    return { ...product, lowestPrice };
  });
  return Response.json({ products: productPrices });
}
