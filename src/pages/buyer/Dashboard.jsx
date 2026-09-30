import { Link, Navigate } from "react-router-dom";
import { Heart, ShoppingBag, Package, Wallet, Palette, Truck, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { ARTWORKS, getArtwork } from "../../data/artworks";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const STAGES = ["Placed", "Packed", "Shipped", "Delivered"];

// Demo data until a backend exists. Replace with API calls.
const ORDERS = [
  { id: "ART-2041", artId: 6, date: "24 Sep 2026", stage: 2, eta: "Arrives 4 Oct" },
  { id: "ART-1987", artId: 10, date: "12 Sep 2026", stage: 3, eta: "Delivered 19 Sep" },
  { id: "ART-1904", artId: 19, date: "28 Aug 2026", stage: 3, eta: "Delivered 3 Sep" },
];
const REQUESTS = [
  { id: 1, title: "Family portrait in oils", artist: "Elena Voss", status: "Quote received" },
  { id: 2, title: "Bronze desk piece", artist: "Priya Nair", status: "Awaiting artist" },
];

const card = "rounded-2xl border border-[#E8E1DB] bg-white p-6";

function Stat({ icon: Icon, label, value, to }) {
  return (
    <Link to={to} className="flex items-center gap-4 rounded-2xl border border-[#E8E1DB] bg-white p-5 transition-colors hover:border-[#9F5639] focus-visible:outline-2 focus-visible:outline-[#9F5639]">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F6EDE6] text-[#9F5639]"><Icon size={20} /></span>
      <span>
        <span className="block text-[26px] leading-none text-[#362F26]">{value}</span>
        <span className="text-[13px] text-[#A28F7D]">{label}</span>
      </span>
    </Link>
  );
}

function Tracker({ stage }) {
  return (
    <ol className="mt-4 flex items-center" aria-label="Order progress">
      {STAGES.map((s, i) => (
        <li key={s} className="flex flex-1 items-center last:flex-none">
          <span className="flex flex-col items-center gap-1.5">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-white ${i <= stage ? "bg-[#9F5639]" : "bg-[#E8E1DB]"}`}>
              {i < stage ? <Check size={14} /> : i === stage ? <Truck size={14} /> : null}
            </span>
            <span className={`text-[12px] ${i <= stage ? "text-[#362F26]" : "text-[#A28F7D]"}`}>{s}</span>
          </span>
          {i < STAGES.length - 1 && <span className={`mx-2 mb-5 h-0.5 flex-1 ${i < stage ? "bg-[#9F5639]" : "bg-[#E8E1DB]"}`} />}
        </li>
      ))}
    </ol>
  );
}

function Thumb({ art, className = "h-16 w-16" }) {
  return <img src={art.img} alt={art.title} loading="lazy" className={`${className} shrink-0 rounded-xl object-cover`} />;
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { items: cart } = useCart();
  const { items: wishlist } = useWishlist();

  if (!user || user.role !== "buyer") return <Navigate to="/buyer/login" replace />;

  const orders = ORDERS.map((o) => ({ ...o, art: getArtwork(o.artId) })).filter((o) => o.art);
  const active = orders.find((o) => o.stage < 3);
  const spent = orders.reduce((s, o) => s + o.art.value, 0);
  const cartTotal = cart.reduce((s, i) => s + i.value, 0);
  const owned = new Set([...orders.map((o) => o.artId), ...cart.map((i) => i.id)]);
  const favCats = new Set(wishlist.map((w) => w.category));
  const picks = ARTWORKS.filter((a) => !owned.has(a.id) && (favCats.size === 0 || favCats.has(a.category))).slice(0, 4);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="bg-[#F9F8F6]">
      <div className="mx-auto max-w-[1200px] space-y-6 px-6 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] leading-tight text-[#362F26]">Welcome back, {firstName}</h1>
            <p className="text-[15px] text-[#A28F7D]">
              {active ? `${active.art.title} is on its way. ${active.eta}.` : "Nothing in transit right now. Find your next piece."}
            </p>
          </div>
          <Link to="/discover" className="rounded-full bg-[#9F5639] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#8A4A30]">Browse artworks</Link>
        </header>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={Package} label="Orders placed" value={orders.length} to="/orders" />
          <Stat icon={Wallet} label="Collected so far" value={inr(spent)} to="/orders" />
          <Stat icon={Heart} label="Saved artworks" value={wishlist.length} to="/wishlist" />
          <Stat icon={ShoppingBag} label="In your cart" value={cart.length} to="/cart" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className={`${card} lg:col-span-2`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] text-[#362F26]">Orders</h2>
              <Link to="/orders" className="text-[14px] text-[#9F5639] hover:underline">View all</Link>
            </div>
            {active && (
              <div className="mb-5 rounded-xl bg-[#F9F8F6] p-4">
                <div className="flex items-center gap-4">
                  <Thumb art={active.art} className="h-20 w-20" />
                  <div>
                    <p className="text-[16px] text-[#362F26]">{active.art.title}</p>
                    <p className="text-[13px] text-[#A28F7D]">{active.art.artist} · Order {active.id}</p>
                  </div>
                </div>
                <Tracker stage={active.stage} />
              </div>
            )}
            <ul className="divide-y divide-[#E8E1DB]">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={`/orders/${o.id}`} className="flex items-center gap-4 py-3 hover:bg-[#F9F8F6]">
                    <Thumb art={o.art} className="h-12 w-12" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] text-[#362F26]">{o.art.title}</span>
                      <span className="text-[12px] text-[#A28F7D]">{o.id} · {o.date}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[14px] text-[#362F26]">{inr(o.art.value)}</span>
                      <span className={`text-[12px] ${o.stage === 3 ? "text-[#4C6B3F]" : "text-[#8A5A22]"}`}>{STAGES[o.stage]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-6">
            <section className={card}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[18px] text-[#362F26]">Your cart</h2>
                <Link to="/cart" className="text-[14px] text-[#9F5639] hover:underline">Open</Link>
              </div>
              {cart.length === 0 ? (
                <p className="text-[14px] text-[#A28F7D]">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {cart.slice(0, 3).map((i) => (
                      <li key={i.id} className="flex items-center gap-3">
                        <Thumb art={i} className="h-11 w-11" />
                        <span className="min-w-0 flex-1 truncate text-[14px] text-[#362F26]">{i.title}</span>
                        <span className="text-[13px] text-[#736153]">{inr(i.value)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between border-t border-[#E8E1DB] pt-4">
                    <span className="text-[14px] text-[#736153]">Total</span>
                    <span className="text-[16px] text-[#362F26]">{inr(cartTotal)}</span>
                  </div>
                  <Link to="/checkout" className="mt-3 block rounded-full bg-[#9F5639] py-2.5 text-center text-[14px] text-white hover:bg-[#8A4A30]">Checkout</Link>
                </>
              )}
            </section>

            <section className={card}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[18px] text-[#362F26]">Commissions</h2>
                <Link to="/custom-art" className="text-[14px] text-[#9F5639] hover:underline">New request</Link>
              </div>
              <ul className="space-y-3">
                {REQUESTS.map((r) => (
                  <li key={r.id} className="flex items-start gap-3">
                    <Palette size={18} className="mt-0.5 shrink-0 text-[#9F5639]" />
                    <span>
                      <span className="block text-[14px] text-[#362F26]">{r.title}</span>
                      <span className="text-[12px] text-[#A28F7D]">{r.artist} · {r.status}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section className={card}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] text-[#362F26]">{favCats.size ? "Picked from what you've saved" : "Worth a look"}</h2>
            <Link to="/discover" className="text-[14px] text-[#9F5639] hover:underline">See more</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {picks.map((a) => (
              <Link key={a.id} to={`/artwork/${a.id}`} className="group">
                <img src={a.img} alt={a.title} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
                <p className="mt-2 truncate text-[14px] text-[#362F26] group-hover:text-[#9F5639]">{a.title}</p>
                <p className="text-[12px] text-[#A28F7D]">{a.artist} · {inr(a.value)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}