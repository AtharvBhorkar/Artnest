import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import { ARTWORKS, Badge, PAGE, inr } from "./shared";

const STATUSES = ["All statuses", "Published", "Draft", "Sold"];

export default function MyArtworks() {
  const [items, setItems] = useState(ARTWORKS);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);

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
    if (window.confirm(`Delete "${a.title}"?`)) setItems((xs) => xs.filter((x) => x.id !== a.id));
  };

  return (
    <div className={PAGE}>
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
            <div className="aspect-[4/3] bg-gradient-to-br from-[#e6d6c2] to-[#c9a888]" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[16px] text-[#362F26]">{a.title}</h3>
                  <p className="mt-0.5 text-[13px] text-[#A28F7D]">{a.category} · {a.medium}</p>
                </div>
                <Badge status={a.status} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#E8E1DB] pt-4">
                <span className="text-[15px] text-[#362F26]">{inr(a.price)}</span>
                <div className="flex gap-1">
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