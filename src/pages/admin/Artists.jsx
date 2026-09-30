import React, { useMemo, useState } from "react";
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  ShieldCheck, 
  Ban, 
  BadgeCheck,
  ChevronDown
} from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const ARTISTS = [
  { id: "ART-1", name: "Aarav Mehta", specialty: "Paintings", location: "Jaipur, IN", artworks: 42, sales: 612000, rating: 4.9, verified: true, status: "Active" },
  { id: "ART-2", name: "Riya Sharma", specialty: "Digital Art", location: "Bengaluru, IN", artworks: 35, sales: 498000, rating: 4.8, verified: true, status: "Active" },
  { id: "ART-3", name: "Kabir Verma", specialty: "Sculpture", location: "Udaipur, IN", artworks: 21, sales: 741000, rating: 4.9, verified: true, status: "Active" },
  { id: "ART-4", name: "Ananya Kapoor", specialty: "Abstract Art", location: "Delhi, IN", artworks: 29, sales: 356000, rating: 4.7, verified: true, status: "Active" },
  { id: "ART-5", name: "Meera Iyer", specialty: "Photography", location: "Kochi, IN", artworks: 18, sales: 214000, rating: 4.6, verified: false, status: "Active" },
  { id: "ART-6", name: "Devika Rao", specialty: "Paintings", location: "Pune, IN", artworks: 9, sales: 96500, rating: 4.4, verified: false, status: "Under review" },
  { id: "ART-7", name: "Farhan Ali", specialty: "Sculpture", location: "Lucknow, IN", artworks: 6, sales: 58200, rating: 4.2, verified: false, status: "Suspended" },
];

const CATEGORIES = ["All specialties", "Paintings", "Digital Art", "Sculpture", "Abstract Art", "Photography"];
const VERIFICATION = ["All artists", "Verified", "Unverified"];
const SORTS = ["Sort: Sales (high to low)", "Sort: Rating (high to low)", "Sort: Name (A–Z)"];

function StatusBadge({ status }) {
  const map = {
    Active: "bg-[#E7EEDD] text-[#4C6B3F]",
    "Under review": "bg-[#F6E7D0] text-[#8A5A22]",
    Suspended: "bg-[#F6DFDA] text-[#9B3B2E]",
    Blocked: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Artists() {
  const [artists, setArtists] = useState(ARTISTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [verification, setVerification] = useState(VERIFICATION[0]);
  const [sort, setSort] = useState(SORTS[0]);

  const filtered = useMemo(() => {
    let rows = artists.filter((a) => 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase())
    );
    
    if (category !== CATEGORIES[0]) rows = rows.filter((a) => a.specialty === category);
    if (verification === "Verified") rows = rows.filter((a) => a.verified);
    if (verification === "Unverified") rows = rows.filter((a) => !a.verified);

    rows = [...rows];
    if (sort === SORTS[0]) rows.sort((a, b) => b.sales - a.sales);
    if (sort === SORTS[1]) rows.sort((a, b) => b.rating - a.rating);
    if (sort === SORTS[2]) rows.sort((a, b) => a.name.localeCompare(b.name));
    
    return rows;
  }, [artists, search, category, verification, sort]);

  function toggleVerify(id) {
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, verified: !a.verified } : a)));
  }
  
  function suspendArtist(id) {
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Suspended" } : a)));
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
          <input
            type="text"
            placeholder="Search artists..."
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
            value={verification}
            onChange={(e) => setVerification(e.target.value)}
            className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
          >
            {VERIFICATION.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
          >
            {SORTS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
        </div>

        <button className="ml-auto inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors">
          <Plus size={16} /> Add artist
        </button>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-[#A28F7D] border-b border-[#E8E1DB]">
              <th className="px-6 py-4 font-medium">Artist</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Artworks</th>
              <th className="px-6 py-4 font-medium">Sales</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Verification</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-[#E8E1DB] last:border-b-0 hover:bg-[#F9F8F6] transition-colors">
                <td className="px-6 py-5">
                  <p className="text-[14px] font-medium text-[#362F26]">{a.name}</p>
                  <p className="text-[13px] text-[#A28F7D] mt-0.5">{a.specialty}</p>
                </td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{a.location}</td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{a.artworks}</td>
                <td className="px-6 py-5 text-[14px] font-medium text-[#362F26]">{formatINR(a.sales)}</td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{a.rating}</td>
                <td className="px-6 py-5">
                  {a.verified ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[#4C6B3F] font-medium">
                      <BadgeCheck size={16} /> Verified
                    </span>
                  ) : (
                    <span className="text-[13px] text-[#A28F7D]">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button title="View" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                      <Eye size={18} />
                    </button>
                    <button title="Edit" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button 
                      title={a.verified ? "Unverify" : "Verify"} 
                      onClick={() => toggleVerify(a.id)}
                      className={`transition-colors ${a.verified ? "text-[#4C6B3F] hover:text-[#3a5230]" : "text-[#A28F7D] hover:text-[#4C6B3F]"}`}
                    >
                      <ShieldCheck size={18} />
                    </button>
                    <button 
                      title="Suspend" 
                      onClick={() => suspendArtist(a.id)}
                      className="text-[#9B3B2E] hover:text-[#7a2e23] transition-colors"
                    >
                      <Ban size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-[14px] text-[#A28F7D]">
                  No artists match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}