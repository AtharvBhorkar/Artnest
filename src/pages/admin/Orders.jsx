import React, { useMemo, useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const ORDERS = [
  { id: "ORD-10245", buyer: "Priya Sharma", piece: "Golden Silence", artist: "Aarav Mehta", amount: 18500, status: "Completed", date: "18 Sep 2026" },
  { id: "ORD-10244", buyer: "Rahul Kapoor", piece: "Monsoon Reverie", artist: "Riya Sharma", amount: 32400, status: "Processing", date: "18 Sep 2026" },
  { id: "ORD-10243", buyer: "Sneha Iyer", piece: "Bronze Whisper", artist: "Kabir Verma", amount: 64200, status: "Pending", date: "17 Sep 2026" },
  { id: "ORD-10242", buyer: "Vikram Nair", piece: "City in Ochre", artist: "Ananya Kapoor", amount: 21800, status: "Completed", date: "17 Sep 2026" },
  { id: "ORD-10241", buyer: "Ishaan Joshi", piece: "Terracotta Dream", artist: "Meera Iyer", amount: 15600, status: "Cancelled", date: "16 Sep 2026" },
  { id: "ORD-10240", buyer: "Ananya Rao", piece: "Still Water Study", artist: "Aarav Mehta", amount: 27900, status: "Completed", date: "16 Sep 2026" },
  { id: "ORD-10239", buyer: "Kunal Bose", piece: "Marble Repose", artist: "Kabir Verma", amount: 98000, status: "Processing", date: "15 Sep 2026" },
  { id: "ORD-10238", buyer: "Divya Menon", piece: "Ink and Rust", artist: "Riya Sharma", amount: 12400, status: "Completed", date: "15 Sep 2026" },
];

const STATUSES = ["All statuses", "Completed", "Processing", "Pending", "Cancelled"];

function StatusBadge({ status }) {
  const map = {
    Completed: "bg-[#E7EEDD] text-[#4C6B3F]",
    Processing: "bg-[#F6E7D0] text-[#8A5A22]",
    Pending: "bg-[#F6E7D0] text-[#8A5A22]",
    Cancelled: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (status !== STATUSES[0] && o.status !== status) return false;
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.buyer.toLowerCase().includes(q) ||
        o.piece.toLowerCase().includes(q)
      );
    });
  }, [search, status]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px] max-w-[600px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
          <input
            type="text"
            placeholder="Search order ID, buyer, artwork..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] transition-colors"
          />
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
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-[#A28F7D] border-b border-[#E8E1DB]">
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Artwork</th>
              <th className="px-6 py-4 font-medium">Artist</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-[#E8E1DB] last:border-b-0 hover:bg-[#F9F8F6] transition-colors">
                <td className="px-6 py-5 text-[14px] text-[#A28F7D]">{o.id}</td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{o.buyer}</td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{o.piece}</td>
                <td className="px-6 py-5 text-[14px] text-[#A28F7D]">{o.artist}</td>
                <td className="px-6 py-5 text-[14px] font-medium text-[#362F26]">{formatINR(o.amount)}</td>
                <td className="px-6 py-5 text-[14px] text-[#A28F7D] whitespace-nowrap">{o.date}</td>
                <td className="px-6 py-5"><StatusBadge status={o.status} /></td>
                <td className="px-6 py-5">
                  <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#9F5639] hover:text-[#8A4930] transition-colors">
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-[14px] text-[#A28F7D]">
                  No orders match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}