const fs = require('fs');
const content = fs.readFileSync('src/lib/data-store.ts', 'utf8');

const regex = /export const RAW_PRODUCTS: Record<string, any> = {([\s\S]*?)};\n\nexport const RAW_COLLECTIONS/m;
const match = content.match(regex);
if (match) {
  const productsStr = '{' + match[1] + '}';
  // we can't parse it easily because it's not strict JSON
  // let's just get the keys
  const keys = Array.from(match[1].matchAll(/^  "([^"]+)":/gm)).map(m => m[1]);
  console.log(keys);
} else {
  console.log("No match");
}
