import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Eye, MessageSquare, Printer, X } from "lucide-react";
import { Badge, PAGE, inr } from "./shared";

const INITIAL = [
  { id: "ORD-10245", buyer: "Priya Sharma", item: "Golden Silence", amount: 18500, date: "18 Sep 2026", status: "Delivered" },
  { id: "ORD-10244", buyer: "Rahul Kapoor", item: "Monsoon Reverie", amount: 32400, date: "18 Sep 2026", status: "Processing" },
  { id: "ART-2041", buyer: "Sneha Iyer", item: "Bronze Whisper", amount: 64200, date: "17 Sep 2026", status: "Shipped" },
  { id: "ORD-10242", buyer: "Vikram Nair", item: "City in Ochre", amount: 21800, date: "17 Sep 2026", status: "Delivered" },
  { id: "ORD-10241", buyer: "Ishaan Joshi", item: "Still Water Study", amount: 15600, date: "16 Sep 2026", status: "Cancelled" },
];
const TABS = ["All", "Processing", "Shipped", "Delivered"];
const ACTIONS = {
  Processing: [["Mark shipped", "Shipped", "primary"], ["Cancel", "Cancelled", "danger"]],
  Shipped: [], 
  Delivered: [],
  Cancelled: [["Reopen", "Processing", "ghost"]],
};
const BTN = {
  primary: "bg-[#9F5639] text-white hover:bg-[#8A4A30]",
  ghost: "border border-[#E8E1DB] bg-white text-[#362F26] hover:bg-[#F9F8F6]",
  danger: "border border-[#F0CFC8] bg-white text-[#9B3B2E] hover:bg-[#F6DFDA]",
};

const ALL_ACTIONS = [
  ["Mark shipped", "Shipped", "primary"],
  ["Cancel order", "Cancelled", "danger"],
  ["Reopen order", "Processing", "ghost"],
];

const DETAILS = {
  "ORD-10245": { phone: "+91 98200 11223", payment: "UPI", address: "12 MG Road, Bengaluru, Karnataka 560001" },
  "ORD-10244": { phone: "+91 98110 44556", payment: "Card", address: "45 Connaught Place, New Delhi 110001" },
  "ART-2041": { phone: "+91 97650 77889", payment: "Net banking", address: "8 Marine Drive, Mumbai, Maharashtra 400020" },
  "ORD-10242": { phone: "+91 98450 22334", payment: "UPI", address: "21 Anna Salai, Chennai, Tamil Nadu 600002" },
  "ORD-10241": { phone: "+91 99300 55667", payment: "UPI", address: "5 Park Street, Kolkata, West Bengal 700016" },
};
const FALLBACK = { phone: "—", payment: "—", address: "Address not provided" };
const STEPS = ["Placed", "Processing", "Shipped", "Delivered"];
const STEP_INDEX = { Processing: 1, Shipped: 2, Delivered: 3 };

