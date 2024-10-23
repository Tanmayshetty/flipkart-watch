import { JSONFilePreset } from 'lowdb/node';

const defaultData = { products: [], flipkarLinksToWatch: [] };
export async function POST(request: Request) {
  const res = await request.json();
  res.priceNotify = Number(res.priceNotify);
  const db = await JSONFilePreset('src/app/db.json', defaultData);
  await db.update(({ flipkarLinksToWatch }) => flipkarLinksToWatch.push(res));
  return Response.json({ res });
}
