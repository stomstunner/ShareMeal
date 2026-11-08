import { CheckCircle2, Clock3, Leaf } from "lucide-react";
import Link from "../../../components/Link";
import { apiRequest } from "../../lib/api";
import { useEffect, useState } from "react";

export default function Requests() {
  const [requests, setRequests] = useState([]); const [error, setError] = useState("");
  useEffect(() => { apiRequest("/requests/mine").then(setRequests).catch(requestError => setError(requestError.message)); }, []);
  return <section className="requests-page"><div className="container"><div className="section-heading"><div><span className="eyebrow">Your activity</span><h1>Requests and pickups</h1></div><Link href="/explore" className="text-link">Browse food</Link></div>{error ? <div className="empty-state"><span>🔐</span><h3>Sign in to see requests</h3><Link href="/login" className="button button-primary">Log in</Link></div> : requests.length ? <div className="request-list">{requests.map(request => <article className="request-card" key={request._id}><div className="request-icon"><Leaf /></div><div><b>{request.foodListingId?.title || "Food request"}</b><p>Status: <strong>{request.status}</strong></p><div className="request-steps"><span className="done"><CheckCircle2 size={15} /> Requested</span><span className={request.status === "APPROVED" || request.status === "COMPLETED" ? "done" : ""}><Clock3 size={15} /> Approved</span><span className={request.status === "COMPLETED" ? "done" : ""}><CheckCircle2 size={15} /> Completed</span></div></div></article>)}</div> : <div className="empty-state"><span>🍃</span><h3>No requests yet</h3><p>Claim a listing and your pickup tracker will appear here.</p><Link href="/explore" className="button button-primary">Explore food</Link></div>}</div></section>;
}
