import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import FoodCard from "../../../components/FoodCard";
import { apiRequest } from "../../lib/api";
import { useEffect } from "react";

const fallbackItems = [
  { title: "Fresh vegetable bowls", donor: "Green Table Kitchen", location: "Koramangala, Bengaluru", quantity: "24 meals", expires: "2h 40m left", category: "Cooked", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85" },
  { title: "Assorted bakery treats", donor: "The Daily Loaf", location: "Indiranagar, Bengaluru", quantity: "3.5 kg", expires: "4h 10m left", category: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85" },
  { title: "Seasonal fruit crates", donor: "Harvest & Co.", location: "HSR Layout, Bengaluru", quantity: "18 kg", expires: "6h 25m left", category: "Raw", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=85" },
  { title: "Warm dal and rice", donor: "Annapoorna Canteen", location: "Jayanagar, Bengaluru", quantity: "40 meals", expires: "1h 55m left", category: "Cooked", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85" },
];

export default function Explore() {
  const [items, setItems] = useState(fallbackItems);
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All");
  useEffect(() => { apiRequest("/food").then(data => setItems(data.map(item => ({ ...item, image: item.imageUrl || item.image, donor: item.donorId?.name || item.donor, location: item.pickupAddress || item.location, expires: item.expires || `${item.expiryHours || 4}h left` })))).catch(() => {}); }, []);
  const removeExpired = (id) => setItems((current) => current.filter((item) => (item.id || item._id) !== id));
  const filtered = useMemo(() => items.filter(item => (filter === "All" || item.category === filter) && `${item.title} ${item.location} ${item.donor}`.toLowerCase().includes(search.toLowerCase())), [items, search, filter]);
  return <section className="explore-page"><div className="container">
    <div className="explore-heading"><div><span className="eyebrow">Browse your neighbourhood</span><h1>Food looking for a table.</h1><p>Discover fresh, surplus food shared by generous local donors.</p></div><div className="explore-count"><strong>{filtered.length}</strong><span>available listings</span></div></div>
    <div className="explore-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food, donors, or locations..." /></div><div className="filters"><SlidersHorizontal size={16} />{["All", "Cooked", "Raw", "Bakery"].map(option => <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}</button>)}</div></div>
    <div className="listings-grid explore-grid">{filtered.map(item => <FoodCard key={item.id || item._id || item.title} item={item} onExpired={removeExpired} />)}</div>
    {!filtered.length && <div className="empty-state"><span>🍃</span><h3>No listings found</h3><p>Try a different search or category.</p></div>}
  </div></section>;
}
