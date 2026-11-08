"use client";

import { Clock3, MapPin, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../src/lib/api";

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export default function FoodCard({ item, onExpired }) {
  const [claimed, setClaimed] = useState(false);
  const isDemo = item.demo || !item.createdAt;
  const demoTarget = useMemo(() => Date.now() + Number(item.expiryHours || 4) * 60 * 60 * 1000, [item.id, item._id, item.title, item.expiryHours]);
  const expiryTarget = isDemo ? demoTarget : new Date(item.createdAt).getTime() + Number(item.expiryHours || 0) * 60 * 60 * 1000;
  const [secondsLeft, setSecondsLeft] = useState(Math.max(0, Math.ceil((expiryTarget - Date.now()) / 1000)));

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((expiryTarget - Date.now()) / 1000));
      setSecondsLeft(next);
      if (next === 0 && !isDemo) onExpired?.(item.id || item._id);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiryTarget, isDemo, item.id, item._id, onExpired]);

  return (
    <article className="food-card">
      <div className="food-image-wrap">
        <img src={item.image || item.imageUrl} alt={item.title} className="food-image" />
        <span className="food-category">{item.category}</span>
        <span className={secondsLeft < 3600 && !isDemo ? "expiry-badge urgent" : "expiry-badge"}><Clock3 size={14} /> {secondsLeft ? formatTime(secondsLeft) : isDemo ? "Demo listing" : "Expired"}</span>
      </div>
      <div className="food-content">
        <div className="food-title-row"><h3>{item.title}</h3><span className="quantity">{item.quantity}</span></div>
        <p className="food-donor">{item.donor}</p>
        <p className="food-location"><MapPin size={14} /> {item.location}</p>
        {item.description && <p className="food-description">{item.description}</p>}
        <button className={claimed ? "claim-button claimed" : "claim-button"} onClick={async () => {
          if (!localStorage.getItem("sharemeal_token")) { window.history.pushState({}, "", "/login"); window.dispatchEvent(new PopStateEvent("popstate")); return; }
          try {
            if (item._id) await apiRequest("/requests", { method: "POST", body: JSON.stringify({ foodListingId: item._id }) });
            setClaimed(true);
          } catch (requestError) {
            window.alert(requestError.message);
          }
        }}>
          {claimed ? "Request sent ✓" : "Claim this food"} {!claimed && <ArrowUpRight size={16} />}
        </button>
      </div>
    </article>
  );
}
