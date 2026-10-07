export type Review = {
  id: string;
  author: string;
  initial: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
};

// We will store actual fetched reviews here.
// For now, these are sample reviews fetched from the live site to populate the design.
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: "1a5ca76e",
    author: "Sidharth Kumar",
    initial: "S",
    rating: 5,
    date: "2026-10-04",
    content: "Very Good",
    verified: false
  },
  {
    id: "6b1a046e",
    author: "Anonymous",
    initial: "A",
    rating: 5,
    date: "2026-10-03",
    content: "Mst hai yr",
    verified: false
  },
  {
    id: "4459429f",
    author: "Test",
    initial: "T",
    rating: 5,
    date: "2026-09-30",
    content: "Uuuu7",
    verified: false
  },
  {
    id: "e64225cd",
    author: "Sakshi Raval",
    initial: "S",
    rating: 5,
    date: "2026-09-30",
    content: "No words, bohot hai pure & Great hai, aur sabse best hamare Elvish ji ki Brand hai toh matlab kuch dekh ne ki baat hi nahi hai, baki sabko bhi kharido aur khao, love U",
    verified: true
  },
  {
    id: "05ff2b8a",
    author: "Swati Sarangi",
    initial: "S",
    rating: 5,
    date: "2026-09-30",
    content: "I ordered the ghee just to check how good it is as Elvish's brand. Honestly its too good. Loved it... even my kid is enjoying the purity.. thank you",
    verified: true
  },
  {
    id: "b2a4729f",
    author: "Rohan M.",
    initial: "R",
    rating: 5,
    date: "2026-09-28",
    content: "Taste is very authentic. Highly recommended.",
    verified: true
  },
  {
    id: "c842b11e",
    author: "Anjali S.",
    initial: "A",
    rating: 4,
    date: "2026-09-25",
    content: "Good product but packaging could be slightly better.",
    verified: true
  },
  {
    id: "d9e8321a",
    author: "Vikram Singh",
    initial: "V",
    rating: 5,
    date: "2026-09-20",
    content: "This is hands down the best ghee I've ever bought online. Smells incredible and tastes just like home-made.",
    verified: true
  }
];

export const PRODUCT_REVIEW_STATS: Record<string, { total: number; average: number }> = {
  "pure-a2-gir-cow-ghee-500-ml": { total: 450, average: 4.8 },
  "pure-desi-cow-ghee-1-litre": { total: 1688, average: 4.9 },
  "pure-desi-cow-ghee-2-5-litre": { total: 210, average: 4.9 },
  "pure-desi-cow-ghee-5-litre": { total: 85, average: 5.0 },
};
