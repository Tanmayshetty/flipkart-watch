import { FlipkartLinks } from '@/lib/FlipkartProduct.types';

import { pool } from '@/app/api/db';

export async function POST(request: Request) {
  const res: FlipkartLinks = await request.json();
  res.priceNotify = Number(res.priceNotify);
  const existsCheck = await pool.query({
    text: 'SELECT * FROM products where url=$1',
    values: [res.url],
  });
  if (existsCheck.rows.length > 0) {
    return Response.json({ res });
  }
  const ecomm_name = res.url.toLowerCase().includes('flipkart')
    ? 'flipkart'
    : 'amazon';
  await pool.query({
    text: 'INSERT INTO products (url, ecomm_name,type ,price_notify,header,sold_out) VALUES ($1, $2, $3,$4,$5,$6)',
    values: [res.url, ecomm_name, res.type, res.priceNotify, res.header, false],
  });
  return Response.json({ res });
}
