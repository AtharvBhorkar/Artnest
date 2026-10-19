import React, { useEffect, useState } from "react";
import { Star, Check, EyeOff, Trash2, CheckCircle2, X } from "lucide-react";

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
  } catch {}
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

function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#362F26]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E8E1DB] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E1DB]">
          <h2 className="text-[16px] font-semibold text-[#362F26]">{title}</h2>
          <button onClick={onClose} className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="bg-[#F9F8F6] px-6 py-4 border-t border-[#E8E1DB] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(() => [
    ...loadNew().map((r) => ({ ...r, customer: r.buyer, piece: r.artwork, review: r.comment })),
    ...REVIEWS,
  ]);
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function commit(next) {
    setReviews(next);
    saveNew(next.filter((r) => r.orderId));
  }

  function setStatus(id, status) {
    const target = reviews.find(r => r.id === id);
    if (target && target.status === status) return; // Prevent duplicate action

    commit(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
    setToast({ msg: `Review marked as ${status}.` });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    commit(reviews.filter((r) => r.id !== deleteTarget.id));
    setToast({ msg: "Review deleted successfully." });
    setDeleteTarget(null);
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
                  title="Approve / Publish" 
                  onClick={() => setStatus(r.id, "Published")} 
                  className={`transition-colors ${
                    r.status === "Published" ? "text-[#E7EEDD]" : "text-[#4C6B3F] hover:text-[#3a5230]"
                  }`}
                  disabled={r.status === "Published"}
                >
                  <Check size={18} />
                </button>
                
                <button 
                  title="Hide" 
                  onClick={() => setStatus(r.id, "Hidden")} 
                  className={`transition-colors ${
                    r.status === "Hidden" ? "text-[#F6DFDA]" : "text-[#A28F7D] hover:text-[#362F26]"
                  }`}
                  disabled={r.status === "Hidden"}
                >
                  <EyeOff size={18} />
                </button>
                
                <button 
                  title="Delete" 
                  onClick={() => setDeleteTarget(r)} 
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete review"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="h-10 px-5 rounded-full border border-[#E8E1DB] text-[14px] text-[#362F26] hover:bg-[#F7F3EE] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="h-10 px-5 rounded-full bg-[#9B3B2E] text-white text-[14px] font-medium hover:bg-[#7a2e23] transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-[#736153]">
          Are you sure you want to delete the review by{" "}
          <span className="font-semibold text-[#362F26]">{deleteTarget?.customer}</span> for{" "}
          <span className="font-semibold text-[#362F26]">{deleteTarget?.piece}</span>? This action cannot be undone.
        </p>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-xl bg-[#362F26] text-white px-4 py-3 text-[13.5px] shadow-lg">
          <CheckCircle2 size={16} className="text-[#B9D3A6]" />
          {toast.msg}
        </div>
      )}
    </div>
  );
}