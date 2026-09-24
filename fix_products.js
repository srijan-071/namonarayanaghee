const fs = require('fs');

let content = fs.readFileSync('src/lib/data-store.ts', 'utf8');

const productsToUpdate = [
  { handle: 'besan', price: 15000, compare: 18000 },
  { handle: 'black-mustard-oil', price: 30000, compare: 35000 },
  { handle: 'coconut-oil', price: 40000, compare: 45000 },
  { handle: 'honey', price: 45000, compare: 50000 },
  { handle: 'jaggery-powder', price: 20000, compare: 25000 },
  { handle: 'khapli-atta', price: 25000, compare: 30000 },
  { handle: 'multi-grain-atta', price: 18000, compare: 22000 },
  { handle: 'pickle', price: 22000, compare: 26000 }
];

for (const p of productsToUpdate) {
  // Regex to find the object key and the beginning of the object
  const regex = new RegExp(`("${p.handle}":\\s*\\{.*?)("price":0|"available":false)(.*?"price":0)?`, 'g');
  
  // Actually, since the file is just one line per product, let's process line by line
}
