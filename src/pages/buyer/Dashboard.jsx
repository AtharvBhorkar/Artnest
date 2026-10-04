import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, ShoppingBag, Package, Wallet, Palette, Truck, Check, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { ARTWORKS, getArtwork } from "../../data/artworks";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const STAGES = ["Placed", "Shipped", "Delivered"];
const DELIVERED = 2;

const ORDERS = [
  { id: "ART-2041", artId: 6, date: "24 Sep 2026", stage: 1, eta: "Arrives 4 Oct" },
  { id: "ART-1987", artId: 10, date: "12 Sep 2026", stage: 2, eta: "Delivered 19 Sep" },
  { id: "ART-1904", artId: 19, date: "28 Aug 2026", stage: 2, eta: "Delivered 3 Sep" },
];

const PROGRESS = ["Not started", "Sketching", "In progress", "Finishing", "Completed"];
const REQUESTS = [
  { id: 1, title: "Family portrait in oils", artist: "Elena Voss", status: "accepted", quote: 18000, progress: 2, eta: "Ready by 20 Nov", note: "Sketch approved, colour layers are underway." },
  { id: 2, title: "Bronze desk piece", artist: "Priya Nair", status: "waiting" },
  { id: 3, title: "Pet portrait, watercolour", artist: "Julian Cross", status: "declined", note: "Not taking watercolour commissions this month." },
  { id: 4, title: "Wedding gift sculpture", artist: "Renzo Takahashi", status: "accepted", quote: 32000, progress: 0, eta: "Starts 12 Oct", note: "" },
];

const BADGE = {
  waiting: "bg-[#F6EDE6] text-[#8A5A22]",
  accepted: "bg-[#E9F0E4] text-[#4C6B3F]",
  declined: "bg-[#F7E6E3] text-[#A3392F]",
};
const BADGE_TEXT = { waiting: "Waiting", accepted: "Accepted", declined: "Declined" };

