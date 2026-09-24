const fs = require('fs');
let dataStore = fs.readFileSync('src/lib/data-store.ts', 'utf8');

const nonGhees = [
  'besan', 'black-mustard-oil', 'coconut-oil', 'honey', 'jaggery-powder', 
  'khapli-atta', 'multi-grain-atta', 'pickle', 'rogan-badam-oil', 'yellow-mustard-oil'
];

for (const handle of nonGhees) {
  // Find the block for this product and replace "available":true with "available":false
  const regex = new RegExp(`("${handle}":\\s*\\{.*?)"available":true(.*?)`, 'g');
  dataStore = dataStore.replace(regex, `$1"available":false$2`);
}

fs.writeFileSync('src/lib/data-store.ts', dataStore);
