import { Outlet, useLocation } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";

const TITLES = {
  "/artist": ["Dashboard", "Your studio at a glance."],
  "/artist/artworks": ["My Artworks", "Manage your listings."],
  "/artist/artworks/new": ["New Artwork", "Add a new piece to your studio."],
  "/artist/orders": ["Orders", "Track and fulfil your orders."],
  "/artist/requests": ["Custom Requests", "Commission requests sent to you."],
  "/artist/earnings": ["Earnings", "Your balance and payouts."],
  "/artist/reviews": ["Reviews", "What buyers say about your work."],
  "/artist/messages": ["Messages", "Conversations with buyers."],
  "/artist/profile": ["Profile", "Your public artist details."],
};

function titleFor(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (/^\/artist\/artworks\/[^/]+\/edit$/.test(path)) return ["Edit Artwork", "Update your listing."];
  return TITLES[path] || ["Artist Studio", ""];
}

export default function ArtistLayout() {
  const { pathname } = useLocation();
  const [title, subtitle] = titleFor(pathname);

  return (
    <div className="flex min-h-screen bg-[#F9F8F6]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E8E1DB] bg-[#FEFDFB] px-10 py-4">
          <div>
            <h1 className="text-[28px] leading-tight text-[#362F26]">{title}</h1>
            {subtitle && <p className="text-[14px] text-[#A28F7D]">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-6">
            <button type="button" aria-label="Notifications" className="relative text-[#362F26]">
              <Bell size={22} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#B0573A]" />
            </button>
            <div className="h-10 w-px bg-[#E8E1DB]" />
            <button type="button" className="flex items-center gap-3 text-left">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] text-[13px] font-semibold text-white">
                AM
              </div>
              <div>
                <p className="text-[14px] leading-tight text-[#362F26]">Aarav Mehta</p>
                <p className="text-[12px] text-[#A28F7D]">Paintings artist</p>
              </div>
              <ChevronDown size={16} className="text-[#A28F7D]" />
            </button>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}