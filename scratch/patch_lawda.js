const fs = require('fs');
const path = require('path');

const proxyPath = '../lawda-bcc/app/payu-proxy/page.tsx';
let proxyContent = fs.readFileSync(proxyPath, 'utf8');

proxyContent = proxyContent.replace(
  "const phone = searchParams.get('phone');",
  "const phone = searchParams.get('phone');\n  const udf1 = searchParams.get('udf1');"
);

proxyContent = proxyContent.replace(
  "email,\n          })",
  "email,\n            udf1,\n          })"
);

proxyContent = proxyContent.replace(
  "<input type=\"hidden\" name=\"furl\" value=\"https://octopusperfume.in/api/payu/callback\" />\n          <input type=\"hidden\" name=\"hash\" value={hash} />",
  "<input type=\"hidden\" name=\"furl\" value=\"https://octopusperfume.in/api/payu/callback\" />\n          <input type=\"hidden\" name=\"udf1\" value={udf1 || ''} />\n          <input type=\"hidden\" name=\"hash\" value={hash} />"
);

fs.writeFileSync(proxyPath, proxyContent);

const callbackPath = '../lawda-bcc/app/api/payu/callback/route.ts';
let callbackContent = fs.readFileSync(callbackPath, 'utf8');

callbackContent = callbackContent.replace(
  "const error_Message = formData.get('error_Message');",
  "const error_Message = formData.get('error_Message');\n    const udf1 = formData.get('udf1');"
);

callbackContent = callbackContent.replace(
  "const redirectUrl = new URL('https://internshipshub.in/payment/verify-payu');",
  `let redirectUrlStr = 'https://internshipshub.in/payment/verify-payu';
    if (udf1 === 'namonarayanaghee') {
      redirectUrlStr = 'https://namonarayanaghee.store/checkout/success';
    }
    const redirectUrl = new URL(redirectUrlStr);`
);

fs.writeFileSync(callbackPath, callbackContent);

console.log('lawda-bcc patched successfully');
