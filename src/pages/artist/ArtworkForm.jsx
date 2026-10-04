import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ARTWORKS as DEMO, Card, PAGE, btnGhost, btnPrimary, inputCls } from "./shared";

const STORE_KEY = "artnest_artist_artworks";
const CATEGORIES = [
  ["paintings", "Paintings"],
  ["sculptures", "Sculptures"],
  ["ceramics", "Ceramics & Pottery"],
  ["photography", "Photography"],
  ["digital", "Digital & New Media"],
  ["textile", "Textile & Fiber Art"],
  ["printmaking", "Printmaking & Monotype"],
];
const EMPTY = {
  title: "", category: "paintings", medium: "", dims: "", price: "",
  description: "", status: "Published", location: "", tag: "", img: "",
};

const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
};

export default function ArtworkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stored = readStored().find((a) => String(a.id) === id);
  const demo = !stored ? DEMO.find((a) => String(a.id) === id) : null;
  const existing = stored || demo;

  const [form, setForm] = useState(() => {
    if (stored) return { ...EMPTY, ...stored, price: stored.value };
    if (demo) {
      return { ...EMPTY, title: demo.title, medium: demo.medium, dims: demo.size, price: demo.price, description: demo.description, status: demo.status };
    }
    return EMPTY;
  });
  const [saveError, setSaveError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid =
    form.title.trim() && Number(form.price) > 0 && form.img &&
    form.location.trim() && form.medium.trim() && form.dims.trim() && form.tag.trim();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        const scale = Math.min(1, 900 / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * scale);
        c.height = Math.round(im.height * scale);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        setForm((f) => ({ ...f, img: c.toDataURL("image/jpeg", 0.8) }));
      };
      im.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const record = {
      id: stored?.id ?? `a-${Date.now()}`,
      demoId: stored?.demoId ?? demo?.id,
      title: form.title.trim(),
      artist: user?.name || "Artist",
      location: form.location.trim(),
      category: form.category,
      medium: form.medium.trim(),
      dims: form.dims.trim(),
      value: Number(form.price),
      img: form.img,
      tag: form.tag.trim(),
      description: form.description.trim(),
      status: form.status,
      createdAt: stored?.createdAt ?? Date.now(),
    };
    try {
      const rest = readStored().filter((a) => a.id !== record.id);
      localStorage.setItem(STORE_KEY, JSON.stringify([record, ...rest]));
    } catch {
      setSaveError("Could not save. Try a smaller image.");
      return;
    }
    navigate("/artist/artworks");
  };

  const label = (text) => <span className="mb-1 block text-[12.5px] text-[#A28F7D]">{text}</span>;

  return (
    <form onSubmit={submit} className={PAGE}>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Artwork image" className="lg:col-span-1">
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-[#D9CFC5] bg-[#F9F8F6] text-[#A28F7D] hover:border-[#9F5639]">
            {form.img ? (
              <img src={form.img} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <Upload size={22} />
                <span className="text-[13px]">Click to upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
        </Card>

        <Card title={existing ? "Edit details" : "Artwork details"} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              {label("Title")}
              <input value={form.title} onChange={set("title")} className={inputCls} placeholder="e.g. Golden Silence" />
            </label>
            <label className="block">
              {label("Category")}
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="block">
              {label("Price (₹)")}
              <input type="number" min="0" value={form.price} onChange={set("price")} className={inputCls} />
            </label>
            <label className="block">
              {label("Medium")}
              <input value={form.medium} onChange={set("medium")} className={inputCls} placeholder="Oil on Heavy Canvas" />
            </label>
            <label className="block">
              {label("Size")}
              <input value={form.dims} onChange={set("dims")} className={inputCls} placeholder="120 x 90 cm" />
            </label>
            <label className="block">
              {label("Location")}
              <input value={form.location} onChange={set("location")} className={inputCls} placeholder="Jaipur, India" />
            </label>
            <label className="block">
              {label("Tag")}
              <input value={form.tag} onChange={set("tag")} className={inputCls} placeholder="Original Oil" />
            </label>
            <label className="block sm:col-span-2">
              {label("Description")}
              <textarea
                rows={4}
                value={form.description}
                onChange={set("description")}
                className="w-full rounded-xl border border-[#E8E1DB] bg-white p-3 text-[14px] text-[#362F26] outline-none focus:border-[#9F5639]"
              />
            </label>
            <label className="block">
              {label("Status")}
              <select value={form.status} onChange={set("status")} className={inputCls}>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </label>
          </div>

          {!valid && (
            <p className="mt-4 text-[12.5px] text-[#A28F7D]">
              Image, title, price, medium, size, location and tag are required. Discover mein yahi details dikhti hain.
            </p>
          )}
          {saveError && <p className="mt-2 text-[12.5px] text-[#9B3B2E]">{saveError}</p>}

          <div className="mt-6 flex gap-3 border-t border-[#E8E1DB] pt-5">
            <button type="submit" disabled={!valid} className={btnPrimary}>
              {existing ? "Save changes" : "Create artwork"}
            </button>
            <Link to="/artist/artworks" className={btnGhost}>Cancel</Link>
          </div>
        </Card>
      </div>
    </form>
  );
}