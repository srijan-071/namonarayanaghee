from bs4 import BeautifulSoup
import re

with open("product_500ml.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Extract Images
images = set()
for img in soup.find_all("img"):
    src = img.get("src") or img.get("data-src") or img.get("srcset")
    if src and "cdn.shopify.com" in src and ("product" in src.lower() or "ghee" in src.lower()):
        # clean URL from srcset or query params
        src = src.split(" ")[0].split("?")[0]
        if src.startswith("//"):
            src = "https:" + src
        if ".jpg" in src or ".png" in src or ".webp" in src:
            images.add(src)

print("--- IMAGES ---")
for img in list(images)[:10]:
    print(img)

# Extract Description
# Look for product description div
desc_div = soup.find("div", class_=re.compile("product__description", re.I))
if desc_div:
    print("\n--- DESCRIPTION ---")
    print(desc_div.decode_contents().strip())
else:
    # Try finding something else
    desc_div = soup.find("div", class_=re.compile("description", re.I))
    if desc_div:
        print("\n--- DESCRIPTION ---")
        print(desc_div.decode_contents().strip())

