import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { PageHeader, Stat, Card, inr } from "./shared";
import { REVENUE } from "./adminData";

const MIX = [
  ["Paintings", 35, "#9f5639"],
  ["Digital Art", 20, "#c98a68"],
  ["Sculptures", 18, "#a28f7d"],
  ["Photography", 12, "#d9c7b2"],
  ["Abstract Art", 10, "#736153"],
];

export default function Reports() {
  const total = REVENUE.reduce((s, m) => s + m.revenue, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="High-level performance across the gallery." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Revenue (9 months)" value={inr(total)} />
        <Stat label="Average order value" value={inr(24800)} />
        <Stat label="Repeat buyers" value="34%" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Revenue by month">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE}>
                <CartesianGrid stroke="#e6ded8" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#736153" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 12, fill: "#736153" }} axisLine={false} tickLine={false} width={52} />
                <Tooltip formatter={(v) => inr(v)} />
                <Bar dataKey="revenue" fill="#9f5639" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Sales by category">
          <ul className="space-y-3">
            {MIX.map(([label, pct, color]) => (
              <li key={label}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span>{label}</span>
                  <span className="text-[#736153]">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#efe7de]">
                  <div className="h-2 rounded-full" style={{ width: `${pct * 2.5}%`, background: color }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}