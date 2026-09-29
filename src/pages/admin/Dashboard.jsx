import { Link } from "react-router-dom";
import { IndianRupee, ShoppingBag, Users, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { PageHeader, Stat, Card, Badge, inr } from "./shared";
import { REVENUE, ORDERS } from "./adminData";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Here's how the gallery is trading today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total revenue" value={inr(845600)} note="+12.5% from last month" icon={IndianRupee} />
        <Stat label="Total orders" value="1,248" note="+8.2% from last month" icon={ShoppingBag} />
        <Stat label="Artists" value="356" note="14 joined this month" icon={Users} />
        <Stat label="Pending approvals" value="48" note="Needs attention" icon={Clock} />
      </div>

      <Card title="Revenue, last 9 months">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9f5639" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#9f5639" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e6ded8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#736153" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 12, fill: "#736153" }} axisLine={false} tickLine={false} width={52} />
              <Tooltip formatter={(v) => inr(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#9f5639" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Recent orders"
        action={<Link to="/admin/orders" className="text-[13px] font-medium text-[#9f5639]">View all</Link>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id} className="border-b border-[#efe7de] last:border-0">
                  <td className="whitespace-nowrap py-3 pr-4 font-medium">{o.id}</td>
                  <td className="whitespace-nowrap py-3 pr-4">{o.buyer}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-[#736153]">{o.item}</td>
                  <td className="whitespace-nowrap py-3 pr-4">{inr(o.amount)}</td>
                  <td className="py-3"><Badge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}