import * as cheerio from 'cheerio';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

// Read or create db.json
const defaultData = { products: [], flipkarLinksToWatch: [] };
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const db = await JSONFilePreset(__dirname + '/src/app/db.json', defaultData);
const { flipkarLinksToWatch } = db.data;

const utcDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const browser = await puppeteer.launch({ headless: true });
let linkIndexCount = 0;
const todaysProduct = [];
console.log('flipkarLinksToWatch : ', flipkarLinksToWatch.length);
flipkarLinksToWatch.forEach(async ({ url, type, priceNotify }) => {
  const page = await browser.newPage();
  await page.goto(url.trim());
  const flipkartHTML = await page.content({ waitUntil: 'domcontentloaded' });

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
        flipkartCheerioLoad(e).text().trim().startsWith('₹') &&
        !flipkartCheerioLoad(e).text().trim().includes('month')
    )
    .map((e) => flipkartCheerioLoad(e).text().trim());
  const soldOutResult = contentDiv
    .filter(
      (e) =>
        e.type === 'text' &&
        flipkartCheerioLoad(e).text().trim().startsWith('Sold')
    )
    .map((e) => flipkartCheerioLoad(e).text().trim());

  const linkIndex = db.data.flipkarLinksToWatch.findIndex(
    (links) => links.url === url
  );
  if (!result[0] || soldOutResult[0]) {
    if (soldOutResult[0]) {
      await db.update(
        ({ flipkarLinksToWatch }) =>
        (flipkarLinksToWatch[linkIndex] = {
          ...flipkarLinksToWatch[linkIndex],
          soldOut: true,
        })
      );
    }
    linkIndexCount += 1;
    return;
  } else if (flipkarLinksToWatch[linkIndex].soldOut) {
    await db.update(
      ({ flipkarLinksToWatch }) =>
      (flipkarLinksToWatch[linkIndex] = {
        ...flipkarLinksToWatch[linkIndex],
        soldOut: undefined,
      })
    );
  }
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
    await db.update(({ products }) => {
      productsUpdate = {
        price,
        date: utcDate,
        type,
        priceNotify,
        url,
        header: productTextDiv[0],
        shouldNotify,
      };
      products.push(productsUpdate);
    });
  }
  if (shouldNotify) {
    todaysProduct.push(productsUpdate);
  }
  await sleep(5000);
  linkIndexCount += 1;
  try {
    if (linkIndexCount === flipkarLinksToWatch.length) {
      await browser.close();
      console.log('todaysProduct : ', todaysProduct);
    }
  } catch (err) {
    console.error('Error during close ', err);
  }
});

await db.write();
