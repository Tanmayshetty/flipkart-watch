import * as cheerio from 'cheerio';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Read or create db.json
const defaultData = { products: [], flipkarLinksToWatch: [] };
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const db = await JSONFilePreset(__dirname + '/src/app/db.json', defaultData);
const { flipkarLinksToWatch } = db.data;

const utcDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

flipkarLinksToWatch.forEach(async ({ url, type, priceNotify }) => {
  const flipkartLinkFetch = await fetch(url);
  const flipkartHTML = await flipkartLinkFetch.text();
  const flipkartCheerioLoad = cheerio.load(flipkartHTML);
  const contentDiv = [...flipkartCheerioLoad('div').contents()];
  const textDiv = [...flipkartCheerioLoad('h1 span').contents()];
  const productTextDiv = textDiv
    .filter((e) => e.type === 'text')
    .map((e) => flipkartCheerioLoad(e).text());
  const result = contentDiv
    .filter(
      (e) =>
        e.type === 'text' &&
        flipkartCheerioLoad(e).text().trim().startsWith('₹')
    )
    .map((e) => flipkartCheerioLoad(e).text().trim());
  const price = parseInt(result[0].split('₹')[1].replace(',', ''));
  let productsUpdate = db.data.products.find(
    (product) => product.url === url && product.date === utcDate
  );
  const shouldNotify = price < priceNotify;
  if (productsUpdate) {
    productsUpdate = {
      price,
      ...productsUpdate,
      header: productTextDiv[0],
      shouldNotify,
    };
    const productIndex = db.data.products.find(
      (product) => product.url === url && product.date === utcDate
    );
    await db.update(
      ({ products }) => (products[productIndex] = productsUpdate)
    );
  } else {
    await db.update(({ products }) =>
      products.push({
        price,
        date: utcDate,
        type,
        priceNotify,
        url,
        header: productTextDiv[0],
        shouldNotify,
      })
    );
  }
});

await db.write();
