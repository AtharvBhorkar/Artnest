import { useState } from "react";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const INITIAL = [
  { id: "CR-501", title: "Portrait Commission", customer: "Priya Sharma", requested: "18 Sep 2026", budget: 45000, deadline: "05 Oct 2026", status: "New" },
  { id: "CR-497", title: "Family Portrait", customer: "Ishaan Joshi", requested: "10 Sep 2026", budget: 52000, deadline: "01 Oct 2026", status: "In Progress" },
  { id: "CR-490", title: "Landscape Commission", customer: "Rohit Malhotra", requested: "30 Aug 2026", budget: 34000, deadline: "15 Sep 2026", status: "Completed" },
];

const TONE = {
  New: "bg-[#F6E7D0] text-[#8A5A22]",
  "In Progress": "bg-[#F6E7D0] text-[#8A5A22]",
  Completed: "bg-[#E7EEDD] text-[#4C6B3F]",
  Declined: "bg-[#F6DFDA] text-[#9B3B2E]",
};

export default function CustomRequests() {
  const [requests, setRequests] = useState(INITIAL);

  const setStatus = (id, status) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));

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

          <div className="mt-5 flex min-h-[61px] items-center gap-3 border-t border-[#E8E1DB] pt-4">
            {r.status === "New" && (
              <>
                <button
                  type="button"
                  onClick={() => setStatus(r.id, "In Progress")}
                  className="rounded-full bg-[#9F5639] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#8A4A30]"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(r.id, "Declined")}
                  className="rounded-full border border-[#E8E1DB] bg-white px-5 py-2.5 text-[14px] text-[#362F26] transition-colors hover:bg-[#F9F8F6]"
                >
                  Decline
                </button>
              </>
            )}
            {r.status === "In Progress" && (
              <button
                type="button"
                onClick={() => setStatus(r.id, "Completed")}
                className="rounded-full bg-[#9F5639] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#8A4A30]"
              >
                Mark completed
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}