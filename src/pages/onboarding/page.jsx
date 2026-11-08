import { useState } from "react";
import { ArrowRight, HeartHandshake, Leaf, Store } from "lucide-react";
import Link from "../../../components/Link";
import { apiRequest, getSessionUser } from "../../lib/api";

export default function Onboarding() {
  const [role, setRole] = useState("RECIPIENT"); const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    try {
      const data = await apiRequest("/auth/role", { method: "PATCH", body: JSON.stringify({ role }) });
      localStorage.setItem("sharemeal_token", data.token); window.dispatchEvent(new Event("sharemeal-auth"));
      window.history.pushState({}, "", "/dashboard"); window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (requestError) { setError(requestError.message); }
  }
  const user = getSessionUser();
  return <section className="auth-page"><div className="auth-card role-card"><Link href="/" className="auth-brand"><span className="brand-mark"><Leaf size={18} fill="currentColor" /></span>Share<span>Meal</span></Link><h1>Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1><p className="auth-intro">How would you like to make an impact?</p><form onSubmit={submit}><div className="role-options"><button type="button" className={role === "DONOR" ? "role-option selected" : "role-option"} onClick={() => setRole("DONOR")}><Store /><b>Share surplus food</b><small>For restaurants, events, and people with food to spare.</small></button><button type="button" className={role === "RECIPIENT" ? "role-option selected" : "role-option"} onClick={() => setRole("RECIPIENT")}><HeartHandshake /><b>Find available food</b><small>For NGOs, community centres, and people who need support.</small></button></div>{error && <p className="form-error">{error}</p>}<button className="button button-primary auth-submit">Continue <ArrowRight size={16} /></button></form></div></section>;
}
