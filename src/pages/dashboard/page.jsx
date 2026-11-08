import { ArrowRight, ClipboardList, Leaf, LogOut, PlusCircle, Utensils } from "lucide-react";
import Link from "../../../components/Link";
import { getSessionUser } from "../../lib/api";

export default function Dashboard() {
  const user = getSessionUser();
  function logout() { localStorage.removeItem("sharemeal_token"); window.dispatchEvent(new Event("sharemeal-auth")); window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }
  return <section className="dashboard-page"><div className="container"><div className="dashboard-head"><div><span className="eyebrow">Your ShareMeal space</span><h1>Hello, {user?.name?.split(" ")[0] || "friend"}.</h1><p>Every listing and request helps good food find its next table.</p></div><button className="logout-button" onClick={logout}><LogOut size={15} /> Log out</button></div><div className="dashboard-stats"><div><Utensils /><strong>0</strong><span>Food shared</span></div><div><ClipboardList /><strong>0</strong><span>Requests</span></div><div><Leaf /><strong>0</strong><span>Meals saved</span></div></div><div className="dashboard-actions"><Link href="/donate" className="dashboard-action"><PlusCircle /><div><b>Share surplus food</b><small>Post a new listing with an image and pickup details.</small></div><ArrowRight /></Link><Link href="/explore" className="dashboard-action"><Utensils /><div><b>Browse available food</b><small>Find fresh listings shared near your community.</small></div><ArrowRight /></Link><Link href="/requests" className="dashboard-action"><ClipboardList /><div><b>Track your requests</b><small>See approvals and pickup information.</small></div><ArrowRight /></Link></div></div></section>;
}
