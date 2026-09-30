import React, { useState } from "react";
import { Gem, Eye, Check, X } from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const SCULPTURES = [
  { id: "SC-1", title: "Bronze Whisper", artist: "Kabir Verma", material: "Cast Bronze", height: "42 cm", price: 64200, status: "Pending", color: "#A28F7D" },
  { id: "SC-2", title: "Marble Repose", artist: "Kabir Verma", material: "White Marble", height: "58 cm", price: 98000, status: "Approved", color: "#9F5639" },
  { id: "SC-3", title: "Terracotta Dream", artist: "Meera Iyer", material: "Terracotta", height: "30 cm", price: 27500, status: "Approved", color: "#C98A68" },
  { id: "SC-4", title: "Standing Figure III", artist: "Farhan Ali", material: "Welded Steel", height: "76 cm", price: 112000, status: "Approved", color: "#736153" },
  { id: "SC-5", title: "Clay Vessel Study", artist: "Devika Rao", material: "Stoneware", height: "22 cm", price: 18900, status: "In review", color: "#D9C7B2" },
];

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-[#E7EEDD] text-[#4C6B3F]",
    Pending: "bg-[#F6E7D0] text-[#8A5A22]",
    "In review": "bg-[#F6E7D0] text-[#8A5A22]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Sculptures() {
  const [items, setItems] = useState(SCULPTURES);

  function setStatus(id, status) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-['Plus_Jakarta_Sans']">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((s) => (
          <div key={s.id} className="bg-white border border-[#E8E1DB] rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 flex items-center justify-center" style={{ backgroundColor: s.color }}>
              <Gem size={32} className="text-white/80" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-[#362F26] truncate">{s.title}</p>
                  <p className="text-[13px] text-[#A28F7D] truncate mt-0.5">{s.artist}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>

              <div className="mt-3 text-[13px] text-[#A28F7D]">
                {s.material} · {s.height}
              </div>

              <div className="mt-3 text-[15px] font-semibold text-[#362F26]">
                {formatINR(s.price)}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E8E1DB] flex items-center gap-4">
                <button title="View" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                  <Eye size={18} />
                </button>
                <button 
                  title="Approve" 
                  onClick={() => setStatus(s.id, "Approved")}
                  className="text-[#4C6B3F] hover:text-[#3a5230] transition-colors"
                >
                  <Check size={18} />
                </button>
                <button 
                  title="Reject" 
                  onClick={() => setStatus(s.id, "In review")}
                  className="text-[#9B3B2E] hover:text-[#7a2e23] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}