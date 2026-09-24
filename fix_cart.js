const fs = require('fs');

let cartContent = fs.readFileSync('src/components/cart/CartDrawer.tsx', 'utf8');

// We will remove the Upsell block
const upsellStart = "{/* Upsell */}";
const footerStart = "{/* Footer */}";

const upsellRegex = new RegExp(upsellStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?(?=' + footerStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'g');
cartContent = cartContent.replace(upsellRegex, '');

fs.writeFileSync('src/components/cart/CartDrawer.tsx', cartContent);
