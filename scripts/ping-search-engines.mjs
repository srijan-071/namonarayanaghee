// Ping search engines about sitemap updates and new blog links
const sitemapUrl = "https://www.namonarayanaghee.store/sitemap.xml";
const newUrl = "https://www.namonarayanaghee.store/blog/namo-narayana-ghee-review";
const indexNowKey = "c6488d159a6744888beba8098fa0676b";

const endpoints = [
  {
    name: "Yandex Sitemap Ping",
    url: `https://webmaster.yandex.ru/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    method: "GET"
  }
];

async function pingAll() {
  console.log(`Starting search engine notification for: ${sitemapUrl}`);
  console.log(`New Article URL: ${newUrl}\n`);

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; NamoNarayanaGheeBot/1.0; +https://www.namonarayanaghee.store)" }
      });
      console.log(`[${res.status}] ${ep.name}: ${res.statusText || "OK"}`);
    } catch (err) {
      console.log(`[FAIL] ${ep.name}: ${err.message}`);
    }
  }

  // Submit to IndexNow (Bing, Yandex, Seznam, Naver)
  try {
    const indexNowPayload = {
      host: "www.namonarayanaghee.store",
      key: indexNowKey,
      keyLocation: `https://www.namonarayanaghee.store/${indexNowKey}.txt`,
      urlList: [
        newUrl,
        "https://www.namonarayanaghee.store/blog",
        sitemapUrl
      ]
    };

    const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowPayload)
    });
    console.log(`[${indexNowRes.status}] IndexNow (Bing / Yandex / Seznam / Naver): ${indexNowRes.statusText || "Submitted"}`);
  } catch (err) {
    console.log(`[NOTICE] IndexNow: ${err.message}`);
  }

  console.log("\nFinished search engine notification process.");
}

pingAll();
