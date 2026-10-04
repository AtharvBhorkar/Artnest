import { useState } from "react";
import { Star } from "lucide-react";
import { Card, PAGE, btnGhost, btnPrimary } from "./shared";

const INITIAL = [
  { id: 1, buyer: "Priya Sharma", artwork: "Golden Silence", rating: 5, date: "18 Sep 2026", comment: "Even better in person. The colours are warm and the finish is beautiful.", reply: "" },
  { id: 2, buyer: "Rahul Kapoor", artwork: "Monsoon Reverie", rating: 4, date: "14 Sep 2026", comment: "Packaging was excellent and delivery was quick.", reply: "Thank you Rahul, glad it reached you safely!" },
  { id: 3, buyer: "Vikram Nair", artwork: "City in Ochre", rating: 5, date: "09 Sep 2026", comment: "Looks stunning in our living room.", reply: "" },
];

const REVIEWS_KEY = "artnest_reviews";
const loadNew = () => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch {
    return [];
  }
};

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={15} className={i < n ? "fill-[#C08A3E] text-[#C08A3E]" : "text-[#D9CFC5]"} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(() => [...loadNew().filter((r) => r.status !== "Hidden"), ...INITIAL]);
  const [openId, setOpenId] = useState(null);
  const [text, setText] = useState("");

  const avg = (reviews.reduce((s, r) => s + (r.artistRating ?? r.rating), 0) / reviews.length).toFixed(1);

  const startReply = (r) => {
    setOpenId(r.id);
    setText(r.reply);
  };
  const saveReply = (id) => {
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, reply: text.trim() } : r)));
    try {
      const stored = loadNew().map((r) => (r.id === id ? { ...r, reply: text.trim() } : r));
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(stored));
    } catch {
    }
    setOpenId(null);
  };

  return (
    <div className={PAGE}>
      <Card>
        <div className="flex items-center gap-5">
          <p className="text-[40px] leading-none text-[#362F26]">{avg}</p>
          <div>
            <Stars n={Math.round(avg)} />
            <p className="mt-1 text-[13px] text-[#A28F7D]">Based on {reviews.length} reviews</p>
          </div>
        </div>
      </Card>

      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-[#E8E1DB] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[16px] text-[#362F26]">{r.buyer}</h3>
              <p className="mt-0.5 text-[13px] text-[#A28F7D]">on {r.artwork} · {r.date}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[11px] text-[#A28F7D]">Artwork</span>
                <Stars n={r.rating} />
              </div>
              {r.artistRating && (
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[11px] text-[#A28F7D]">You</span>
                  <Stars n={r.artistRating} />
                </div>
              )}
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[#362F26]">{r.comment}</p>

          {openId === r.id ? (
            <div className="mt-4 space-y-3 border-t border-[#E8E1DB] pt-4">
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a reply…"
                className="w-full rounded-xl border border-[#E8E1DB] p-3 text-[14px] outline-none focus:border-[#9F5639]"
              />
              <div className="flex gap-3">
                <button type="button" disabled={!text.trim()} onClick={() => saveReply(r.id)} className={btnPrimary}>Post reply</button>
                <button type="button" onClick={() => setOpenId(null)} className={btnGhost}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mt-4 border-t border-[#E8E1DB] pt-4">
              {r.reply && (
                <div className="mb-3 rounded-xl bg-[#F9F8F6] p-4">
                  <p className="text-[12px] text-[#A28F7D]">Your reply</p>
                  <p className="mt-1 text-[14px] text-[#362F26]">{r.reply}</p>
                </div>
              )}
              <button type="button" onClick={() => startReply(r)} className="text-[13.5px] text-[#9F5639] hover:underline">
                {r.reply ? "Edit reply" : "Reply"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}