import { useState } from "react";
import { inputCls, btnPrimary, btnGhost } from "./shared";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const STEPS = ["Not started", "Sketching", "In progress", "Finishing"];

const INITIAL = [
  { id: "CR-501", title: "Portrait Commission", customer: "Priya Sharma", requested: "18 Sep 2026", budget: 45000, deadline: "05 Oct 2026", status: "New", quote: "", eta: "", note: "", progress: 0 },
  { id: "CR-497", title: "Family Portrait", customer: "Ishaan Joshi", requested: "10 Sep 2026", budget: 52000, deadline: "01 Oct 2026", status: "In Progress", quote: 52000, eta: "Ready by 20 Nov", note: "Sketch approved, colour layers are underway.", progress: 2 },
  { id: "CR-490", title: "Landscape Commission", customer: "Rohit Malhotra", requested: "30 Aug 2026", budget: 34000, deadline: "15 Sep 2026", status: "Completed", quote: 34000, eta: "Delivered 10 Sep", note: "", progress: 4 },
];

const TONE = {
  New: "bg-[#F6E7D0] text-[#8A5A22]",
  "In Progress": "bg-[#F6E7D0] text-[#8A5A22]",
  Completed: "bg-[#E7EEDD] text-[#4C6B3F]",
  Declined: "bg-[#F6DFDA] text-[#9B3B2E]",
};

export default function CustomRequests() {
  const [requests, setRequests] = useState(INITIAL);
  const update = (id, patch) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-6">
      {requests.map((r) => (
        <div key={r.id} className="rounded-2xl border border-[#E8E1DB] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[16px] text-[#362F26]">{r.title}</h3>
              <p className="mt-1 text-[13px] text-[#A28F7D]">
                For {r.customer} · requested {r.requested}
              </p>
            </div>
            <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium ${TONE[r.status]}`}>
              {r.status}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
            <p>
              <span className="text-[#A28F7D]">Budget: </span>
              <span className="text-[#362F26]">{inr(r.budget)}</span>
            </p>
            <p>
              <span className="text-[#A28F7D]">Deadline: </span>
              <span className="text-[#362F26]">{r.deadline}</span>
            </p>
          </div>

          <div className="mt-5 space-y-4 border-t border-[#E8E1DB] pt-4">
            {r.status === "New" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    value={r.quote}
                    onChange={(e) => update(r.id, { quote: e.target.value })}
                    placeholder="Your quote (₹)"
                    aria-label="Your quote"
                    className={inputCls}
                  />
                  <input
                    value={r.eta}
                    onChange={(e) => update(r.id, { eta: e.target.value })}
                    placeholder="When will you start? e.g. Starts 12 Oct"
                    aria-label="Start date or ETA"
                    className={inputCls}
                  />
                </div>
                <input
                  value={r.note}
                  onChange={(e) => update(r.id, { note: e.target.value })}
                  placeholder="Message to buyer (add a reason if you decline)"
                  aria-label="Message to buyer"
                  className={inputCls}
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={!r.quote || !r.eta}
                    onClick={() => update(r.id, { status: "In Progress", progress: 0 })}
                    className={btnPrimary}
                  >
                    Accept
                  </button>
                  <button type="button" onClick={() => update(r.id, { status: "Declined" })} className={btnGhost}>
                    Decline
                  </button>
                </div>
              </>
            )}

            {r.status === "In Progress" && (
              <>
                <div>
                  <p className="mb-2 text-[13px] text-[#A28F7D]">Update progress (buyer sees this)</p>
                  <div className="flex flex-wrap gap-2">
                    {STEPS.map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={r.progress === i}
                        onClick={() => update(r.id, { progress: i })}
                        className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                          r.progress === i
                            ? "border-[#9F5639] bg-[#9F5639] text-white"
                            : "border-[#E8E1DB] bg-white text-[#362F26] hover:bg-[#F9F8F6]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={r.eta}
                    onChange={(e) => update(r.id, { eta: e.target.value })}
                    placeholder="Start date / ETA"
                    aria-label="Start date or ETA"
                    className={inputCls}
                  />
                  <input
                    value={r.note}
                    onChange={(e) => update(r.id, { note: e.target.value })}
                    placeholder="Short update for the buyer"
                    aria-label="Update for buyer"
                    className={inputCls}
                  />
                </div>
                <button type="button" onClick={() => update(r.id, { status: "Completed", progress: 4 })} className={btnPrimary}>
                  Mark completed
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}