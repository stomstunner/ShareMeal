import Link from "./Link";
import { ArrowUpRight, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark"><Leaf size={18} fill="currentColor" /></span>
            <span>Share<span>Meal</span></span>
          </Link>
          <p className="footer-copy">Good food deserves another table. Together, we can make sure it gets there.</p>
        </div>
        <div className="footer-links">
          <div><strong>Explore</strong><Link href="/explore">Browse food</Link><Link href="/#impact">Our impact</Link><Link href="/#how-it-works">How it works</Link></div>
          <div><strong>Get involved</strong><Link href="/register">Donate food</Link><Link href="/register">Find a meal</Link><Link href="/login">Log in</Link></div>
          <div><strong>Say hello</strong><a href="mailto:hello@sharemeal.org">hello@sharemeal.org <ArrowUpRight size={13} /></a><span>Made for communities everywhere.</span></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© 2024 ShareMeal</span><span>Built with care for a less wasteful world.</span></div>
    </footer>
  );
}
