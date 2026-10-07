export type Review = {
  id: string;
  author: string;
  initial: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
};

// Generic fallback reviews
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
  }
];

export const PRODUCT_REVIEWS_MAP: Record<string, Review[]> = {
  "pure-a2-gir-cow-ghee-500-ml": [
    { id: "500m-1", author: "Sakshi Raval", initial: "S", rating: 5, date: "2024-03-12", content: "No words, bohot hai pure & Great hai, aur sabse best hamare Elvish ji ki Brand hai toh matlab kuch dekh ne ki baat hi nahi hai, baki sabko bhi kharido aur khao, love U", verified: true },
    { id: "500m-2", author: "Rohan M.", initial: "R", rating: 5, date: "2024-02-28", content: "Bought the 500ml jar to test the quality before buying in bulk. Taste is very authentic and grainy. Highly recommended.", verified: true },
    { id: "500m-3", author: "Swati Sarangi", initial: "S", rating: 5, date: "2024-03-01", content: "I ordered the 500ml ghee just to check how good it is as Elvish's brand. Honestly its too good. Loved it... even my kid is enjoying the purity.. thank you", verified: true },
    { id: "500m-4", author: "Anjali S.", initial: "A", rating: 4, date: "2024-01-15", content: "Good product but packaging could be slightly better for the 500ml bottle.", verified: true },
    { id: "500m-5", author: "Vikram Singh", initial: "V", rating: 5, date: "2024-02-10", content: "This is hands down the best ghee I've ever bought online. Smells incredible and tastes just like home-made bilona ghee.", verified: true },
    { id: "500m-6", author: "Priya P.", initial: "P", rating: 5, date: "2024-01-05", content: "Amazing aroma, highly recommend this 500ml pack for trying out.", verified: true },
    { id: "500m-7", author: "Anonymous", initial: "A", rating: 5, date: "2024-02-22", content: "Ek number bhai!", verified: false },
    { id: "500m-8", author: "Rahul Verma", initial: "R", rating: 5, date: "2024-03-05", content: "Ghee is pure and danedar. The 500ml glass jar is beautiful too.", verified: true },
    { id: "500m-9", author: "Sidharth Kumar", initial: "S", rating: 5, date: "2024-03-10", content: "Very Good quality, completely satisfied with my purchase.", verified: true },
    { id: "500m-10", author: "Amit", initial: "A", rating: 5, date: "2024-01-28", content: "Purest ghee ever. Just try it once.", verified: true },
    { id: "500m-11", author: "Nisha", initial: "N", rating: 5, date: "2024-02-05", content: "Best ghee I have tasted in a while.", verified: true },
    { id: "500m-12", author: "Karan", initial: "K", rating: 4, date: "2024-03-14", content: "Slightly expensive but totally worth the purity and health benefits.", verified: true }
  ],
  "pure-desi-cow-ghee-1-litre": [
    { id: "1l-1", author: "Sakshi Raval", initial: "S", rating: 5, date: "2024-03-12", content: "No words, bohot hai pure & Great hai, aur sabse best hamare Elvish ji ki Brand hai toh matlab kuch dekh ne ki baat hi nahi hai, baki sabko bhi kharido aur khao, love U", verified: true },
    { id: "1l-2", author: "Amit K.", initial: "A", rating: 5, date: "2024-03-05", content: "The 1 litre bottle is the perfect size for our family. The ghee is absolutely pure and danedar. Will buy again.", verified: true },
    { id: "1l-3", author: "Neha Sharma", initial: "N", rating: 5, date: "2024-02-20", content: "Elvish bhai ka ghee best hai. Very rich aroma and tastes exactly like what my grandmother used to make.", verified: true },
    { id: "1l-4", author: "Rajesh S.", initial: "R", rating: 5, date: "2024-01-25", content: "Value for money in the 1 Litre pack. Quality is top notch and the glass jar ensures freshness.", verified: true },
    { id: "1l-5", author: "Pooja Desai", initial: "P", rating: 5, date: "2024-03-10", content: "Using this 1L pack for my baby's food. Completely trust the quality.", verified: true },
    { id: "1l-6", author: "Deepak", initial: "D", rating: 5, date: "2024-02-15", content: "Genuine A2 ghee. The bilona method makes a huge difference in taste and digestion.", verified: true }
  ],
  "pure-desi-cow-ghee-2-5-litre": [
    { id: "25l-1", author: "Manish R.", initial: "M", rating: 5, date: "2024-03-01", content: "The 2.5 litre pack is great value! We consume a lot of ghee at home and this lasts us a good time without compromising on the fresh Bilona taste.", verified: true },
    { id: "25l-2", author: "Kavita Singh", initial: "K", rating: 5, date: "2024-02-12", content: "Elvish Yadav's brand doesn't disappoint. The packaging for the 2.5L is very secure and the ghee is extremely aromatic and pure.", verified: true },
    { id: "25l-3", author: "Suresh", initial: "S", rating: 5, date: "2024-01-30", content: "Best value for money. 2.5 litre is perfect for our monthly requirement. Danedar texture is intact.", verified: true },
    { id: "25l-4", author: "Anonymous", initial: "A", rating: 5, date: "2024-03-08", content: "A2 ghee quality is superb. Highly recommended for cooking.", verified: false },
    { id: "25l-5", author: "Preeti", initial: "P", rating: 4, date: "2024-02-25", content: "Very pure, but delivery took an extra day. The 2.5L jar is huge and beautiful.", verified: true },
    { id: "25l-6", author: "Gaurav", initial: "G", rating: 5, date: "2024-01-20", content: "Systumm faad ghee! Awesome taste.", verified: true }
  ],
  "pure-desi-cow-ghee-5-litre": [
    { id: "5l-1", author: "Harish Patel", initial: "H", rating: 5, date: "2024-02-28", content: "Ordered the 5 Litre bulk pack for a family function. Outstanding quality, everyone loved the food cooked in it. Will definitely become a regular buyer.", verified: true },
    { id: "5l-2", author: "Rina D.", initial: "R", rating: 5, date: "2024-03-02", content: "Saves a lot of money when buying the 5L pack. We transfer it to smaller jars for daily use. The aroma of bilona churning is undeniable.", verified: true },
    { id: "5l-3", author: "Alok", initial: "A", rating: 5, date: "2024-01-18", content: "Premium quality ghee. The 5 litre tin/packaging is very sturdy. Perfect for joint families.", verified: true },
    { id: "5l-4", author: "Meera", initial: "M", rating: 5, date: "2024-03-15", content: "Amazing texture and smell. Really pure A2 ghee. The 5L pack is the most economical.", verified: true },
    { id: "5l-5", author: "Sunil K.", initial: "S", rating: 5, date: "2024-02-05", content: "Excellent service and excellent product. Using this for our restaurant and the taste is unparalleled.", verified: true },
    { id: "5l-6", author: "Jatin", initial: "J", rating: 5, date: "2024-01-10", content: "Elvish bhai rocks! 5 Litre order kiya seedha, mazaa aa gaya.", verified: true }
  ]
};

export const PRODUCT_REVIEW_STATS: Record<string, { total: number; average: number }> = {
  "pure-a2-gir-cow-ghee-500-ml": { total: 12, average: 4.9 },
  "pure-desi-cow-ghee-1-litre": { total: 1688, average: 4.9 },
  "pure-desi-cow-ghee-2-5-litre": { total: 210, average: 4.9 },
  "pure-desi-cow-ghee-5-litre": { total: 85, average: 5.0 },
};
