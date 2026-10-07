const fs = require('fs');
let code = fs.readFileSync('src/lib/data-store.ts', 'utf-8');

// Find the line for 500ml and replace localImages
code = code.replace(/"localImages":\[\]/g, '"localImages":["https://namonarayana.com/cdn/shop/files/a2-500ml-pack.webp?v=1790665147", "/assets/product_4_jpg_7ae1f462-43e7-4a48-b169-2f632af1e706.webp","/assets/product_IMG-20260728-WA0121_jpg.webp","/assets/product_IMG-20260728-WA0131_jpg_b04570c5-92c7-4348-90a9-11972108ad9b.webp","/assets/product_5_jpg_b47e45c2-a1e1-4cd5-9de3-5f4f689abfd9.webp","/assets/product_2_jpg_955716ab-fc20-478e-b3b3-485f4ad8ffcd.webp","/assets/product_3_jpg_fd2e607e-a84e-4712-9a33-85099d813ec2.webp"]');

fs.writeFileSync('src/lib/data-store.ts', code);
console.log('Fixed data-store.ts');
