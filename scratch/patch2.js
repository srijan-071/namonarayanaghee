const fs = require('fs');
const p = '/Users/mayank/Developer/potter-world/app/api/payment/session/route.ts';
let code = fs.readFileSync(p, 'utf8');
code = code.replace(
  "if (secret && authHeader !== `Bearer ${secret}`) {\n      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n    }",
  "// auth layer disabled as per user request"
);
fs.writeFileSync(p, code);
