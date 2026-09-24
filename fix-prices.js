const fs = require('fs');
let dataStore = fs.readFileSync('src/lib/data-store.ts', 'utf8');

// Helper to replace values for a product
function updateProduct(handle, newPrice, newCompare) {
  const regex = new RegExp(`("${handle}": \\{[\\s\\S]*?\\})`, 'g');
  dataStore = dataStore.replace(regex, (match) => {
    let replaced = match
      .replace(/"price":\d+/g, `"price":${newPrice}`)
      .replace(/"price_min":\d+/g, `"price_min":${newPrice}`)
      .replace(/"price_max":\d+/g, `"price_max":${newPrice}`)
      .replace(/"compare_at_price":\d+/g, `"compare_at_price":${newCompare}`)
      .replace(/"compare_at_price_min":\d+/g, `"compare_at_price_min":${newCompare}`)
      .replace(/"compare_at_price_max":\d+/g, `"compare_at_price_max":${newCompare}`);
    return replaced;
  });
}

// 1L
updateProduct('pure-desi-cow-ghee-1-litre', 125000, 250000);
// 2.5L
updateProduct('pure-desi-cow-ghee-2-5-litre', 295000, 625000);
// 5L
updateProduct('pure-desi-cow-ghee-5-litre', 550000, 1250000);

fs.writeFileSync('src/lib/data-store.ts', dataStore);
console.log('Prices updated');
