const fs = require('fs');
const path = './src/app/checkout/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// The incorrect replacements from before were inside strings.
code = code.replace(
  '{paymentMethod === "prepaid" ? "<CreditCard className="w-4 h-4 inline mr-1" /> Prepaid (10% Discount)" : "<Banknote className="w-4 h-4 inline mr-1" /> Cash on Delivery"}',
  '{paymentMethod === "prepaid" ? <><CreditCard className="w-4 h-4 inline mr-1" /> Prepaid (10% Discount)</> : <><Banknote className="w-4 h-4 inline mr-1" /> Cash on Delivery</>}'
);

code = code.replace(
  '<span><CreditCard className="w-4 h-4 inline mr-1" /> Pay Now Online</span>',
  '<span className="flex items-center"><CreditCard className="w-4 h-4 inline mr-1" /> Pay Now Online</span>'
);

code = code.replace(
  '<span className="text-sm text-[#576B55]"><Truck className="w-4 h-4 inline mr-1" /> Pay on Delivery</span>',
  '<span className="text-sm text-[#576B55] flex items-center"><Truck className="w-4 h-4 inline mr-1" /> Pay on Delivery</span>'
);

code = code.replace(
  '<span className="flex items-center gap-1"><Key className="w-4 h-4 inline mr-1" /> Admin Test Mode</span>',
  '<span className="flex items-center gap-1"><Key className="w-4 h-4 inline mr-1" /> Admin Test Mode</span>'
); // Wait, this one was: <span>🔑 Admin Test Mode</span> -> <span><Key className="w-4 h-4 inline mr-1" /> Admin Test Mode</span>
// Let's just fix it using regex to find the exact line.

fs.writeFileSync(path, code);
