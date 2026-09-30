import React, { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const CUSTOM_REQUESTS = [
  { id: "CR-501", customer: "Priya Sharma", type: "Portrait Commission", artist: "Aarav Mehta", budget: 45000, deadline: "05 Oct 2026", requested: "18 Sep 2026", status: "New" },
  { id: "CR-500", customer: "Rahul Kapoor", type: "Custom Sculpture", artist: "Kabir Verma", budget: 120000, deadline: "20 Oct 2026", requested: "17 Sep 2026", status: "Reviewing" },
  { id: "CR-499", customer: "Sneha Iyer", type: "Digital Illustration", artist: "Riya Sharma", budget: 22000, deadline: "28 Sep 2026", requested: "16 Sep 2026", status: "Accepted" },
  { id: "CR-498", customer: "Vikram Nair", type: "Abstract Canvas", artist: "Ananya Kapoor", budget: 38000, deadline: "12 Oct 2026", requested: "14 Sep 2026", status: "In Progress" },
  { id: "CR-497", customer: "Ishaan Joshi", type: "Family Portrait", artist: "Aarav Mehta", budget: 52000, deadline: "01 Oct 2026", requested: "10 Sep 2026", status: "Completed" },
  { id: "CR-496", customer: "Divya Menon", type: "Pet Portrait", artist: "Devika Rao", budget: 15000, deadline: "22 Sep 2026", requested: "08 Sep 2026", status: "Rejected" },
];

const ARTIST_NAMES = [
  "Aarav Mehta",
  "Riya Sharma",
  "Kabir Verma",
  "Ananya Kapoor",
  "Meera Iyer",
  "Devika Rao",
];

const STATUSES = ["All statuses", "New", "Reviewing", "Accepted", "In Progress", "Completed", "Rejected"];

function StatusBadge({ status }) {
  const map = {
    New: "bg-[#F6E7D0] text-[#8A5A22]",
    Reviewing: "bg-[#F6E7D0] text-[#8A5A22]",
    "In Progress": "bg-[#F6E7D0] text-[#8A5A22]",
    Accepted: "bg-[#E7EEDD] text-[#4C6B3F]",
    Completed: "bg-[#E7EEDD] text-[#4C6B3F]",
    Rejected: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function CustomArtRequests() {
  const [requests, setRequests] = useState(CUSTOM_REQUESTS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (status !== STATUSES[0] && r.status !== status) return false;
      const q = search.toLowerCase();
      return r.customer.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    });
  }, [requests, search, status]);

  function assign(id, artist) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, artist, status: r.status === "New" ? "Reviewing" : r.status }
          : r
      )
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px] max-w-[800px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] transition-colors"
          />
        </div>

        <div className="relative ml-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
          >
            {STATUSES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-[#A28F7D] border-b border-[#E8E1DB]">
              <th className="px-6 py-4 font-medium">Request</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Assigned Artist</th>
              <th className="px-6 py-4 font-medium">Budget</th>
              <th className="px-6 py-4 font-medium">Deadline</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-[#E8E1DB] last:border-b-0 hover:bg-[#F9F8F6] transition-colors">
                <td className="px-6 py-5 text-[14px] text-[#A28F7D]">{r.id}</td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{r.customer}</td>
                <td className="px-6 py-5 text-[14px] text-[#362F26]">{r.type}</td>
                <td className="px-6 py-5">
                  <div className="relative inline-block">
                    <select
                      value={r.artist}
                      onChange={(e) => assign(r.id, e.target.value)}
                      className="appearance-none h-10 pl-4 pr-9 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer"
                    >
                      {ARTIST_NAMES.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A28F7D] pointer-events-none" />
                  </div>
                </td>
                <td className="px-6 py-5 text-[14px] font-medium text-[#362F26]">{formatINR(r.budget)}</td>
                <td className="px-6 py-5 text-[14px] text-[#A28F7D] whitespace-nowrap">{r.deadline}</td>
                <td className="px-6 py-5"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[14px] text-[#A28F7D]">
                  No requests match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}