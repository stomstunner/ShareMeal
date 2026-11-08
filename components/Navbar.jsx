"use client";

import Link from "./Link";
import { ArrowRight, Leaf, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSessionUser } from "../src/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const refresh = () => setUser(getSessionUser());
    refresh();
    window.addEventListener("sharemeal-auth", refresh);
    return () => window.removeEventListener("sharemeal-auth", refresh);
  }, []);
  const links = [
    ["Home", "/"],
    ["Browse food", "/explore"],
    ["Our impact", "/#impact"],
    ["How it works", "/#how-it-works"],
  ];

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Leaf size={19} fill="currentColor" /></span>
          <span>Share<span>Meal</span></span>
        </Link>
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links mobile-open" : "nav-links"}>
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <span className="nav-divider" />
          {user ? <Link className="user-chip" href={user.role === "ADMIN" ? "/admin" : user.role ? "/dashboard" : "/onboarding/role"}>{user.image ? <img src={user.image} alt="" /> : <span>{user.name?.[0] || "U"}</span>}<b>{user.name?.split(" ")[0] || "Account"}</b></Link> : <Link className="login-link" href="/login">Log in</Link>}
          {user ? <Link className="button button-small" href="/donate">Share food <ArrowRight size={15} /></Link> : <Link className="button button-small" href="/register">Get started <ArrowRight size={15} /></Link>}
        </nav>
      </div>
    </header>
  );
}
