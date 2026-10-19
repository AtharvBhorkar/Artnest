import React, { useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Clock,
  Palette,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRCompact(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
  return `₹${amount}`;
}

const BASE_STATS = {
  revenue: 845600,
  orders: 1248,
  artists: 356,
  artworks: 2840,
  pending: 48,
  custom: 76,
};

const RANGE_CONFIG = {
  Today: {
    revenueMultiplier: 0.035,
    ordersMultiplier: 0.03,
    pendingMultiplier: 0.04,
    customMultiplier: 0.03,
    revenueNote: "vs yesterday",
    ordersNote: "vs yesterday",
    artistsNote: "active today",
    artworksNote: "added today",
    chartTitle: "Revenue — last 12 hours",
    chartRangeLabel: "Today",
    ordersSlice: 3,
    artworksSlice: 3,
    artistsSlice: 3,
    chart: [
      { month: "6am", revenue: 320, orders: 3, artists: 210 },
      { month: "8am", revenue: 780, orders: 6, artists: 212 },
      { month: "10am", revenue: 1240, orders: 9, artists: 214 },
      { month: "12pm", revenue: 1620, orders: 12, artists: 216 },
      { month: "2pm", revenue: 1180, orders: 9, artists: 218 },
      { month: "4pm", revenue: 1450, orders: 11, artists: 220 },
      { month: "6pm", revenue: 1780, orders: 13, artists: 222 },
      { month: "8pm", revenue: 1520, orders: 10, artists: 224 },
      { month: "10pm", revenue: 890, orders: 7, artists: 226 },
    ],
  },
  "This Week": {
    revenueMultiplier: 0.24,
    ordersMultiplier: 0.22,
    pendingMultiplier: 0.35,
    customMultiplier: 0.28,
    revenueNote: "vs last week",
    ordersNote: "vs last week",
    artistsNote: "joined this week",
    artworksNote: "added this week",
    chartTitle: "Revenue — this week",
    chartRangeLabel: "Mon – Sun",
    ordersSlice: 4,
    artworksSlice: 4,
    artistsSlice: 4,
    chart: [
      { month: "Mon", revenue: 42000, orders: 58, artists: 240 },
      { month: "Tue", revenue: 51000, orders: 72, artists: 245 },
      { month: "Wed", revenue: 47000, orders: 66, artists: 250 },
      { month: "Thu", revenue: 58000, orders: 82, artists: 255 },
      { month: "Fri", revenue: 64000, orders: 91, artists: 260 },
      { month: "Sat", revenue: 72000, orders: 104, artists: 265 },
      { month: "Sun", revenue: 61000, orders: 88, artists: 270 },
    ],
  },
  "This Month": {
    revenueMultiplier: 1,
    ordersMultiplier: 1,
    pendingMultiplier: 1,
    customMultiplier: 1,
    revenueNote: "from last month",
    ordersNote: "from last month",
    artistsNote: "new this month",
    artworksNote: "added this month",
    chartTitle: "Revenue — this month",
    chartRangeLabel: "Jan – Dec",
    ordersSlice: 8,
    artworksSlice: 6,
    artistsSlice: 5,
    chart: [
      { month: "Jan", revenue: 42000, orders: 88, artists: 210 },
      { month: "Feb", revenue: 51000, orders: 96, artists: 218 },
      { month: "Mar", revenue: 48000, orders: 91, artists: 225 },
      { month: "Apr", revenue: 63000, orders: 112, artists: 241 },
      { month: "May", revenue: 72000, orders: 128, artists: 256 },
      { month: "Jun", revenue: 68000, orders: 121, artists: 268 },
      { month: "Jul", revenue: 81000, orders: 139, artists: 279 },
      { month: "Aug", revenue: 75000, orders: 132, artists: 291 },
      { month: "Sep", revenue: 89000, orders: 151, artists: 305 },
      { month: "Oct", revenue: 96000, orders: 163, artists: 318 },
      { month: "Nov", revenue: 105000, orders: 178, artists: 334 },
      { month: "Dec", revenue: 118000, orders: 196, artists: 356 },
    ],
  },
  "This Year": {
    revenueMultiplier: 11.5,
    ordersMultiplier: 11.4,
    pendingMultiplier: 4.5,
    customMultiplier: 6.8,
    revenueNote: "vs last year",
    ordersNote: "vs last year",
    artistsNote: "grew this year",
    artworksNote: "added this year",
    chartTitle: "Revenue — this year",
    chartRangeLabel: "2022 – 2026",
    ordersSlice: 8,
    artworksSlice: 6,
    artistsSlice: 5,
    chart: [
      { month: "2022", revenue: 620000, orders: 940, artists: 168 },
      { month: "2023", revenue: 748000, orders: 1120, artists: 214 },
      { month: "2024", revenue: 890000, orders: 1310, artists: 258 },
      { month: "2025", revenue: 1010000, orders: 1480, artists: 302 },
      { month: "2026", revenue: 1180000, orders: 1595, artists: 356 },
    ],
  },
};

const CATEGORY_MIX = [
  { label: "Paintings", value: 35, color: "#9F5639" },
  { label: "Digital Art", value: 20, color: "#C98A68" },
  { label: "Sculptures", value: 18, color: "#A28F7D" },
  { label: "Photography", value: 12, color: "#D9C7B2" },
  { label: "Abstract Art", value: 10, color: "#736153" },
  { label: "Other", value: 5, color: "#E8E1DB" },
];

const RECENT_ORDERS = [
  { id: "ORD-10245", piece: "Golden Silence", artist: "Aarav Mehta", buyer: "Priya Sharma", amount: 18500, date: "18 Sep 2026", status: "Completed" },
  { id: "ORD-10244", piece: "Monsoon Reverie", artist: "Riya Sharma", buyer: "Rahul Kapoor", amount: 32400, date: "18 Sep 2026", status: "Processing" },
  { id: "ORD-10243", piece: "Bronze Whisper", artist: "Kabir Verma", buyer: "Sneha Iyer", amount: 64200, date: "17 Sep 2026", status: "Pending" },
  { id: "ORD-10242", piece: "City in Ochre", artist: "Ananya Kapoor", buyer: "Vikram Nair", amount: 21800, date: "17 Sep 2026", status: "Completed" },
  { id: "ORD-10241", piece: "Terracotta Dream", artist: "Meera Iyer", buyer: "Ishaan Joshi", amount: 15600, date: "16 Sep 2026", status: "Cancelled" },
  { id: "ORD-10240", piece: "Still Water Study", artist: "Aarav Mehta", buyer: "Ananya Rao", amount: 27900, date: "16 Sep 2026", status: "Completed" },
  { id: "ORD-10239", piece: "Marble Repose", artist: "Kabir Verma", buyer: "Kunal Bose", amount: 98000, date: "15 Sep 2026", status: "Processing" },
  { id: "ORD-10238", piece: "Ink and Rust", artist: "Riya Sharma", buyer: "Divya Menon", amount: 12400, date: "15 Sep 2026", status: "Completed" },
];

const TOP_ARTISTS = [
  { id: 1, name: "Aarav Mehta", initials: "AM", category: "Paintings", artworks: 42, rating: 4.9, sales: 612000, followers: 3200 },
  { id: 2, name: "Riya Sharma", initials: "RS", category: "Digital Art", artworks: 35, rating: 4.8, sales: 498000, followers: 2750 },
  { id: 3, name: "Kabir Verma", initials: "KV", category: "Sculpture", artworks: 21, rating: 4.9, sales: 741000, followers: 1980 },
  { id: 4, name: "Ananya Kapoor", initials: "AK", category: "Abstract Art", artworks: 29, rating: 4.7, sales: 356000, followers: 2140 },
  { id: 5, name: "Meera Iyer", initials: "MI", category: "Photography", artworks: 18, rating: 4.6, sales: 214000, followers: 1520 },
];

const RECENT_ARTWORKS = [
  { id: "AW-1", title: "Golden Silence", artist: "Aarav Mehta", price: 18500, status: "Approved", color: "#C98A68" },
  { id: "AW-2", title: "Monsoon Reverie", artist: "Riya Sharma", price: 32400, status: "Approved", color: "#9F5639" },
  { id: "AW-3", title: "Bronze Whisper", artist: "Kabir Verma", price: 64200, status: "Pending", color: "#A28F7D" },
  { id: "AW-4", title: "City in Ochre", artist: "Ananya Kapoor", price: 21800, status: "Approved", color: "#D9C7B2" },
  { id: "AW-5", title: "Still Water Study", artist: "Meera Iyer", price: 15600, status: "Pending", color: "#736153" },
  { id: "AW-6", title: "Ink and Rust", artist: "Riya Sharma", price: 12400, status: "Rejected", color: "#E8E1DB" },
];

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-[#E7EEDD] text-[#4C6B3F]",
    Completed: "bg-[#E7EEDD] text-[#4C6B3F]",
    Pending: "bg-[#F6E7D0] text-[#8A5A22]",
    Processing: "bg-[#F6E7D0] text-[#8A5A22]",
    Cancelled: "bg-[#F6DFDA] text-[#9B3B2E]",
    Rejected: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, isCurrency, delta, trend, note, icon: Icon }) {
  return (
    <div className="bg-white border border-[#E8E1DB] rounded-xl px-6 py-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#9F5639]"></div>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] text-[#A28F7D]">{label}</p>
        {Icon && (
          <span className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F0E9] text-[#A28F7D]">
            <Icon size={18} />
          </span>
        )}
      </div>
      <p className="font-['Playfair_Display'] text-[30px] text-[#362F26] mt-3">
        {isCurrency ? formatINR(value) : value.toLocaleString("en-IN")}
      </p>
      <p className="mt-2 text-[13px] flex items-center gap-1.5">
        <span className={trend === "up" ? "text-[#4C6B3F] font-medium" : "text-[#9B3B2E] font-medium"}>
          {trend === "up" ? "↗" : "↘"} {delta}
        </span>
        {note && <span className="text-[#A28F7D]">{note}</span>}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState("This Month");
  const [chartMetric, setChartMetric] = useState("revenue");

  const RANGES = ["Today", "This Week", "This Month", "This Year"];
  const METRICS = [
    { key: "revenue", label: "Revenue" },
    { key: "orders", label: "Orders" },
    { key: "artists", label: "Artists" },
  ];

  const config = RANGE_CONFIG[range];

  const stats = [
    {
      id: "revenue",
      label: "Total revenue",
      value: Math.round(BASE_STATS.revenue * config.revenueMultiplier),
      isCurrency: true,
      delta: "+12.5%",
      trend: "up",
      note: config.revenueNote,
      icon: IndianRupee,
    },
    {
      id: "orders",
      label: "Total orders",
      value: Math.round(BASE_STATS.orders * config.ordersMultiplier),
      isCurrency: false,
      delta: "+8.2%",
      trend: "up",
      note: config.ordersNote,
      icon: ShoppingBag,
    },
    {
      id: "artists",
      label: "Total artists",
      value: BASE_STATS.artists,
      isCurrency: false,
      delta: "+14",
      trend: "up",
      note: config.artistsNote,
      icon: Users,
    },
    {
      id: "artworks",
      label: "Total artworks",
      value: BASE_STATS.artworks,
      isCurrency: false,
      delta: "+126",
      trend: "up",
      note: config.artworksNote,
      icon: ImageIcon,
    },
    {
      id: "pending",
      label: "Pending orders",
      value: Math.round(BASE_STATS.pending * config.pendingMultiplier),
      isCurrency: false,
      delta: "Requires attention",
      trend: "down",
      note: "",
      icon: Clock,
    },
    {
      id: "custom",
      label: "Custom art requests",
      value: Math.round(BASE_STATS.custom * config.customMultiplier),
      isCurrency: false,
      delta: `${Math.max(1, Math.round(23 * config.customMultiplier))} pending`,
      trend: "down",
      note: "",
      icon: Palette,
    },
  ];

  const visibleOrders = RECENT_ORDERS.slice(0, config.ordersSlice);
  const visibleArtworks = RECENT_ARTWORKS.slice(0, config.artworksSlice);
  const visibleArtists = TOP_ARTISTS.slice(0, config.artistsSlice);

  const scaledTopArtists = visibleArtists.map((a) => ({
    ...a,
    sales: Math.round(a.sales * (range === "This Month" ? 1 : config.revenueMultiplier)),
  }));

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">

      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-colors cursor-pointer ${
              range === r
                ? "bg-[#9F5639] border-[#9F5639] text-white"
                : "bg-white border-[#E8E1DB] text-[#A28F7D] hover:text-[#362F26]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StatCard key={`${s.id}-${range}`} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">
        <div className="bg-white border border-[#E8E1DB] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26]">
              {config.chartTitle}
            </h2>
            <span className="text-[13px] text-[#A28F7D]">{config.chartRangeLabel}</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setChartMetric(m.key)}
                className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                  chartMetric === m.key
                    ? "bg-[#9F5639] text-white"
                    : "bg-[#F5F0E9] text-[#A28F7D] hover:text-[#362F26]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={config.chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9F5639" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#9F5639" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E8E1DB" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#A28F7D", fontSize: 13 }}
                  axisLine={{ stroke: "#E8E1DB" }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "#A28F7D", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v) => (chartMetric === "revenue" ? formatINRCompact(v) : v)}
                />
                <Tooltip
                  contentStyle={{ background: "#362F26", border: "none", borderRadius: 8, color: "#FCEFE1", fontSize: 13 }}
                  formatter={(v) => (chartMetric === "revenue" ? formatINR(v) : v)}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  stroke="#9F5639"
                  strokeWidth={2}
                  fill="url(#revFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#E8E1DB] rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26] mb-6">Sales by category</h2>

          <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
            <div className="w-[200px] h-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_MIX}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {CATEGORY_MIX.map((c) => (
                      <Cell key={c.label} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="flex-1 w-full space-y-3">
              {CATEGORY_MIX.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-[14px]">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[#362F26] flex-1 truncate">{c.label}</span>
                  <span className="text-[#362F26] font-medium">{c.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E1DB]">
          <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26]">Recent orders</h2>
          <button className="text-[13px] font-medium text-[#9F5639] hover:text-[#8A4930] transition-colors cursor-pointer">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px] border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.08em] text-[#A28F7D] border-b border-[#E8E1DB] bg-[#F9F8F6]">
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Artwork</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((o) => (
                <tr key={o.id} className="border-b border-[#E8E1DB] last:border-b-0 hover:bg-[#F9F8F6] transition-colors">
                  <td className="px-6 py-5 text-[14px] text-[#A28F7D]">{o.id}</td>
                  <td className="px-6 py-5">
                    <p className="text-[14px] font-medium text-[#362F26]">{o.piece}</p>
                    <p className="text-[13px] text-[#A28F7D] mt-0.5">{o.artist}</p>
                  </td>
                  <td className="px-6 py-5 text-[14px] text-[#362F26]">{o.buyer}</td>
                  <td className="px-6 py-5 text-[14px] font-medium text-[#362F26]">{formatINR(o.amount)}</td>
                  <td className="px-6 py-5 text-[14px] text-[#A28F7D] whitespace-nowrap">{o.date}</td>
                  <td className="px-6 py-5"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-[13px] font-medium text-[#9F5639] hover:text-[#8A4930] transition-colors cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26]">Top performing artists</h2>
          <button className="text-[13px] font-medium text-[#9F5639] hover:text-[#8A4930] transition-colors cursor-pointer">
            View all artists →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {scaledTopArtists.map((a) => (
            <div key={a.id} className="bg-[#F9F8F6] border border-[#E8E1DB] rounded-xl p-5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] flex items-center justify-center text-white text-[18px] font-semibold mb-4 shrink-0">
                {a.initials}
              </div>
              <p className="text-[15px] font-semibold text-[#362F26]">{a.name}</p>
              <p className="text-[13px] text-[#A28F7D] mt-0.5">{a.category}</p>

              <div className="w-full flex items-center justify-between mt-5 text-[13px] text-[#A28F7D]">
                <span>{a.artworks} pieces</span>
                <span className="flex items-center gap-1 text-[#362F26] font-medium">
                  <Star size={13} className="fill-[#9F5639] text-[#9F5639]" /> {a.rating}
                </span>
              </div>

              <p className="text-[16px] font-semibold text-[#362F26] mt-4">{formatINR(a.sales)}</p>

              <div className="flex items-center gap-1.5 text-[12px] text-[#A28F7D] mt-1.5">
                <Users size={12} />
                <span>{a.followers.toLocaleString("en-IN")} followers</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Playfair_Display'] text-[20px] text-[#362F26]">Recently uploaded artworks</h2>
          <button className="text-[13px] font-medium text-[#9F5639] hover:text-[#8A4930] transition-colors cursor-pointer">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {visibleArtworks.map((art) => (
            <div key={art.id} className="bg-[#F9F8F6] border border-[#E8E1DB] rounded-xl overflow-hidden flex flex-col">
              <div className="h-32 flex items-center justify-center" style={{ backgroundColor: art.color }}>
                <ImageIcon size={24} className="text-white/70" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[13.5px] font-medium text-[#362F26] truncate">{art.title}</p>
                <p className="text-[12px] text-[#A28F7D] truncate mt-0.5">{art.artist}</p>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#362F26]">{formatINR(art.price)}</span>
                  <StatusBadge status={art.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}