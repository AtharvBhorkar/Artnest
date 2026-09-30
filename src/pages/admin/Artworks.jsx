import React, { useMemo, useState } from "react";
import { Plus, Search, ChevronDown, Image as ImageIcon, Eye, Pencil, Check, X, Trash2 } from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const ARTWORKS = [
  { id: "AW-1", title: "Golden Silence", artist: "Aarav Mehta", category: "Painting", medium: "Acrylic on Canvas", price: 18500, stock: "1 of 1", status: "Approved", color: "#C98A68" },
  { id: "AW-2", title: "Monsoon Reverie", artist: "Riya Sharma", category: "Digital Art", medium: "Digital Print", price: 32400, stock: "3 of 5", status: "Approved", color: "#9F5639" },
  { id: "AW-3", title: "Bronze Whisper", artist: "Kabir Verma", category: "Sculpture", medium: "Cast Bronze", price: 64200, stock: "1 of 1", status: "Pending", color: "#A28F7D" },
  { id: "AW-4", title: "City in Ochre", artist: "Ananya Kapoor", category: "Abstract Art", medium: "Oil on Canvas", price: 21800, stock: "1 of 1", status: "Approved", color: "#D9C7B2" },
  { id: "AW-5", title: "Still Water Study", artist: "Meera Iyer", category: "Photography", medium: "Archival Print", price: 15600, stock: "5 of 10", status: "Pending", color: "#736153" },
  { id: "AW-6", title: "Ink and Rust", artist: "Riya Sharma", category: "Digital Art", medium: "Mixed Media", price: 12400, stock: "1 of 1", status: "Rejected", color: "#E8E1DB" },
  { id: "AW-7", title: "Terracotta Dream", artist: "Meera Iyer", category: "Sculpture", medium: "Terracotta", price: 27500, stock: "1 of 1", status: "Approved", color: "#C98A68" },
  { id: "AW-8", title: "Marble Repose", artist: "Kabir Verma", category: "Sculpture", medium: "White Marble", price: 98000, stock: "1 of 1", status: "Approved", color: "#9F5639" },
];

const CATEGORIES = ["All categories", "Painting", "Digital Art", "Sculpture", "Abstract Art", "Photography"];
const PRICE_BANDS = ["Any price", "Under ₹20,000", "₹20,000 – ₹60,000", "Above ₹60,000"];
const STATUSES = ["All statuses", "Approved", "Pending", "Rejected"];

function inBand(price, band) {
  if (band === PRICE_BANDS[1]) return price < 20000;
  if (band === PRICE_BANDS[2]) return price >= 20000 && price <= 60000;
  if (band === PRICE_BANDS[3]) return price > 60000;
  return true;
}

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-[#E7EEDD] text-[#4C6B3F]",
    Pending: "bg-[#F6E7D0] text-[#8A5A22]",
    Rejected: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Artworks() {
  const [artworks, setArtworks] = useState(ARTWORKS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priceBand, setPriceBand] = useState(PRICE_BANDS[0]);
  const [status, setStatus] = useState(STATUSES[0]);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (!a.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== CATEGORIES[0] && a.category !== category) return false;
      if (status !== STATUSES[0] && a.status !== status) return false;
      if (!inBand(a.price, priceBand)) return false;
      return true;
    });
  }, [artworks, search, category, priceBand, status]);

  function setArtStatus(id, s) {
    setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, status: s } : a)));
  }

  function removeArt(id) {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
          <input
            type="text"
            placeholder="Search artworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
          >
            {CATEGORIES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={priceBand}
            onChange={(e) => setPriceBand(e.target.value)}
            className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
          >
            {PRICE_BANDS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
          >
            {STATUSES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
        </div>

        <button className="ml-auto inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors">
          <Plus size={16} /> Add artwork
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white border border-[#E8E1DB] rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-28 flex items-center justify-center" style={{ backgroundColor: a.color }}>
              <ImageIcon size={24} className="text-white/70" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-[#362F26] truncate">{a.title}</p>
                  <p className="text-[13px] text-[#A28F7D] truncate mt-0.5">{a.artist} · {a.medium}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <div className="mt-4 flex items-center justify-between text-[13px] text-[#A28F7D]">
                <span className="font-semibold text-[#362F26] text-[15px]">{formatINR(a.price)}</span>
                <span>{a.stock}</span>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E8E1DB] flex items-center gap-3">
                <button title="View" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                  <Eye size={18} />
                </button>
                <button title="Edit" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                  <Pencil size={18} />
                </button>
                <button 
                  title="Approve" 
                  onClick={() => setArtStatus(a.id, "Approved")}
                  className="text-[#4C6B3F] hover:text-[#3a5230] transition-colors"
                >
                  <Check size={18} />
                </button>
                <button 
                  title="Reject" 
                  onClick={() => setArtStatus(a.id, "Rejected")}
                  className="text-[#9B3B2E] hover:text-[#7a2e23] transition-colors"
                >
                  <X size={18} />
                </button>
                <button 
                  title="Delete" 
                  onClick={() => removeArt(a.id)}
                  className="ml-auto text-[#A28F7D] hover:text-[#9B3B2E] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-[14px] text-[#A28F7D]">
            No artworks match these filters.
          </div>
        )}
      </div>
    </div>
  );
}