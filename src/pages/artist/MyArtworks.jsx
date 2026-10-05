import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ChevronDown, Tag } from "lucide-react";
import { ARTWORKS, Badge, PAGE, inr, inputCls, btnPrimary, btnGhost } from "./shared";
import { CATEGORY_LABELS } from "../../data/artworks";

const STORE_KEY = "artnest_artist_artworks";
const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
};

const STATUSES = ["All statuses", "Published", "Draft", "Sold"];

const OFFERS_KEY = "artnest_offers";
const readOffers = () => {
  try {
    return JSON.parse(localStorage.getItem(OFFERS_KEY)) || [];
  } catch {
    return [];
  }
};

function OfferModal({ art, existing, onClose, onSave, onRemove }) {
  const original = Number(art.value ?? art.price);
  const [offerPrice, setOfferPrice] = useState(existing?.value ?? "");
  const [endsAt, setEndsAt] = useState(existing?.offerEnds ?? "");
  const [note, setNote] = useState(existing?.offerNote ?? "");
  const today = new Date().toISOString().slice(0, 10);
  const valid = Number(offerPrice) > 0 && Number(offerPrice) < original && endsAt >= today && endsAt && note.trim();
  const pct = valid ? Math.round((1 - Number(offerPrice) / original) * 100) : 0;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSave({
      id: art.id,
      title: art.title,
      artist: art.artist || "Artist",
      location: art.location,
      category: art.category,
      medium: art.medium,
      dims: art.dims,
      img: art.img,
      tag: art.tag,
      value: Number(offerPrice),
      originalValue: original,
      offerPct: pct,
      offerEnds: endsAt,
      offerNote: note.trim(),
      postedAt: Date.now(),
    });
  };

  const label = (t) => <span className="mb-1 block text-[12.5px] text-[#A28F7D]">{t}</span>;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-[460px] space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[18px] text-[#362F26]">{existing ? "Edit offer" : "Create offer"}</h3>
            <p className="text-[13px] text-[#A28F7D]">{art.title} · Original ₹{original.toLocaleString("en-IN")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[20px] leading-none text-[#736153]">×</button>
        </div>
        <label className="block">
          {label("Offer price (₹)")}
          <input type="number" min="1" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className={inputCls} />
          {valid && <span className="mt-1 block text-[12px] text-[#4C6B3F]">{pct}% off</span>}
          {offerPrice && Number(offerPrice) >= original && (
            <span className="mt-1 block text-[12px] text-[#9B3B2E]">Offer price must be lower than the original price.</span>
          )}
        </label>
        <label className="block">
          {label("Offer valid until")}
          <input type="date" min={today} value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          {label("Offer note")}
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={40} className={inputCls} placeholder="e.g. Festive sale" />
        </label>
        <div className="flex flex-wrap gap-3 border-t border-[#E8E1DB] pt-4">
          <button type="submit" disabled={!valid} className={btnPrimary}>{existing ? "Update offer" : "Post offer"}</button>
          {existing && (
            <button type="button" onClick={() => onRemove(art.id)} className={`${btnGhost} text-[#9B3B2E]`}>Remove offer</button>
          )}
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function MyArtworks() {
  const [items, setItems] = useState(() => {
  const stored = readStored();
  const converted = new Set(stored.map((a) => a.demoId));
  return [...stored, ...ARTWORKS.filter((a) => !converted.has(a.id))];
});
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);
  const [offerFor, setOfferFor] = useState(null);
  const [offers, setOffers] = useState(readOffers);

  const saveOffer = (record) => {
    const next = [record, ...readOffers().filter((o) => o.id !== record.id)];
    try {
      localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
    } catch {
    }
    setOffers(next);
    setOfferFor(null);
  };
  const removeOffer = (id) => {
    const next = readOffers().filter((o) => o.id !== id);
    try {
      localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
    } catch {
    }
    setOffers(next);
    setOfferFor(null);
  };

  const shown = useMemo(
    () =>
      items.filter(
        (a) =>
          (status === STATUSES[0] || a.status === status) &&
          a.title.toLowerCase().includes(q.toLowerCase())
      ),
    [items, q, status]
  );

  const remove = (a) => {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    setItems((xs) => xs.filter((x) => x.id !== a.id));
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(readStored().filter((x) => x.id !== a.id)));
    } catch {
    }
  };

  return (
    <div className={PAGE}>
      {offerFor && (
        <OfferModal
          art={offerFor}
          existing={offers.find((o) => o.id === offerFor.id)}
          onClose={() => setOfferFor(null)}
          onSave={saveOffer}
          onRemove={removeOffer}
        />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your artworks…"
            className="h-11 w-full rounded-full border border-[#E8E1DB] bg-white pl-11 pr-4 text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:border-[#9F5639] focus:outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 cursor-pointer appearance-none rounded-full border border-[#E8E1DB] bg-white pl-4 pr-10 text-[14px] text-[#362F26] focus:border-[#9F5639] focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
        </div>
        <Link to="/artist/artworks/new" className="flex h-11 items-center gap-2 rounded-full bg-[#9F5639] px-5 text-[14px] text-white hover:bg-[#8A4A30]">
          <Plus size={16} /> New artwork
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-2xl border border-[#E8E1DB] bg-white">
            {a.img ? (
              <img src={a.img} alt={a.title} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-[#e6d6c2] to-[#c9a888]" />
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[16px] text-[#362F26]">{a.title}</h3>
                  <p className="mt-0.5 text-[13px] text-[#A28F7D]">{CATEGORY_LABELS[a.category] || a.category} · {a.medium}</p>
                </div>
                <Badge status={a.status} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#E8E1DB] pt-4">
                <span className="text-[15px] text-[#362F26]">
                  {inr(a.value ?? a.price)}
                  {offers.some((o) => o.id === a.id) && (
                    <span className="ml-2 rounded-full bg-[#F6E7D0] px-2 py-0.5 text-[11px] text-[#8A5A22]">On offer</span>
                  )}
                </span>
                <div className="flex gap-1">
                  {a.img && (
                    <button type="button" title="Offer" onClick={() => setOfferFor(a)} className="grid h-8 w-8 place-items-center rounded-full text-[#A28F7D] hover:bg-[#F3ECE5] hover:text-[#9F5639]">
                      <Tag size={16} />
                    </button>
                  )}
                  <Link to={`/artist/artworks/${a.id}/edit`} title="Edit" className="grid h-8 w-8 place-items-center rounded-full text-[#A28F7D] hover:bg-[#F3ECE5] hover:text-[#362F26]">
                    <Pencil size={16} />
                  </Link>
                  <button type="button" title="Delete" onClick={() => remove(a)} className="grid h-8 w-8 place-items-center rounded-full text-[#A28F7D] hover:bg-[#F6DFDA] hover:text-[#9B3B2E]">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!shown.length && <p className="py-10 text-center text-[14px] text-[#A28F7D]">No artworks found.</p>}
    </div>
  );
}