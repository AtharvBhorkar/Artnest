import React, { useMemo, useState } from "react";
import { Search, Eye, Pencil, Ban, CheckCircle2 } from "lucide-react";

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const USERS = [
  { id: "USR-1", name: "Priya Sharma", email: "priya.sharma@example.com", orders: 6, wishlist: 4, spend: 148200, joined: "Jan 2025", status: "Active" },
  { id: "USR-2", name: "Rahul Kapoor", email: "rahul.kapoor@example.com", orders: 3, wishlist: 2, spend: 96400, joined: "Mar 2025", status: "Active" },
  { id: "USR-3", name: "Sneha Iyer", email: "sneha.iyer@example.com", orders: 9, wishlist: 6, spend: 264500, joined: "Aug 2024", status: "Active" },
  { id: "USR-4", name: "Vikram Nair", email: "vikram.nair@example.com", orders: 1, wishlist: 3, spend: 21800, joined: "Jun 2025", status: "Active" },
  { id: "USR-5", name: "Ishaan Joshi", email: "ishaan.joshi@example.com", orders: 2, wishlist: 1, spend: 15600, joined: "Jul 2025", status: "Blocked" },
];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function StatusBadge({ status }) {
  const map = {
    Active: "bg-[#E7EEDD] text-[#4C6B3F]",
    Blocked: "bg-[#F6DFDA] text-[#9B3B2E]",
  };
  const cls = map[status] || "bg-[#EFE9E1] text-[#736153]";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

export default function Users() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  function toggleBlock(id) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Blocked" ? "Active" : "Blocked" } : u
      )
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
      <div className="relative w-full max-w-[320px]">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:outline-none focus:border-[#9F5639] transition-colors"
        />
      </div>

      <div className="bg-white border border-[#E8E1DB] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-[#A28F7D] border-b border-[#E8E1DB]">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium">Wishlist</th>
              <th className="px-6 py-4 font-medium">Total Spend</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-[#E8E1DB] last:border-b-0 hover:bg-[#F9F8F6] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] flex items-center justify-center text-white text-[12px] font-semibold shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#362F26] truncate">{u.name}</p>
                      <p className="text-[13px] text-[#A28F7D] truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#362F26]">{u.orders}</td>
                <td className="px-6 py-4 text-[14px] text-[#362F26]">{u.wishlist}</td>
                <td className="px-6 py-4 text-[14px] font-medium text-[#362F26]">{formatINR(u.spend)}</td>
                <td className="px-6 py-4 text-[14px] text-[#A28F7D] whitespace-nowrap">{u.joined}</td>
                <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button title="View" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                      <Eye size={18} />
                    </button>
                    <button title="Edit" className="text-[#A28F7D] hover:text-[#362F26] transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button
                      title={u.status === "Blocked" ? "Unblock" : "Block"}
                      onClick={() => toggleBlock(u.id)}
                      className={`transition-colors ${
                        u.status === "Blocked"
                          ? "text-[#4C6B3F] hover:text-[#3a5230]"
                          : "text-[#9B3B2E] hover:text-[#7a2e23]"
                      }`}
                    >
                      {u.status === "Blocked" ? <CheckCircle2 size={18} /> : <Ban size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[14px] text-[#A28F7D]">
                  No users match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}