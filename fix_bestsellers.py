import re

with open('src/components/home/Bestsellers.tsx', 'r') as f:
    content = f.read()

# I will replace the arrays with a single allProducts array
new_arrays = """// Actual products data
const allProducts = [
  {
    id: 9545153446056,
    variantId: 55812012572840,
    slug: "pure-desi-cow-ghee-1-litre",
    badge: "BESTSELLER",
    badgeColor: "bg-[#C38936]",
    title: "Pure A2 Gir Cow Ghee 1 Litre",
    variantTitle: "1 Litre",
    subtitle: "Bilona Churned • Pure & Traditional",
    size: "1 Litre",
    price: 164500,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
  },
  {
    id: 9545146237096,
    variantId: 55811997728936,
    slug: "pure-desi-cow-ghee-2-5-litre",
    badge: "VALUE PACK",
    badgeColor: "bg-[#1E3A24]",
    title: "Pure A2 Gir Cow Ghee 2.5 Litre",
    variantTitle: "2.5 Litre",
    subtitle: "Bilona Churned • Great for Families",
    size: "2.5 Litre",
    price: 388500,
    image: "/assets/product_6-2p5_jpg.webp"
  },
  {
    id: 9545149055144,
    variantId: 55812002971816,
    slug: "pure-desi-cow-ghee-5-litre",
    badge: "FAMILY PACK",
    badgeColor: "bg-[#C38936]",
    title: "Pure A2 Gir Cow Ghee 5 Litre",
    variantTitle: "5 Litre",
    subtitle: "Perfect to Begin Your Journey",
    size: "5 Litre",
    price: 735000,
    image: "/assets/product_6-5L_jpg.webp"
  },
  {
    id: 9545126379688,
    variantId: 55811950706856,
    slug: 'besan',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Besan',
    variantTitle: 'Default Title',
    subtitle: 'Freshly packed',
    size: '1 Kg',
    price: 15000,
    image: '/assets/product_Besan.webp'
  },
  {
    id: 9545039282344,
    variantId: 55811323461800,
    slug: 'black-mustard-oil',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Black Mustard Oil',
    variantTitle: 'Default Title',
    subtitle: 'Cold Pressed • Bold Flavour',
    size: '1 Litre',
    price: 30000,
    image: '/assets/product_blackmusterd.webp'
  },
  {
    id: 9545038823592,
    variantId: 55811323363496,
    slug: 'coconut-oil',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Coconut Oil',
    variantTitle: 'Default Title',
    subtitle: 'Pure • Natural • Versatile',
    size: '1 Litre',
    price: 40000,
    image: '/assets/product_coconutoil.webp'
  },
  {
    id: 9545045147816,
    variantId: 55811350495400,
    slug: 'honey',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Honey',
    variantTitle: 'Default Title',
    subtitle: 'Nature\\'s Sweetener',
    size: '500g',
    price: 45000,
    image: '/assets/product_honey.webp'
  },
  {
    id: 9545042329768,
    variantId: 55811334865064,
    slug: 'jaggery-powder',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Jaggery Powder',
    variantTitle: 'Default Title',
    subtitle: 'Desi Goodness • Rich in Nutrients',
    size: '1 Kg',
    price: 20000,
    image: '/assets/product_jaggery.webp'
  },
  {
    id: 9545130180776,
    variantId: 55811961356456,
    slug: 'khapli-atta',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Khapli Atta',
    variantTitle: 'Default Title',
    subtitle: 'Ancient Grain • Wholesome',
    size: '5 Kg',
    price: 25000,
    image: '/assets/product_Khapliatta.webp'
  },
  {
    id: 9545055633576,
    variantId: 55811410919592,
    slug: 'multi-grain-atta',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Multi Grain Atta',
    variantTitle: 'Default Title',
    subtitle: 'Nutritious • Everyday Essential',
    size: '5 Kg',
    price: 18000,
    image: '/assets/product_Multigrainatta.webp'
  },
  {
    id: 9545127887016,
    variantId: 55811956211880,
    slug: 'pickle',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Pickle',
    variantTitle: 'Default Title',
    subtitle: 'Traditional Taste • Homemade Style',
    size: '400g',
    price: 22000,
    image: '/assets/product_pickle.webp'
  }
];
"""

start_str = "// Actual Ghee products data matching the live store"
end_str = "export default function Bestsellers() {"

# Regex replace everything from start_str to end_str
regex = re.compile(re.escape(start_str) + r".*?" + r"(?=export default function Bestsellers\(\) \{)", re.DOTALL)
content = regex.sub(new_arrays, content)

# Also we need to modify gheeProducts to allProducts in the render loop
content = content.replace('gheeProducts.map((p)', 'allProducts.map((p)')
# And remove the Coming Soon Section
coming_soon_section_start = "{/* Coming Soon Section */}"
# We can just remove the whole div containing Coming Soon section
coming_soon_regex = re.compile(re.escape(coming_soon_section_start) + r".*?</div>\n          </div>", re.DOTALL)
content = coming_soon_regex.sub("", content)

# And fix handleAddToCart type
content = content.replace('(p: typeof gheeProducts[0])', '(p: typeof allProducts[0])')

with open('src/components/home/Bestsellers.tsx', 'w') as f:
    f.write(content)
