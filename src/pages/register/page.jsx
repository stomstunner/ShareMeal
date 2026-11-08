import Link from "../../../components/Link";
import { ArrowRight, Leaf } from "lucide-react";
import { apiRequest, googleLogin } from "../../lib/api";
import { useState } from "react";

export default function Register() {
  const [error, setError] = useState(""); const [created, setCreated] = useState(false);
  async function submit(event) { event.preventDefault(); setError(""); const form = new FormData(event.currentTarget); try { const data = await apiRequest("/auth/register", { method: "POST", body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }) }); localStorage.setItem("sharemeal_token", data.token); window.dispatchEvent(new Event("sharemeal-auth")); setCreated(true); } catch (requestError) { setError(requestError.message); } }
  return <section className="auth-page"><div className="auth-card"><Link href="/" className="auth-brand"><span className="brand-mark"><Leaf size={18} fill="currentColor" /></span>Share<span>Meal</span></Link><h1>Let&apos;s share more.</h1><p className="auth-intro">Create your account and join the movement.</p><button className="google-button" type="button" onClick={googleLogin}>G <span>Continue with Google</span></button><div className="or"><span>or sign up with email</span></div><form onSubmit={submit}><label>Full name<input name="name" type="text" placeholder="Your name" required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label><label>Password<input name="password" type="password" placeholder="Create a password" required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary auth-submit" type="submit">{created ? "Account created ✓" : "Create account"} <ArrowRight size={16} /></button></form><p className="auth-footer">Already have an account? <Link href="/login">Log in</Link></p></div></section>;
}
