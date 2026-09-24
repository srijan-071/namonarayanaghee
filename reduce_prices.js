const fs = require('fs');

// 1. Update data-store.ts
let dataStore = fs.readFileSync('src/lib/data-store.ts', 'utf8');

// The file contains lines like:
// "price":15000, "price_min":15000, "price_max":15000
// "variants":[{"price":15000, ...}]

const applyDiscount = (match, prefix, priceStr, suffix) => {
  const oldPrice = parseInt(priceStr, 10);
  if (oldPrice === 0) return match;
  const newPrice = Math.round(oldPrice * 0.7);
  return `${prefix}${newPrice}${suffix}`;
};

dataStore = dataStore.replace(/("price"\s*:\s*)(\d+)([,}])/g, applyDiscount);
dataStore = dataStore.replace(/("price_min"\s*:\s*)(\d+)([,}])/g, applyDiscount);
dataStore = dataStore.replace(/("price_max"\s*:\s*)(\d+)([,}])/g, applyDiscount);
dataStore = dataStore.replace(/("compare_at_price"\s*:\s*)(\d+)([,}])/g, (match, prefix, priceStr, suffix) => {
  // If it's the original compare_at_price, maybe don't reduce it? 
  // Reducing compare_at_price makes it look like the MRP also dropped. 
  // Let's NOT reduce compare_at_price, to show a bigger discount! 
  // Actually, wait, the instruction is "reduce prices by 30% on all procuts".
  // If we don't reduce compare_at_price, the discount shown will increase. That's usually what people want.
  // I will only reduce "price".
  return match;
});

fs.writeFileSync('src/lib/data-store.ts', dataStore);


// 2. Update Bestsellers.tsx
let bestsellers = fs.readFileSync('src/components/home/Bestsellers.tsx', 'utf8');

bestsellers = bestsellers.replace(/(price:\s*)(\d+)(,)/g, applyDiscount);

fs.writeFileSync('src/components/home/Bestsellers.tsx', bestsellers);

console.log("Prices reduced by 30% successfully.");
