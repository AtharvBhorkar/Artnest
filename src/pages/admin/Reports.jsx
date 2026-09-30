import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const REVENUE_SERIES = [
  { month: "Jan", revenue: 42000, orders: 88 },
  { month: "Feb", revenue: 51000, orders: 96 },
  { month: "Mar", revenue: 48000, orders: 91 },
  { month: "Apr", revenue: 63000, orders: 112 },
  { month: "May", revenue: 72000, orders: 128 },
  { month: "Jun", revenue: 68000, orders: 121 },
  { month: "Jul", revenue: 81000, orders: 139 },
  { month: "Aug", revenue: 75000, orders: 132 },
  { month: "Sep", revenue: 89000, orders: 151 },
  { month: "Oct", revenue: 96000, orders: 163 },
  { month: "Nov", revenue: 105000, orders: 178 },
  { month: "Dec", revenue: 118000, orders: 196 },
];

const CATEGORY_MIX = [
  { label: "Paintings", value: 35, color: "#9F5639" },
  { label: "Digital Art", value: 20, color: "#C98A68" },
  { label: "Sculptures", value: 18, color: "#A28F7D" },
  { label: "Photography", value: 12, color: "#D9C7B2" },
  { label: "Abstract Art", value: 10, color: "#736153" },
  { label: "Other", value: 5, color: "#E8E1DB" },
];

export default function Reports() {
  const [exported, setExported] = useState(false);

  function handleExport() {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }

  const totalRevenue = REVENUE_SERIES.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = REVENUE_SERIES.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-[14px] text-[#A28F7D]">Jan – Dec 2026 performance summary</p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#E8E1DB] bg-white text-[14px] font-medium text-[#362F26] hover:bg-[#F9F8F6] transition-colors"
        >
          <Download size={16} /> {exported ? "Report exported ✓" : "Export report"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E8E1DB] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[14px] text-[#A28F7D]">Total revenue (YTD)</p>
          <p className="font-['Playfair_Display'] text-[32px] text-[#362F26] mt-1">{formatINR(totalRevenue)}</p>
        </div>
        <div className="bg-white border border-[#E8E1DB] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[14px] text-[#A28F7D]">Total orders (YTD)</p>
          <p className="font-['Playfair_Display'] text-[32px] text-[#362F26] mt-1">{totalOrders.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white border border-[#E8E1DB] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[14px] text-[#A28F7D]">Average order value</p>
          <p className="font-['Playfair_Display'] text-[32px] text-[#362F26] mt-1">{formatINR(avgOrderValue)}</p>
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-2xl p-6 shadow-sm">
        <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26] mb-5">Orders by month</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_SERIES} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E8E1DB" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "#A28F7D", fontSize: 13, fontFamily: "Plus Jakarta Sans" }} 
                axisLine={{ stroke: "#E8E1DB" }} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: "#A28F7D", fontSize: 13, fontFamily: "Plus Jakarta Sans" }} 
                axisLine={false} 
                tickLine={false} 
                width={40} 
              />
              <Tooltip
                contentStyle={{ background: "#362F26", border: "none", borderRadius: 8, color: "#FCEFE1", fontSize: 13, fontFamily: "Plus Jakarta Sans" }}
                cursor={{ fill: "#F5F0E9" }}
              />
              <Bar dataKey="orders" fill="#9F5639" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-2xl p-6 shadow-sm">
        <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26] mb-5">Revenue share by category</h2>
        <ul className="space-y-5">
          {CATEGORY_MIX.map((c) => (
            <li key={c.label} className="flex items-center gap-4">
              <span className="text-[14px] text-[#362F26] w-[130px] shrink-0">{c.label}</span>
              <div className="flex-1 h-3 rounded-full bg-[#F5F0E9] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
              </div>
              <span className="text-[14px] font-medium text-[#362F26] w-12 text-right">{c.value}%</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}