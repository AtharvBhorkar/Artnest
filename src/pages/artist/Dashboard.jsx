import { Link } from "react-router-dom";
import { IndianRupee, Image, ShoppingBag, Star } from "lucide-react";
import { ARTWORKS, Badge, Card, PAGE, inr } from "./shared";

const MONTHS = [["Apr", 42], ["May", 58], ["Jun", 51], ["Jul", 73], ["Aug", 66], ["Sep", 89]];
const RECENT = [
  { id: "ORD-10245", item: "Golden Silence", buyer: "Priya Sharma", amount: 18500, status: "Delivered" },
  { id: "ORD-10244", item: "Monsoon Reverie", buyer: "Rahul Kapoor", amount: 32400, status: "Processing" },
  { id: "ORD-10243", item: "Bronze Whisper", buyer: "Sneha Iyer", amount: 64200, status: "Shipped" },
];

export default function Dashboard() {
  const published = ARTWORKS.filter((a) => a.status === "Published").length;
  const max = Math.max(...MONTHS.map(([, v]) => v));
  const stats = [
    { label: "Total sales", value: inr(612000), note: "+12% this month", icon: IndianRupee },
    { label: "Published artworks", value: published, note: `${ARTWORKS.length} in total`, icon: Image },
    { label: "Open orders", value: 2, note: "Need your attention", icon: ShoppingBag },
    { label: "Average rating", value: "4.9", note: "From 128 reviews", icon: Star },
  ];

  return (
    <div className={PAGE}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-[#E8E1DB] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#A28F7D]">{label}</p>
              <Icon size={18} className="text-[#9F5639]" />
            </div>
            <p className="mt-3 text-[28px] leading-none text-[#362F26]">{value}</p>
            <p className="mt-2 text-[12px] text-[#A28F7D]">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card title="Sales, last 6 months" className="lg:col-span-3">
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
          title="Recent orders"
          className="lg:col-span-2"
          action={<Link to="/artist/orders" className="text-[13px] text-[#9F5639] hover:underline">View all</Link>}
        >
          <div className="space-y-4">
            {RECENT.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] text-[#362F26]">{o.item}</p>
                  <p className="text-[12px] text-[#A28F7D]">{o.buyer} · {inr(o.amount)}</p>
                </div>
                <Badge status={o.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}