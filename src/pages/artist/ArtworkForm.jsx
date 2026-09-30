import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import { ARTWORKS, Card, PAGE, btnGhost, btnPrimary, inputCls } from "./shared";

const CATEGORIES = ["Painting", "Abstract", "Drawing", "Sculpture", "Photography", "Digital Art"];

export default function ArtworkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = ARTWORKS.find((a) => String(a.id) === id);
  const [form, setForm] = useState(
    existing || { title: "", category: CATEGORIES[0], medium: "", size: "", price: "", description: "", status: "Draft" }
  );
  const [preview, setPreview] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valid = form.title.trim() && Number(form.price) > 0;

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    // TODO: yahan API call aayegi (create / update)
    navigate("/artist/artworks");
  };

  const label = (text) => <span className="mb-1 block text-[12.5px] text-[#A28F7D]">{text}</span>;

  return (
    <form onSubmit={submit} className={PAGE}>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Artwork image" className="lg:col-span-1">
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-[#D9CFC5] bg-[#F9F8F6] text-[#A28F7D] hover:border-[#9F5639]">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
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
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              {label("Price (₹)")}
              <input type="number" min="0" value={form.price} onChange={set("price")} className={inputCls} />
            </label>
            <label className="block">
              {label("Medium")}
              <input value={form.medium} onChange={set("medium")} className={inputCls} placeholder="Oil on canvas" />
            </label>
            <label className="block">
              {label("Size")}
              <input value={form.size} onChange={set("size")} className={inputCls} placeholder="24 x 30 in" />
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