import Link from "../../components/Link";
import { ArrowRight, Check, ChevronDown, HeartHandshake, Leaf, PackageCheck, Sparkles, Truck, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import FoodCard from "../../components/FoodCard";

const listings = [
  { title: "Fresh vegetable bowls", donor: "Green Table Kitchen", location: "Koramangala, Bengaluru", quantity: "24 meals", expires: "2h 40m left", category: "Cooked", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85" },
  { title: "Assorted bakery treats", donor: "The Daily Loaf", location: "Indiranagar, Bengaluru", quantity: "3.5 kg", expires: "4h 10m left", category: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85" },
  { title: "Seasonal fruit crates", donor: "Harvest & Co.", location: "HSR Layout, Bengaluru", quantity: "18 kg", expires: "6h 25m left", category: "Raw", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=85" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <div className="eyebrow"><span className="eyebrow-dot" /> Food sharing, made simple</div>
            <h1>Good food.<br /><em>Better</em> future.</h1>
            <p className="hero-subtitle">We connect surplus food with people and communities who need it. Less waste for our planet, more nourishment for everyone.</p>
            <div className="hero-actions"><Link href="/register" className="button button-primary">Share your surplus <ArrowRight size={17} /></Link><Link href="/explore" className="button button-quiet">Find available food</Link></div>
            <div className="trust-row"><div className="avatar-stack"><span>R</span><span>M</span><span>A</span><span>+</span></div><span>Join <strong>2,400+ people</strong> making a difference</span></div>
          </motion.div>
          <div className="hero-art" aria-label="Illustration of community food sharing">
            <div className="art-glow" /><div className="art-card art-card-top"><Sparkles size={16} /> <span>Making an impact</span></div>
            <div className="illustration">
              <div className="sun" /><div className="hill hill-back" /><div className="hill hill-front" />
              <div className="crate crate-one">🥕</div><div className="crate crate-two">🍎</div>
              <div className="person person-left"><div className="head" /><div className="body" /><div className="arm" /></div>
              <div className="person person-right"><div className="head" /><div className="body" /><div className="arm" /></div>
              <div className="table"><div /><div /></div>
            </div>
            <div className="art-card art-card-bottom"><span className="check-icon"><Check size={14} /></span><div><strong>12,840 kg</strong><small>food saved this year</small></div></div>
          </div>
        </div>
        <div className="hero-bottom-shape" />
      </section>

      <section className="stats-section" id="impact"><div className="container stats-grid">
        <div className="section-label"><span>Our impact</span><h2>Small actions.<br /><em>Big change.</em></h2></div>
        <div className="stat"><strong>12,840<span>kg</span></strong><p>of food kept from going to waste</p><div className="stat-bar"><i style={{ width: "76%" }} /></div></div>
        <div className="stat"><strong>8,560<span>+</span></strong><p>people nourished through our network</p><div className="stat-bar coral"><i style={{ width: "62%" }} /></div></div>
        <div className="stat"><strong>2,400<span>+</span></strong><p>generous donors and recipients</p><div className="stat-bar yellow"><i style={{ width: "88%" }} /></div></div>
      </div></section>

      <section className="listings-section"><div className="container">
        <div className="section-heading"><div><span className="eyebrow">From your neighbourhood</span><h2>Food looking for a table</h2></div><Link href="/explore" className="text-link">View all listings <ArrowRight size={16} /></Link></div>
        <div className="listings-grid">{listings.map(item => <FoodCard key={item.title} item={item} />)}</div>
      </div></section>

      <section className="how-section" id="how-it-works"><div className="container">
        <div className="center-heading"><span className="eyebrow">Simple by design</span><h2>Sharing is easier <em>together.</em></h2><p>Whether you have food to spare or need a little support, there&apos;s a place for you here.</p></div>
        <div className="steps"><Step icon={<PackageCheck />} number="01" title="Share what you have" text="Post your surplus food in under a minute. Add a photo, pickup details, and you're done." /><div className="step-arrow">→</div><Step icon={<UsersRound />} number="02" title="Find your match" text="Local community members and organisations discover food near them." /><div className="step-arrow">→</div><Step icon={<HeartHandshake />} number="03" title="Make a difference" text="Arrange a pickup and watch a simple meal become a meaningful moment." /></div>
      </div></section>
      <section className="cta-section"><div className="container cta-inner"><div><Leaf size={27} /><h2>There&apos;s always room<br />at the table.</h2></div><Link href="/register" className="button button-light">Join ShareMeal <ArrowRight size={17} /></Link></div></section>
    </>
  );
}

function Step({ icon, number, title, text }) {
  return <div className="step"><div className="step-icon">{icon}</div><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></div>;
}
