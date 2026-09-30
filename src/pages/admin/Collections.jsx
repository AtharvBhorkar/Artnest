import React, { useState } from "react";
import { Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react";

const COLLECTIONS = [
  { id: "COL-1", name: "Modern Indian Expressions", curator: "Aarav Mehta", artworks: 24, artists: 9, status: "Published", color: "#9F5639" },
  { id: "COL-2", name: "Digital Dreams", curator: "Riya Sharma", artworks: 18, artists: 6, status: "Published", color: "#C98A68" },
  { id: "COL-3", name: "Sculptural Stories", curator: "Kabir Verma", artworks: 12, artists: 5, status: "Draft", color: "#A28F7D" },
  { id: "COL-4", name: "Masters of Portraiture", curator: "Ananya Kapoor", artworks: 15, artists: 7, status: "Published", color: "#736153" },
  { id: "COL-5", name: "Nature in Watercolor", curator: "Meera Iyer", artworks: 20, artists: 8, status: "Draft", color: "#D9C7B2" },
];

function StatusBadge({ status }) {
  const map = {
    Published: "bg-[#E7EEDD] text-[#4C6B3F]",
    Draft: "bg-[#EFE9E1] text-[#736153]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Collections() {
  const [collections, setCollections] = useState(COLLECTIONS);

  function togglePublish(id) {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "Published" ? "Draft" : "Published" } : c))
    );
  }

  function remove(id) {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-['Plus_Jakarta_Sans'] space-y-6">
      
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#9F5639] text-white text-[14px] font-medium hover:bg-[#8A4930] transition-colors">
          <Plus size={16} /> Create collection
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((c) => (
          <div key={c.id} className="bg-white border border-[#E8E1DB] rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 flex items-center justify-center" style={{ backgroundColor: c.color }}>
              <LayoutGrid size={32} className="text-white/80" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <p className="font-['Playfair_Display'] text-[18px] text-[#362F26] leading-tight">{c.name}</p>
                <StatusBadge status={c.status} />
              </div>
              
              <p className="text-[13px] text-[#A28F7D] mt-1">Curated by {c.curator}</p>
              
              <div className="mt-3 flex items-center gap-4 text-[13px] text-[#A28F7D]">
                <span>{c.artworks} artworks</span>
                <span>{c.artists} artists</span>
              </div>

              <div className="mt-auto pt-5 border-t border-[#E8E1DB] flex items-center">
                <button
                  onClick={() => togglePublish(c.id)}
                  className="text-[13px] font-medium text-[#9F5639] hover:text-[#8A4930] transition-colors"
                >
                  {c.status === "Published" ? "Unpublish" : "Publish"}
                </button>
                
                <div className="ml-auto flex items-center gap-4">
                  <button title="Edit" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button 
                    title="Delete" 
                    onClick={() => remove(c.id)}
                    className="text-[#A28F7D] hover:text-[#9B3B2E] transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}