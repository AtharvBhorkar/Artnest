import { useState } from "react";
import { Badge, Card, PAGE, btnPrimary, inr } from "./shared";

const MONTHS = [["Apr", 42], ["May", 58], ["Jun", 51], ["Jul", 73], ["Aug", 66], ["Sep", 89]];

export default function Earnings() {
  const [available, setAvailable] = useState(58200);
  const [payouts, setPayouts] = useState([
    { id: "PAY-501", date: "01 Sep 2026", amount: 96000, status: "Paid" },
    { id: "PAY-500", date: "01 Aug 2026", amount: 72500, status: "Paid" },
    { id: "PAY-499", date: "01 Jul 2026", amount: 64000, status: "Paid" },
  ]);
  const max = Math.max(...MONTHS.map(([, v]) => v));

  const requestPayout = () => {
    if (available <= 0) return;
    setPayouts((p) => [
      { id: "PAY-" + (502 + p.length - 3), date: "30 Sep 2026", amount: available, status: "Pending" },
      ...p,
    ]);
    setAvailable(0);
  };

  const stats = [
    { label: "Available balance", value: inr(available), note: "Ready to withdraw" },
    { label: "Pending clearance", value: inr(24300), note: "Clears in 3-5 days" },
    { label: "Total earned", value: inr(612000), note: "Since you joined" },
  ];

  return (
    <div className={PAGE}>
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#E8E1DB] bg-white p-6">
            <p className="text-[13px] text-[#A28F7D]">{s.label}</p>
            <p className="mt-3 text-[28px] leading-none text-[#362F26]">{s.value}</p>
            <p className="mt-2 text-[12px] text-[#A28F7D]">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card title="Monthly earnings" className="lg:col-span-3">
          <div className="flex h-52 items-end gap-4">
            {MONTHS.map(([m, v]) => (
              <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[12px] text-[#A28F7D]">₹{v}k</span>
                <div className="w-full rounded-t-lg bg-[#9F5639]/80" style={{ height: `${(v / max) * 70}%` }} />
                <span className="text-[12px] text-[#362F26]">{m}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Payout history"
          className="lg:col-span-2"
          action={
            <button type="button" onClick={requestPayout} disabled={available <= 0} className={btnPrimary}>
              Request payout
            </button>
          }
        >
          <div className="space-y-4">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] text-[#362F26]">{inr(p.amount)}</p>
                  <p className="text-[12px] text-[#A28F7D]">{p.id} · {p.date}</p>
                </div>
                <Badge status={p.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}