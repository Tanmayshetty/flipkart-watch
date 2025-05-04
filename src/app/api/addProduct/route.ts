import { JSONFilePreset } from 'lowdb/node';

import { FlipkartLinks } from '@/lib/FlipkartProduct.types';

const defaultData = { products: [], flipkarLinksToWatch: [] };
export async function POST(request: Request) {
  const res: FlipkartLinks = await request.json();
  res.priceNotify = Number(res.priceNotify);
  const db = await JSONFilePreset('src/app/db.json', defaultData);
  const { flipkarLinksToWatch }: { flipkarLinksToWatch: FlipkartLinks[] } =
    db.data;
  if (!flipkarLinksToWatch.some((link) => link.url === res.url)) {
    await db.update(
      ({ flipkarLinksToWatch }: { flipkarLinksToWatch: FlipkartLinks[] }) =>
        flipkarLinksToWatch.push(res)
    );
  }
  return Response.json({ res });
}