function RequestItem({ r }) {
  return (
    <li className="rounded-xl bg-[#F9F8F6] p-4">
      <div className="flex items-start gap-3">
        <Palette size={18} className="mt-0.5 shrink-0 text-[#9F5639]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14px] text-[#362F26]">{r.title}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] ${BADGE[r.status]}`}>{BADGE_TEXT[r.status]}</span>
          </div>
          <p className="text-[12px] text-[#A28F7D]">{r.artist}</p>

          {r.status === "waiting" && (
            <p className="mt-2 text-[12px] text-[#736153]">Waiting for {r.artist} to reply.</p>
          )}

          {r.status === "declined" && (
            <p className="mt-2 text-[12px] text-[#736153]">{r.note || "The artist can't take this request."}</p>
          )}

          {r.status === "accepted" && (
            <div className="mt-3">
              <p className="text-[12px] text-[#736153]">Quote {inr(r.quote)} · {r.eta}</p>
              <div className="mt-2 flex gap-1" role="img" aria-label={`Progress: ${PROGRESS[r.progress]}`}>
                {PROGRESS.slice(1).map((p, i) => (
                  <span key={p} className={`h-1.5 flex-1 rounded-full ${i < r.progress ? "bg-[#9F5639]" : "bg-[#E8E1DB]"}`} />
                ))}
              </div>
              <p className="mt-1.5 text-[12px] text-[#362F26]">
                {r.progress === 0 ? "Not started yet" : PROGRESS[r.progress]}
              </p>
              {r.note && <p className="mt-1 text-[12px] italic text-[#A28F7D]">"{r.note}"</p>}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

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
              {i < stage || i === 0 ? <Check size={14} /> : i === stage ? <Truck size={14} /> : null}
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

const REVIEWS_KEY = "artnest_reviews";

function StarPicker({ value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star size={28} className={n <= value ? "fill-[#C08A3E] text-[#C08A3E]" : "text-[#D9CFC5]"} />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ order, buyer, onClose }) {
  const [rating, setRating] = useState(0);
  const [artistRating, setArtistRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const review = {
      id: `REV-${order.id}`,
      orderId: order.id,
      buyer,
      artwork: order.art.title,
      artist: order.art.artist,
      rating,
      artistRating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Published",
      reply: "",
    };
    try {
      const list = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
      localStorage.setItem(REVIEWS_KEY, JSON.stringify([review, ...list.filter((r) => r.id !== review.id)]));
    } catch {
    }
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="review-title" className="relative w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-xl">
        {sent ? (
          <div className="py-4 text-center">
            <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#E7EEDD] text-[#4C6B3F]"><Check size={22} /></span>
            <h2 id="review-title" className="text-[20px] text-[#362F26]">Thank you!</h2>
            <p className="mt-1 text-[14px] text-[#A28F7D]">Your review has been shared with {order.art.artist}.</p>
            <button type="button" onClick={onClose} className="mt-5 rounded-full bg-[#9F5639] px-6 py-2.5 text-[14px] text-white hover:bg-[#8A4A30]">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <h2 id="review-title" className="text-[20px] text-[#362F26]">Your order arrived. How was it?</h2>
              <p className="text-[13px] text-[#A28F7D]">{order.art.title} · {order.art.artist}</p>
            </div>
            <div>
              <p className="mb-1 text-[13px] text-[#736153]">Rate the artwork</p>
              <StarPicker value={rating} onChange={setRating} label="Artwork rating" />
            </div>
            <div>
              <p className="mb-1 text-[13px] text-[#736153]">Rate the artist, {order.art.artist}</p>
              <StarPicker value={artistRating} onChange={setArtistRating} label="Artist rating" />
            </div>
            <label className="block">
              <span className="mb-1 block text-[13px] text-[#736153]">Your review (optional)</span>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell others about the piece, packaging and delivery…"
                className="w-full rounded-xl border border-[#E8E1DB] p-3 text-[14px] outline-none focus:border-[#9F5639]"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!rating || !artistRating}
                className="rounded-full bg-[#9F5639] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#8A4A30] disabled:opacity-50"
              >
                Submit review
              </button>
              <button type="button" onClick={onClose} className="rounded-full border border-[#E8E1DB] bg-white px-5 py-2.5 text-[14px] text-[#362F26] hover:bg-[#F9F8F6]">
                Skip for now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function loadPlacedOrders() {
  try {
    const list = JSON.parse(localStorage.getItem("artnest_orders")) || [];
    return list
      .filter((o) => o?.items?.length)
      .map((o) => {
        const first = o.items[0];
        const extra = o.items.length - 1;
        return {
          id: o.id,
          date: new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          stage: o.stage ?? 0,
          eta: o.eta ? `Expected in ${o.eta}` : "",
          amount: o.total,
          artIds: o.items.map((i) => i.id),
          art: { ...first, title: extra > 0 ? `${first.title} + ${extra} more` : first.title },
        };
      });
  } catch {
    return [];
  }
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { items: cart } = useCart();
  const { items: wishlist } = useWishlist();
  const [received, setReceived] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("artnest_received_orders")) || [];
    } catch {
      return [];
    }
  });
  const [reviewFor, setReviewFor] = useState(null);
  const markReceived = (order) => {
    const next = [...received, order.id];
    setReceived(next);
    try {
      localStorage.setItem("artnest_received_orders", JSON.stringify(next));
    } catch {
    }
    setTimeout(() => setReviewFor(order), 2000);
  };

  if (!user || user.role !== "buyer") return <Navigate to="/buyer/login" replace />;

  const demoOrders = ORDERS.map((o) => ({ ...o, art: getArtwork(o.artId) }))
    .filter((o) => o.art)
    .map((o) => ({ ...o, amount: o.art.value }));
  const orders = [...loadPlacedOrders(), ...demoOrders].map((o) => ({
    ...o,
    stage: received.includes(o.id) ? DELIVERED : o.stage,
  }));
  const active = orders.find((o) => o.stage === 1) || orders.find((o) => o.stage < DELIVERED);
  const spent = orders.reduce((s, o) => s + o.amount, 0);
  const cartTotal = cart.reduce((s, i) => s + i.value, 0);
  const owned = new Set([...orders.flatMap((o) => o.artIds || [o.artId]), ...cart.map((i) => i.id)]);
  const favCats = new Set(wishlist.map((w) => w.category));
  const picks = ARTWORKS.filter((a) => !owned.has(a.id) && (favCats.size === 0 || favCats.has(a.category))).slice(0, 4);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="bg-[#F9F8F6]">
      {reviewFor && <ReviewModal order={reviewFor} buyer={user.name} onClose={() => setReviewFor(null)} />}
      <div className="mx-auto max-w-[1200px] space-y-6 px-6 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] leading-tight text-[#362F26]">Welcome back, {firstName}</h1>
            <p className="text-[15px] text-[#A28F7D]">
              {!active
                ? "Nothing in transit right now. Find your next piece."
                : active.stage === 0
                ? `${active.art.title} is confirmed. The artist is preparing it.`
                : `${active.art.title} is on its way. ${active.eta}.`}
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
                {active.stage === 1 && (
                  <button type="button" onClick={() => markReceived(active)} className="mt-4 rounded-full bg-[#9F5639] px-5 py-2 text-[14px] text-white transition-colors hover:bg-[#8A4A30]">
                    Mark as received
                  </button>
                )}
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
                      <span className="block text-[14px] text-[#362F26]">{inr(o.amount)}</span>
                      <span className={`text-[12px] ${o.stage === DELIVERED ? "text-[#4C6B3F]" : "text-[#8A5A22]"}`}>{STAGES[o.stage]}</span>
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
                <h2 className="text-[18px] text-[#362F26]">My custom requests</h2>
                <Link to="/custom-art" className="text-[14px] text-[#9F5639] hover:underline">New request</Link>
              </div>
              {REQUESTS.length === 0 ? (
                <p className="text-[14px] text-[#A28F7D]">No requests yet. Ask an artist to make something for you.</p>
              ) : (
                <ul className="space-y-3">
                  {REQUESTS.map((r) => <RequestItem key={r.id} r={r} />)}
                </ul>
              )}
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