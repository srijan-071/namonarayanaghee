const fs = require('fs');

let bestsellers = fs.readFileSync('src/components/home/Bestsellers.tsx', 'utf8');

const applyDiscount = (match, prefix, priceStr, suffix) => {
  const oldPrice = parseInt(priceStr, 10);
  if (oldPrice === 0) return match;
  const newPrice = Math.round(oldPrice * 0.7);
  return `${prefix}${newPrice}${suffix}`;
};

bestsellers = bestsellers.replace(/(price:\s*)(\d+)(,)/g, applyDiscount);

fs.writeFileSync('src/components/home/Bestsellers.tsx', bestsellers);