export default function Orders() {
  const [orders, setOrders] = useState(() => {
    let received = [];
    try {
      received = JSON.parse(localStorage.getItem("artnest_received_orders")) || [];
    } catch {
    }
    return INITIAL.map((o) => (received.includes(o.id) ? { ...o, status: "Delivered", byBuyer: true } : o));
  });
  const [tab, setTab] = useState("All");
  const [viewId, setViewId] = useState(null);
  const current = orders.find((o) => o.id === viewId);

  const shown = orders.filter((o) => tab === "All" || o.status === tab);
  const count = (t) => (t === "All" ? orders.length : orders.filter((o) => o.status === t).length);
  const advance = (id, status) =>
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));

  const change = (o, next) => {
    if (next === "Cancelled" && !window.confirm(`Cancel ${o.id}?`)) return;
    advance(o.id, next);
  };

  return (
    <div className={PAGE}>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
              tab === t
                ? "border-[#9F5639] bg-[#9F5639] text-white"
                : "border-[#E8E1DB] bg-white text-[#362F26] hover:bg-[#F9F8F6]"
            }`}
          >
            {t}
            <span className={`ml-2 text-[12px] ${tab === t ? "text-white/80" : "text-[#A28F7D]"}`}>{count(t)}</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E8E1DB] bg-white">
        <table className="w-full min-w-[880px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[130px]" />
            <col className="w-[200px]" />
            <col />
            <col className="w-[120px]" />
            <col className="w-[130px]" />
            <col className="w-[130px]" />
            <col className="w-[140px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#E8E1DB] bg-[#FBF9F6] text-[11px] uppercase tracking-[0.08em] text-[#A28F7D]">
              {["Order", "Buyer", "Artwork", "Amount", "Date", "Status", "Action"].map((h) => (
                <th key={h} className={`px-6 py-4 font-medium ${h === "Action" ? "text-right" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.id} className="h-[72px] border-b border-[#E8E1DB] transition-colors last:border-b-0 hover:bg-[#FBF9F6]">
                <td className="px-6 text-[13.5px] font-medium text-[#A28F7D]">{o.id}</td>
                <td className="px-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F3ECE5] text-[11px] font-semibold text-[#8A5A22]">
                      {o.buyer.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                    <span className="truncate text-[14px] text-[#362F26]">{o.buyer}</span>
                  </div>
                </td>
                <td className="truncate px-6 text-[14px] text-[#362F26]">{o.item}</td>
                <td className="px-6 text-[14px] font-medium tabular-nums text-[#362F26]">{inr(o.amount)}</td>
                <td className="whitespace-nowrap px-6 text-[13.5px] text-[#A28F7D]">{o.date}</td>
                <td className="px-6">
                  <Badge status={o.status} />
                  {o.byBuyer && <span className="mt-1 block text-[11px] text-[#4C6B3F]">Buyer confirmed</span>}
                </td>
                <td className="px-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setViewId(o.id)}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E8E1DB] bg-white px-4 text-[13px] text-[#362F26] transition-colors hover:bg-[#F9F8F6]"
                    >
                      <Eye size={16} className="text-[#A28F7D]" /> View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[14px] text-[#A28F7D]">No orders here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

            {current && (() => {
        const d = DETAILS[current.id] || FALLBACK;
        const step = STEP_INDEX[current.status] ?? 0;
        const cancelled = current.status === "Cancelled";

        return (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setViewId(null)} />
            <div className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#E8E1DB] px-6 py-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] text-[#362F26]">{current.id}</h3>
                  <Badge status={current.status} />
                </div>
                <button type="button" onClick={() => setViewId(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto p-6">
                {cancelled ? (
                  <div className="rounded-xl bg-[#F6DFDA] px-4 py-3 text-[13.5px] text-[#9B3B2E]">
                    This order was cancelled. You can reopen it to move it back to Processing.
                  </div>
                ) : (
                  <div className="flex items-start">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex flex-1 flex-col items-center">
                        <div className="flex w-full items-center">
                          <div className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : i <= step ? "bg-[#9F5639]" : "bg-[#E8E1DB]"}`} />
                          <div
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${
                              i <= step ? "border-[#9F5639] bg-[#9F5639] text-white" : "border-[#E8E1DB] bg-white text-transparent"
                            }`}
                          >
                            <Check size={14} />
                          </div>
                          <div className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "bg-transparent" : i < step ? "bg-[#9F5639]" : "bg-[#E8E1DB]"}`} />
                        </div>
                        <span className={`mt-2 text-[12px] ${i <= step ? "text-[#362F26]" : "text-[#A28F7D]"}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
                  {[
                    ["Buyer", current.buyer],
                    ["Phone", d.phone],
                    ["Artwork", current.item],
                    ["Amount", inr(current.amount)],
                    ["Order date", current.date],
                    ["Payment", d.payment],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[12px] text-[#A28F7D]">{k}</dt>
                      <dd className="mt-0.5 text-[#362F26]">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-xl bg-[#F9F8F6] p-4">
                  <p className="text-[12px] text-[#A28F7D]">Shipping address</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#362F26]">{d.address}</p>
                </div>

                <div>
                  <p className="mb-3 text-[12px] uppercase tracking-[0.08em] text-[#A28F7D]">Update status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_ACTIONS.map(([label, next, tone]) => {
                      const allowed = ACTIONS[current.status].some(([, n]) => n === next);
                      return (
                        <button
                          key={label}
                          type="button"
                          disabled={!allowed}
                          onClick={() => change(current, next)}
                          className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-[13.5px] transition-colors ${
                            allowed
                              ? BTN[tone]
                              : "cursor-not-allowed border border-[#E8E1DB] bg-white text-[#A28F7D] opacity-50"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {current.status === "Shipped" && (
                    <p className="mt-2 text-[12.5px] text-[#A28F7D]">Waiting for the buyer to confirm they received it.</p>
                  )}
                  {current.status === "Delivered" && (
                    <p className="mt-2 text-[12.5px] text-[#4C6B3F]">
                      {current.byBuyer ? "Buyer confirmed receipt." : "This order is delivered."}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E1DB] px-6 py-4">
                <div className="flex gap-2">
                  <Link
                    to="/artist/messages"
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E8E1DB] px-4 text-[13px] text-[#362F26] hover:bg-[#F9F8F6]"
                  >
                    <MessageSquare size={15} /> Message buyer
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E8E1DB] px-4 text-[13px] text-[#362F26] hover:bg-[#F9F8F6]"
                  >
                    <Printer size={15} /> Invoice
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}