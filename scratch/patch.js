const fs = require('fs');
const p = '/Users/mayank/Developer/potter-world/app/api/payment/session/route.ts';
let code = fs.readFileSync(p, 'utf8');
code = code.replace(
  "return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });",
  "return NextResponse.json({ error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });"
);
fs.writeFileSync(p, code);
