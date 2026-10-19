import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Image, ShoppingBag, Palette, Wallet, Star,
  MessageSquare, CircleUser, LogOut, Sparkles,
} from "lucide-react";

// [label, path, icon, badge count]
const GROUPS = [
  ["Overview", [["Dashboard", "/artist", LayoutDashboard]]],
  ["My Work", [
    ["My Artworks", "/artist/artworks", Image],
    ["Orders", "/artist/orders", ShoppingBag],
    ["Custom Requests", "/artist/requests", Palette, 2],
  ]],
  ["Business", [
    ["Earnings", "/artist/earnings", Wallet],
    ["Reviews", "/artist/reviews", Star],
    ["Messages", "/artist/messages", MessageSquare, 2],
  ]],
];

const linkCls = ({ isActive }) =>
  `relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors ${
    isActive
      ? "bg-[#4A4036] text-white before:absolute before:left-[-4px] before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-[#E08A5C]"
      : "text-[#E3D8CC] hover:bg-[#40372E]"
  }`;

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col bg-[#362F26] text-[#E3D8CC] lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div>
          <p className="text-[22px] leading-none text-white">ArtNest</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GROUPS.map(([group, items]) => (
          <div key={group} className="mb-5">
            <p className="mb-2 px-2 pt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#A8998A]">
              {group}
            </p>
            <div className="space-y-1">
              {items.map(([label, to, Icon, badge]) => (
                <NavLink key={to} to={to} end={to === "/artist"} className={linkCls}>
                  <Icon size={19} className="shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#B0573A] text-[12px] font-semibold text-white">
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-5 py-4">
        <NavLink to="/artist/profile" className={linkCls}>
          <CircleUser size={19} className="shrink-0" />
          <span>Profile</span>
        </NavLink>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/artist/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-[#E3D8CC] transition-colors hover:bg-[#40372E]"
        >
          <LogOut size={19} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}