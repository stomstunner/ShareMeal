const image = (id, index) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85&sig=${index}`;

const entries = [
  ["Rainbow quinoa salad", "Green Table Kitchen", "Koramangala", "Cooked", "18 bowls", 2, "Roasted vegetables, quinoa and lemon dressing packed this afternoon.", "photo-1512621776951-a57141f2eefd"],
  ["Cinnamon breakfast rolls", "The Daily Loaf", "Indiranagar", "Bakery", "28 rolls", 4, "Soft cinnamon rolls left from the morning bake, individually packed.", "photo-1509440159596-0249088772ff"],
  ["Farmers market fruit box", "Harvest & Co.", "HSR Layout", "Raw", "16 kg", 7, "A colourful mix of apples, oranges, guava and seasonal melon.", "photo-1619566636858-adf3ef46400b"],
  ["Vegetable dal with jeera rice", "Annapoorna Canteen", "Jayanagar", "Cooked", "40 meals", 2, "Nutritious home-style dal, rice and seasonal vegetable sabzi.", "photo-1547592180-85f173990554"],
  ["Paneer tikka wraps", "Urban Tiffin", "Whitefield", "Cooked", "30 wraps", 3, "Grilled paneer, peppers and mint chutney in fresh whole-wheat wraps.", "photo-1540420773420-3366772f4999"],
  ["Baby spinach bundles", "Namma Farms", "Yelahanka", "Raw", "12 kg", 10, "Washed organic spinach harvested this morning from a local farm.", "photo-1576045057995-568f588f82fb"],
  ["Whole wheat sandwich bread", "Bread & Bloom", "Malleshwaram", "Bakery", "22 loaves", 6, "Fresh whole-wheat loaves suitable for breakfast or community kitchens.", "photo-1549931319-a545dcf3bc73"],
  ["Steamed idli breakfast", "Southside Cafe", "Basavanagudi", "Cooked", "50 plates", 1, "Soft idlis with coconut chutney and sambar. Best collected soon.", "photo-1589301760014-d929f3979dbc"],
  ["Ripe banana cartons", "Fruitful Market", "BTM Layout", "Raw", "20 kg", 8, "Sweet ripe bananas perfect for breakfast programmes and snack packs.", "photo-1571771894821-ce9b6c11b08e"],
  ["Vegetable biryani portions", "Celebrations Hall", "Marathahalli", "Cooked", "65 meals", 3, "Fragrant vegetable biryani prepared for a community event.", "photo-1563379926898-05f4575a45d8"],
  ["Tomato basil pasta", "Little Italy Cafe", "Richmond Town", "Cooked", "22 meals", 2, "Penne pasta with tomato basil sauce and parmesan on the side.", "photo-1473093295043-cdd812d0e601"],
  ["Mixed leafy greens", "Urban Harvest", "Hebbal", "Raw", "9 kg", 9, "Crisp lettuce, kale and coriander for salads and fresh cooking.", "photo-1518977676601-b53f82aba655"],
  ["Chocolate chip muffins", "Muffin Stories", "JP Nagar", "Bakery", "36 muffins", 5, "Freshly baked muffins from today's café counter.", "photo-1551024506-0bccd828d307"],
  ["Chickpea salad cups", "Wellness Bowl Co.", "Bellandur", "Cooked", "26 cups", 4, "Protein-rich chickpea salad with cucumber, tomato and herbs.", "photo-1540189549336-e6e99c3679fe"],
  ["Red rice meal boxes", "Swastha Meals", "Rajajinagar", "Cooked", "45 boxes", 2, "Balanced red rice meals with sambar, beans and curd.", "photo-1515003197210-e0cd71810b5f"],
  ["Fresh coconut crates", "Coastal Grocers", "Kalyan Nagar", "Raw", "14 kg", 12, "Young coconuts and fresh grated coconut for community kitchens.", "photo-1526318472351-c75fcf070305"],
  ["Multigrain dinner rolls", "Flour House", "Vijayanagar", "Bakery", "40 rolls", 7, "Soft multigrain rolls baked earlier today.", "photo-1586444248902-2f64eddc13df"],
  ["Lemon rice lunch packs", "Mango Leaf Caterers", "Ulsoor", "Cooked", "35 meals", 3, "South Indian lemon rice with peanuts and vegetable poriyal.", "photo-1601050690597-df0568f70950"],
  ["Papaya and melon slices", "Fresh Cut Hub", "Electronic City", "Raw", "10 kg", 5, "Ready-to-serve fruit cups prepared with fresh seasonal produce.", "photo-1490474418585-ba9bad8fd0ea"],
  ["Aloo paratha packs", "Ghar Ka Swad", "Banashankari", "Cooked", "32 packs", 2, "Stuffed potato parathas with curd and pickle sachets.", "photo-1626132647523-66f5bf380027"],
  ["Artisan sourdough loaves", "Crust & Craft", "Frazer Town", "Bakery", "15 loaves", 8, "Naturally fermented sourdough loaves from the evening batch.", "photo-1585478259715-876acc5be8eb"],
  ["Carrot and cucumber crates", "Daily Greens", "Sanjay Nagar", "Raw", "13 kg", 11, "Fresh crunchy vegetables ideal for salads and juice programmes.", "photo-1447175008436-054170c2e979"],
  ["Rajma chawal bowls", "Dilli Zaika", "BTM Layout", "Cooked", "28 bowls", 3, "Kidney bean curry with steamed rice, cooked without excess spice.", "photo-1585937421612-70a008356fbe"],
  ["Berry yogurt cups", "Morning Spoon", "HSR Layout", "Packaged", "24 cups", 4, "Chilled yogurt cups with oats and seasonal berries.", "photo-1488477181946-6428a0291777"],
  ["Stuffed vegetable sandwiches", "Campus Cafe", "Pees Garden", "Cooked", "38 sandwiches", 2, "Fresh sandwiches with grilled vegetables and mint spread.", "photo-1528735602780-2552fd46c7af"],
  ["Sweet lime baskets", "Orchard Lane", "Nagarbhavi", "Raw", "17 kg", 9, "Juicy sweet limes collected from a nearby orchard.", "photo-1534766555764-ceb6b83f1e4c"],
  ["Garlic herb focaccia", "Oven & Stone", "Indiranagar", "Bakery", "12 trays", 6, "Golden focaccia with rosemary, garlic and olive oil.", "photo-1573140247632-f8fd74997d5c"],
  ["Moong dal khichdi", "Care Kitchen", "Shivajinagar", "Cooked", "55 meals", 1, "Mild, nourishing khichdi made for children and senior citizens.", "photo-1601050690117-94f5f6fa8bd7"],
  ["Organic tomato baskets", "Red Earth Farms", "Sarjapur", "Raw", "21 kg", 10, "Naturally ripened tomatoes from a local organic grower.", "photo-1546094096-0df4bcaaa337"],
  ["Peanut butter cookies", "Cookie Corner", "RT Nagar", "Bakery", "45 cookies", 5, "Sealed peanut butter cookies made without artificial colouring.", "photo-1499636136210-6f4ee915583e"],
  ["Coconut vegetable stew", "Kerala Kitchen", "Hennur", "Cooked", "24 meals", 2, "Creamy vegetable stew with appam portions for a complete meal.", "photo-1546069901-ba9599a7e63c"],
  ["Pomegranate boxes", "Ruby Fruits", "Varthur", "Raw", "11 kg", 7, "Fresh pomegranate arils and whole fruit in clean cartons.", "photo-1547514701-42782101795e"],
  ["Cheese and herb buns", "Bake Street", "Kumaraswamy Layout", "Bakery", "30 buns", 4, "Soft savoury buns filled with cheese and mixed herbs.", "photo-1555507036-ab1f4038808a"],
  ["Masala oats meal cups", "Healthy Habits", "Domlur", "Cooked", "20 cups", 3, "Warm savoury oats with vegetables, packed in microwave-safe cups.", "photo-1498837167922-ddd27525d352"],
  ["Green peas and beans", "Harvest Basket", "Kengeri", "Raw", "15 kg", 12, "Fresh green peas and beans for nutritious community meals.", "photo-1567375698348-5d9d5ae99de0"],
  ["Pav bhaji dinner boxes", "Mumbai Street Kitchen", "Brookefield", "Cooked", "42 meals", 2, "Spiced vegetable bhaji with soft pav and chopped onions.", "photo-1565299624946-b28f40a0ae38"],
  ["Orange tea cakes", "The Cake Shelf", "Cooke Town", "Bakery", "18 slices", 5, "Moist orange tea cakes, individually wrapped for easy distribution.", "photo-1578985545062-69928b1d9587"],
  ["Guava and apple crates", "Neighbourhood Fruits", "Peenya", "Raw", "19 kg", 8, "Crisp guavas and apples ready for families or juice kitchens.", "photo-1560806887-1e4cd0b6cbd6"],
  ["Vegetable pulao boxes", "Sankalp Caterers", "Adugodi", "Cooked", "48 boxes", 3, "Aromatic vegetable pulao with cucumber raita.", "photo-1596797038530-2c107229654b"],
  ["Sesame jaggery bites", "Nourish Collective", "Lingarajapuram", "Packaged", "6 kg", 14, "Energy bites made with sesame, peanuts and natural jaggery.", "photo-1606313564200-e75d5e30476c"],
];

const categoryCounts = { Cooked: 20, Raw: 10, Bakery: 10 };
const sampleEntries = Object.entries(categoryCounts).flatMap(([category, count]) => {
  const pool = entries.filter((entry) => entry[3] === category);
  return Array.from({ length: count }, (_, index) => {
    const source = pool[index % pool.length];
    const [title, donor, area, , quantity, expiryHours, description, photoId] = source;
    const batch = Math.floor(index / pool.length);
    return [batch ? `${title} — community batch ${batch + 1}` : title, donor, area, category, quantity, expiryHours + (index % 4), batch ? `${description} This extra community batch is available for local pickup.` : description, photoId];
  });
});

export const sampleListings = sampleEntries.map((entry, index) => {
  const [title, donor, area, category, quantity, expiryHours, description, photoId] = entry;
  const imageUrl = image(photoId, index);
  return {
    id: `sample-${index + 1}`,
    title,
    donor,
    location: `${area}, Bengaluru`,
    city: "Bengaluru",
    category,
    quantity,
    expiryHours,
    expires: `${expiryHours}h left`,
    image: imageUrl,
    imageUrl,
    description,
    demo: true,
  };
});
