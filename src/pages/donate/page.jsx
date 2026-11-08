import { useState } from "react";
import { ArrowRight, ImagePlus, Leaf } from "lucide-react";
import Link from "../../../components/Link";
import { apiRequest } from "../../lib/api";

export default function Donate() {
  const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }
  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true); setError(""); setMessage("");
    const form = new FormData(formElement);
    try {
      let imageUrl = "";
      const image = form.get("image");
      if (image?.size) {
        const upload = new FormData(); upload.append("image", image);
        imageUrl = (await apiRequest("/uploads", { method: "POST", body: upload })).url;
      }
      await apiRequest("/food", { method: "POST", body: JSON.stringify({ title: form.get("title"), category: form.get("category"), quantity: form.get("quantity"), expiryHours: Number(form.get("expiryHours")), pickupAddress: form.get("pickupAddress"), city: form.get("city"), description: form.get("description"), imageUrl }) });
      formElement.reset(); setPreview(""); setFileName(""); setMessage("Your food listing is live.");
    } catch (requestError) { setError(requestError.message); } finally { setSaving(false); }
  }
  return <section className="auth-page"><div className="auth-card donation-card"><Link href="/" className="auth-brand"><span className="brand-mark"><Leaf size={18} fill="currentColor" /></span>Share<span>Meal</span></Link><h1>Share your surplus.</h1><p className="auth-intro">Tell your community what is available.</p><form onSubmit={submit}><label>Food title<input name="title" placeholder="e.g. Fresh vegetable bowls" required /></label><div className="form-two"><label>Category<select name="category" defaultValue="Cooked"><option>Cooked</option><option>Raw</option><option>Bakery</option><option>Packaged</option></select></label><label>Quantity<input name="quantity" placeholder="e.g. 20 meals" required /></label></div><div className="form-two"><label>Expiry (hours)<input name="expiryHours" type="number" min="1" required /></label><label>City<input name="city" placeholder="Bengaluru" required /></label></div><label>Pickup address<input name="pickupAddress" placeholder="Pickup location" required /></label><label className="upload-field"><ImagePlus size={18} /><span>{fileName || "Add a food photo (max 5 MB)"}</span><input name="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} /></label>{preview && <img className="upload-preview" src={preview} alt="Selected food preview" />}<label>Description<textarea name="description" rows="3" placeholder="Anything recipients should know?" /></label>{error && <p className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}<button className="button button-primary auth-submit" disabled={saving}>{saving ? "Uploading and publishing..." : "Publish listing"} <ArrowRight size={16} /></button></form></div></section>;
}
