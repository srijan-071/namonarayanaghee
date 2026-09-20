const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');

function readJsonFiles(subDir) {
  const dirPath = path.join(dataDir, subDir);
  if (!fs.existsSync(dirPath)) return [];
  
  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const content = fs.readFileSync(path.join(dirPath, f), 'utf-8');
      return {
        slug: f.replace('.json', ''),
        data: JSON.parse(content)
      };
    });
}

const products = readJsonFiles('products');
const collections = readJsonFiles('collections');
const pages = readJsonFiles('pages');
const blogs = readJsonFiles('blogs');

let out = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.\n\n`;

out += `export const RAW_PRODUCTS: Record<string, any> = {\n`;
products.forEach(p => { out += `  "${p.slug}": ${JSON.stringify(p.data)},\n`; });
out += `};\n\n`;

out += `export const RAW_COLLECTIONS: Record<string, any> = {\n`;
collections.forEach(c => { out += `  "${c.slug}": ${JSON.stringify(c.data)},\n`; });
out += `};\n\n`;

out += `export const RAW_PAGES: Record<string, any> = {\n`;
pages.forEach(p => { out += `  "${p.slug}": ${JSON.stringify(p.data)},\n`; });
out += `};\n\n`;

out += `export const RAW_BLOGS: Record<string, any> = {\n`;
blogs.forEach(b => { out += `  "${b.slug}": ${JSON.stringify(b.data)},\n`; });
out += `};\n\n`;

fs.writeFileSync(path.join(process.cwd(), 'src/lib/data-store.ts'), out);
console.log('Generated data-store.ts');
