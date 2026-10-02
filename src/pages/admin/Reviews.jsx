import React, { useState } from "react";
import { Star, Check, EyeOff, Trash2 } from "lucide-react";

const REVIEWS = [
  { id: "REV-1", customer: "Priya Sharma", piece: "Golden Silence", artist: "Aarav Mehta", rating: 5, review: "Beautifully packed and even better in person.", date: "18 Sep 2026", status: "Published" },
  { id: "REV-2", customer: "Rahul Kapoor", piece: "Monsoon Reverie", artist: "Riya Sharma", rating: 4, review: "Great print quality, shipping took a little long.", date: "17 Sep 2026", status: "Published" },
  { id: "REV-3", customer: "Sneha Iyer", piece: "Bronze Whisper", artist: "Kabir Verma", rating: 5, review: "Stunning craftsmanship, worth every rupee.", date: "16 Sep 2026", status: "Pending" },
  { id: "REV-4", customer: "Kunal Bose", piece: "Marble Repose", artist: "Kabir Verma", rating: 2, review: "Piece arrived with a small chip on the base.", date: "15 Sep 2026", status: "Hidden" },
];

const REVIEWS_KEY = "artnest_reviews";
const loadNew = () => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch {
    return [];
  }
};
const saveNew = (list) => {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
  } catch {
  }
};

function StatusBadge({ status }) {
  const map = {
    Published: "bg-[#E7EEDD] text-[#4C6B3F]",
    Pending: "bg-[#F6E7D0] text-[#8A5A22]",
    Hidden: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(() => [
    ...loadNew().map((r) => ({ ...r, customer: r.buyer, piece: r.artwork, review: r.comment })),
    ...REVIEWS,
  ]);

  function commit(next) {
    setReviews(next);
    saveNew(next.filter((r) => r.orderId));
  }

  function setStatus(id, status) {
    commit(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function remove(id) {
    commit(reviews.filter((r) => r.id !== id));
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-['Plus_Jakarta_Sans']">
      <div className="space-y-5">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border border-[#E8E1DB] rounded-2xl p-6 shadow-sm">
            
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-medium text-[#362F26]">{r.customer}</p>
                <p className="text-[13px] text-[#A28F7D] mt-0.5">
                  on <span className="text-[#362F26]">{r.piece}</span> by {r.artist}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[14px] font-medium text-[#362F26]">
                  <Star size={16} className="fill-[#9F5639] text-[#9F5639]" /> {r.rating}
                </span>
                {r.artistRating && (
                  <span className="text-[13px] text-[#A28F7D]">Artist: {r.artistRating}★</span>
                )}

                <StatusBadge status={r.status} />
              </div>
            </div>

            <p className="mt-4 text-[14px] text-[#362F26] leading-relaxed">
              {r.review}
            </p>

            <div className="mt-4 pt-4 border-t border-[#E8E1DB] flex items-center justify-between">
              <span className="text-[13px] text-[#A28F7D]">{r.date}</span>
              
              <div className="flex items-center gap-5">
                <button 
                  title="Approve" 
                  onClick={() => setStatus(r.id, "Published")} 
                  className="text-[#4C6B3F] hover:text-[#3a5230] transition-colors"
                >
                  <Check size={18} />
                </button>
                <button 
                  title="Hide" 
                  onClick={() => setStatus(r.id, "Hidden")} 
                  className="text-[#A28F7D] hover:text-[#362F26] transition-colors"
                >
                  <EyeOff size={18} />
                </button>
                <button 
                  title="Delete" 
                  onClick={() => remove(r.id)} 
                  className="text-[#9B3B2E] hover:text-[#7a2e23] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

          </div>
        ))}
        
        {reviews.length === 0 && (
          <p className="text-center text-[14px] text-[#A28F7D] py-10">
            No reviews left.
          </p>
        )}
      </div>
    </div>
  );
}