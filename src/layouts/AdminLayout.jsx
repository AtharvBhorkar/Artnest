import { useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Image, Gem, LayoutGrid, ShoppingBag, Palette,
  CreditCard, UserCog, Star, MessageSquare, TrendingUp, Settings, User,
  Menu, Sparkles, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  ["Overview", [["Dashboard", "/admin", LayoutDashboard]]],
  ["Catalogue", [
    ["Artists", "/admin/artists", Users],
    ["Artworks", "/admin/artworks", Image],
    ["Sculptures", "/admin/sculptures", Gem],
    ["Collections", "/admin/collections", LayoutGrid],
  ]],
  ["Sales", [
    ["Orders", "/admin/orders", ShoppingBag],
    ["Custom Art Requests", "/admin/custom-requests", Palette],
    ["Payments", "/admin/payments", CreditCard],
  ]],
  ["Community", [
    ["Users", "/admin/users", UserCog],
    ["Reviews", "/admin/reviews", Star],
    ["Messages", "/admin/messages", MessageSquare, 2],
  ]],
  ["Insights", [["Reports", "/admin/reports", TrendingUp]]],
  ["Account", [
    ["Settings", "/admin/settings", Settings],
  ]],
];

function SideNav({ onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col bg-[#352d25] text-[#d9cdbd]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#e39b78]">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="font-serif text-[20px] leading-none text-white">ArtNest</p>
          <p className="mt-1 text-[12px] text-[#9a8b78]">Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map(([section, items]) => (
          <div key={section} className="mb-4">
            <p className="px-3 pb-2 font-serif text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8b78]">
              {section}
            </p>
            {items.map(([label, to, Icon, badge]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                    isActive ? "bg-[#4a3f34] text-white" : "hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-[#d98a68]" />
                    )}
                    <Icon size={18} strokeWidth={1.6} />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#a65335] px-1.5 text-[11px] font-semibold text-white">
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} strokeWidth={1.6} />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;

  const signOut = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f6f1ea] text-[#29221e]">
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 lg:block">
        <SideNav onLogout={signOut} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px]">
            <SideNav onNavigate={() => setOpen(false)} onLogout={signOut} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-[#e6ded8] bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <span className="font-serif text-[18px]">ArtNest Admin</span>
        </header>
        <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}