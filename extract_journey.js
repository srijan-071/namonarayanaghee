const fs = require('fs');
const https = require('https');

https.get('https://namonarayana.com/products/pure-a2-gir-cow-ghee-500-ml', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const sectionMatch = data.match(/<section id="shopify-section-template[^>]*>.*?<\/section>/gs);
    if (!sectionMatch) return console.log("No sections found");
    
    // Find the one with Farm to Home
    const targetSection = sectionMatch.find(s => s.includes("Farm to Home"));
    if (!targetSection) return console.log("Farm to Home not found");
    
    fs.writeFileSync('journey.html', targetSection);
    console.log("Written to journey.html");
  });
});
