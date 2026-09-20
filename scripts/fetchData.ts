import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const BASE_URL = 'https://namonarayana.com';

const PRODUCTS = [
  'yellow-mustard-oil',
  'coconut-oil',
  'black-mustard-oil',
  'jaggery-powder',
  'honey',
  'multi-grain-atta',
  'rogan-badam-oil',
  'besan',
  'pickle',
  'khapli-atta',
  'pure-desi-cow-ghee-2-5-litre',
  'pure-desi-cow-ghee-5-litre',
  'pure-desi-cow-ghee-1-litre'
];

const COLLECTIONS = [
  'frontpage',
  'organic-oils',
  'pure-ghee-honey',
  'all-products',
  'natural-sweeteners',
  'ghee',
  'oils',
  'honey',
  'flours'
];

const PAGES = [
  'contact',
  'social-media',
  'our-story',
  'farm-to-fork',
  'careers',
  'certifications',
  'about-us',
  'track-order'
];

const BLOG_POSTS = [
  'besan-ke-laddu-recipe-with-a2-ghee',
  'atte-ke-laddu-recipe-with-a2-ghee'
];

const downloadFile = (urlStr: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    let url = urlStr;
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }
    
    // Some urls might have query strings like ?v=...
    const cleanDest = dest.split('?')[0];
    
    if (fs.existsSync(cleanDest)) {
      resolve(); // already downloaded
      return;
    }

    const file = fs.createWriteStream(cleanDest);
    const client = url.startsWith('https') ? https : http;

    client.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 304) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadFile(response.headers.location || '', cleanDest).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(cleanDest, () => {});
        reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(cleanDest, () => {});
      reject(err);
    });
  });
};

const extractSEO = (html: string) => {
  const $ = cheerio.load(html);
  return {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
    ogImage: $('meta[property="og:image"]').attr('content') || '',
  };
};

async function fetchProducts() {
  for (const handle of PRODUCTS) {
    console.log(`Fetching product: ${handle}`);
    try {
      // Fetch JSON
      const jsonRes = await fetch(`${BASE_URL}/products/${handle}.js`);
      if (!jsonRes.ok) continue;
      const productData = await jsonRes.json();
      
      // Download images in productData
      const localImages = [];
      for (const imgUrl of productData.images) {
        const parsedUrl = new URL(imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl);
        const filename = path.basename(parsedUrl.pathname);
        const localPath = `/assets/product_${filename}`;
        await downloadFile(imgUrl, path.join(process.cwd(), 'public', localPath)).catch(e => console.error(e));
        localImages.push(localPath);
      }
      productData.localImages = localImages;

      // Fetch HTML to get SEO and full description HTML
      const htmlRes = await fetch(`${BASE_URL}/products/${handle}`);
      const html = await htmlRes.text();
      const seo = extractSEO(html);
      productData.seo = seo;
      
      fs.writeFileSync(`data/products/${handle}.json`, JSON.stringify(productData, null, 2));
    } catch (e) {
      console.error(`Error fetching product ${handle}`, e);
    }
  }
}

async function fetchCollections() {
  for (const handle of COLLECTIONS) {
    console.log(`Fetching collection: ${handle}`);
    try {
      const htmlRes = await fetch(`${BASE_URL}/collections/${handle}`);
      if (!htmlRes.ok) continue;
      const html = await htmlRes.text();
      
      const seo = extractSEO(html);
      
      // Simple parse of products in collection
      const $ = cheerio.load(html);
      const productHandles: string[] = [];
      $('a[href^="/products/"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href) {
           const h = href.split('/products/')[1].split('?')[0];
           if (h && !productHandles.includes(h)) productHandles.push(h);
        }
      });
      
      const collectionData = { handle, seo, productHandles };
      fs.writeFileSync(`data/collections/${handle}.json`, JSON.stringify(collectionData, null, 2));
    } catch (e) {
      console.error(`Error fetching collection ${handle}`, e);
    }
  }
}

async function fetchPages() {
  for (const handle of PAGES) {
    console.log(`Fetching page: ${handle}`);
    try {
      const htmlRes = await fetch(`${BASE_URL}/pages/${handle}`);
      if (!htmlRes.ok) continue;
      const html = await htmlRes.text();
      
      const seo = extractSEO(html);
      const $ = cheerio.load(html);
      // Extract main content - usually in <main>
      const mainContentHtml = $('main').html() || '';
      
      const pageData = { handle, seo, content: mainContentHtml };
      fs.writeFileSync(`data/pages/${handle}.json`, JSON.stringify(pageData, null, 2));
    } catch (e) {
      console.error(`Error fetching page ${handle}`, e);
    }
  }
}

async function fetchBlogs() {
  for (const handle of BLOG_POSTS) {
    console.log(`Fetching blog: ${handle}`);
    try {
      const htmlRes = await fetch(`${BASE_URL}/blogs/news/${handle}`);
      if (!htmlRes.ok) continue;
      const html = await htmlRes.text();
      
      const seo = extractSEO(html);
      const $ = cheerio.load(html);
      const articleContent = $('article').html() || '';
      
      const blogData = { handle, seo, content: articleContent };
      fs.writeFileSync(`data/blogs/${handle}.json`, JSON.stringify(blogData, null, 2));
    } catch (e) {
      console.error(`Error fetching blog ${handle}`, e);
    }
  }
}

async function main() {
  await fetchProducts();
  await fetchCollections();
  await fetchPages();
  await fetchBlogs();
  console.log('Data fetching complete.');
}

main();
