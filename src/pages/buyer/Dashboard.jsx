import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, ShoppingBag, Package, Wallet, Palette, Truck, Check, Star, MessageCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { ARTWORKS, getArtwork } from "../../data/artworks";

/* Design tokens: plaster #EDEFEA · ink #14181F · verdigris #1F6F6B · ochre #D8A53A · line #D5D9D2 · mute #6C7480
   Fonts: add <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Inter:wght@400;500&display=swap" rel="stylesheet"> in index.html */
const DISPLAY = { fontFamily: "'Bricolage Grotesque', 'Segoe UI', sans-serif" };

const MOTION_CSS = `
@keyframes an-rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes an-frame{from{opacity:0;transform:rotate(-10deg) scale(.85)}to{opacity:1;transform:rotate(-2deg) scale(1)}}
.an-rise{animation:an-rise .8s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0ms)}
.an-frame{animation:an-frame .9s cubic-bezier(.2,.8,.2,1) .35s both}
.rv-on [data-reveal]{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0ms)}
.rv-on [data-reveal].rv-in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.an-rise,.an-frame{animation:none}.rv-on [data-reveal]{opacity:1;transform:none;transition:none}}
`;

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const STAGES = ["Placed", "Confirmed", "Packed"];
const STAGE_KEY = "artnest_order_stage";
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
  waiting: "bg-[#D8A53A]/20 text-[#7A5A10]",
  accepted: "bg-[#1F6F6B]/15 text-[#1F6F6B]",
  declined: "bg-[#B8434F]/15 text-[#B8434F]",
};
const BADGE_TEXT = { waiting: "Waiting", accepted: "Accepted", declined: "Declined" };

function RequestItem({ r }) {
  return (
    <li className="border-l-2 border-[#14181F] pl-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-medium text-[#14181F]">{r.title}</p>
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] ${BADGE[r.status]}`}>{BADGE_TEXT[r.status]}</span>
      </div>
      <p className="text-[12px] text-[#6C7480]">{r.artist}</p>
      {r.status === "waiting" && <p className="mt-1.5 text-[12px] text-[#6C7480]">Waiting for {r.artist} to reply.</p>}
      {r.status === "declined" && <p className="mt-1.5 text-[12px] text-[#6C7480]">{r.note || "The artist can't take this request."}</p>}
      {r.status === "accepted" && (
        <div className="mt-2">
          <p className="text-[12px] text-[#6C7480]">Quote {inr(r.quote)} · {r.eta}</p>
          <div className="mt-2 flex gap-1" role="img" aria-label={`Progress: ${PROGRESS[r.progress]}`}>
            {PROGRESS.slice(1).map((p, i) => (
              <span key={p} className={`h-1.5 flex-1 rounded-sm ${i < r.progress ? "bg-[#1F6F6B]" : "bg-[#D5D9D2]"}`} />
            ))}
          </div>
          <p className="mt-1.5 text-[12px] text-[#14181F]">{r.progress === 0 ? "Not started yet" : PROGRESS[r.progress]}</p>
          {r.note && <p className="mt-1 text-[12px] italic text-[#6C7480]">"{r.note}"</p>}
        </div>
      )}
    </li>
  );
}

function Stat({ icon: Icon, label, value, to }) {
  return (
    <Link to={to} className="group flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#D8A53A]">
      <span>
        <span className="block text-[12.5px] text-white/60">{label}</span>
        <span className="block text-[26px] font-semibold leading-tight text-white" style={DISPLAY}>{value}</span>
      </span>
      <Icon size={20} className="text-[#D8A53A]" />
    </Link>
  );
}

function Tracker({ stage }) {
  return (
    <ol className="mt-6 flex items-center" aria-label="Order progress">
      {STAGES.map((s, i) => (
        <li key={s} className="flex flex-1 items-center last:flex-none">
          <span className="flex flex-col items-center gap-1.5">
            <span className={`grid h-8 w-8 place-items-center rounded-full ${i <= stage ? "bg-[#D8A53A] text-[#14181F]" : "border border-white/25 text-white/40"}`}>
              {i < stage || i === 0 ? <Check size={15} /> : i === stage ? <Truck size={15} /> : null}
            </span>
            <span className={`text-[12px] ${i <= stage ? "text-white" : "text-white/50"}`}>{s}</span>
          </span>
          {i < STAGES.length - 1 && <span className={`mx-2 mb-5 h-0.5 flex-1 ${i < stage ? "bg-[#D8A53A]" : "bg-white/20"}`} />}
        </li>
      ))}
    </ol>
  );
}

function Thumb({ art, className = "h-16 w-16" }) {
  return <img src={art.img} alt={art.title} loading="lazy" className={`${className} shrink-0 rounded-sm object-cover`} />;
}

const REVIEWS_KEY = "artnest_reviews";

function StarPicker({ value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange(n)} className="p-0.5">
          <Star size={28} className={n <= value ? "fill-[#D8A53A] text-[#D8A53A]" : "text-[#D5D9D2]"} />
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
      <div className="absolute inset-0 bg-[#14181F]/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="review-title" className="relative w-full max-w-[460px] rounded-xl bg-[#EDEFEA] p-6 shadow-2xl">
        {sent ? (
          <div className="py-4 text-center">
            <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#1F6F6B] text-white"><Check size={22} /></span>
            <h2 id="review-title" className="text-[22px] font-semibold text-[#14181F]" style={DISPLAY}>Thank you!</h2>
            <p className="mt-1 text-[14px] text-[#6C7480]">Your review has been shared with {order.art.artist}.</p>
            <button type="button" onClick={onClose} className="mt-5 rounded-md bg-[#14181F] px-6 py-2.5 text-[14px] text-white hover:bg-[#1F6F6B]">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <h2 id="review-title" className="text-[22px] font-semibold leading-tight text-[#14181F]" style={DISPLAY}>Your order arrived. How was it?</h2>
              <p className="text-[13px] text-[#6C7480]">{order.art.title} · {order.art.artist}</p>
            </div>
            <div>
              <p className="mb-1 text-[13px] text-[#14181F]">Rate the artwork</p>
              <StarPicker value={rating} onChange={setRating} label="Artwork rating" />
            </div>
            <div>
              <p className="mb-1 text-[13px] text-[#14181F]">Rate the artist, {order.art.artist}</p>
              <StarPicker value={artistRating} onChange={setArtistRating} label="Artist rating" />
            </div>
            <label className="block">
              <span className="mb-1 block text-[13px] text-[#14181F]">Your review (optional)</span>
              <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell others about the piece, packaging and delivery…" className="w-full rounded-lg border border-[#D5D9D2] bg-white p-3 text-[14px] outline-none focus:border-[#1F6F6B]" />
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={!rating || !artistRating} className="rounded-md bg-[#14181F] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#1F6F6B] disabled:opacity-50">Submit review</button>
              <button type="button" onClick={onClose} className="rounded-md border border-[#D5D9D2] bg-white px-5 py-2.5 text-[14px] text-[#14181F] hover:bg-[#EDEFEA]">Skip for now</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const MSG_KEY = "artnest_messages";
function readThreads() {
  try {
    return JSON.parse(localStorage.getItem(MSG_KEY)) || [];
  } catch {
    return [];
  }
}

function MessageModal({ order, buyer, onClose }) {
  const [msgs, setMsgs] = useState(() => readThreads().find((t) => t.id === order.id)?.msgs || []);
  const [text, setText] = useState("");

  const send = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const existing = readThreads().find((t) => t.id === order.id)?.msgs || [];
    const next = [...existing, { from: "buyer", text: body, time }];
    const rest = readThreads().filter((t) => t.id !== order.id);
    try {
      localStorage.setItem(
        MSG_KEY,
        JSON.stringify([{ id: order.id, artist: order.art.artist, buyer, subject: `Order ${order.id} · ${order.art.title}`, msgs: next }, ...rest])
      );
    } catch {
    }
    setMsgs(next);
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-[#14181F]/60" onClick={onClose} />
      <div className="relative flex h-[520px] max-h-[90vh] w-full max-w-[460px] flex-col rounded-xl bg-[#EDEFEA] shadow-2xl">
        <div className="flex items-center justify-between rounded-t-xl bg-[#14181F] px-5 py-4">
          <div>
            <p className="text-[16px] font-semibold text-white" style={DISPLAY}>{order.art.artist}</p>
            <p className="text-[12.5px] text-white/60">Order {order.id} · {order.art.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[22px] leading-none text-white/70 hover:text-white">×</button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {!msgs.length && <p className="text-center text-[13.5px] text-[#6C7480]">Start the conversation with the artist.</p>}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "buyer" ? "justify-end" : ""}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] ${m.from === "buyer" ? "rounded-br-sm bg-[#1F6F6B] text-white" : "rounded-bl-sm bg-white text-[#14181F]"}`}>
                <p>{m.text}</p>
                <p className={`mt-1 text-[11px] ${m.from === "buyer" ? "text-white/70" : "text-[#6C7480]"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-3 border-t border-[#D5D9D2] p-4">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="h-11 flex-1 rounded-md border border-[#D5D9D2] bg-white px-4 text-[14px] outline-none focus:border-[#1F6F6B]" />
          <button type="submit" disabled={!text.trim()} className="rounded-md bg-[#14181F] px-5 text-[14px] text-white hover:bg-[#1F6F6B] disabled:opacity-50">Send</button>
        </form>
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

const panelTitle = "text-[20px] font-semibold text-[#14181F]";
const linkCls = "text-[13.5px] font-medium text-[#1F6F6B] hover:underline";

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
  const [chatFor, setChatFor] = useState(null);
  const [, setTick] = useState(0);
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STAGE_KEY) setTick((t) => t + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    const root = document.querySelector("[data-rv-root]");
    if (!root) return;
    root.classList.add("rv-on");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("rv-in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [!!user]);
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
  let artistStages = {};
  try {
    artistStages = JSON.parse(localStorage.getItem(STAGE_KEY)) || {};
  } catch {
  }
  const orders = [...loadPlacedOrders(), ...demoOrders].map((o) => ({
    ...o,
    stage: artistStages[o.id] ?? o.stage,
  }));
  const active = orders.find((o) => o.stage === 1) || orders.find((o) => o.stage < DELIVERED);
  const spent = orders.reduce((s, o) => s + o.amount, 0);
  const cartTotal = cart.reduce((s, i) => s + i.value, 0);
  const owned = new Set([...orders.flatMap((o) => o.artIds || [o.artId]), ...cart.map((i) => i.id)]);
  const favCats = new Set(wishlist.map((w) => w.category));
  const picks = ARTWORKS.filter((a) => !owned.has(a.id) && (favCats.size === 0 || favCats.has(a.category))).slice(0, 4);
  const firstName = user.name.split(" ")[0];
  const frames = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

  return (
    <div data-rv-root className="min-h-screen bg-[#EDEFEA] font-[Inter,system-ui,sans-serif]">
      <style>{MOTION_CSS}</style>
      {reviewFor && <ReviewModal order={reviewFor} buyer={user.name} onClose={() => setReviewFor(null)} />}
      {chatFor && <MessageModal order={chatFor} buyer={user.name} onClose={() => setChatFor(null)} />}

      {/* Hero: the order in transit is the first thing you see */}
      <section className="bg-[#14181F]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-6 pb-8 pt-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="an-rise">
            <h1 className="text-[44px] font-extrabold leading-[1.05] text-white md:text-[56px]" style={DISPLAY}>
              Hi {firstName},<br />your collection<br />is growing.
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] text-white/65">
              {!active
                ? "Nothing in transit right now. Find your next piece."
                : active.stage === 0
                  ? `${active.art.title} is placed. Waiting for the artist to confirm.`
                  : `${active.art.title} is confirmed. The artist is packing it.`}
            </p>
            <Link to="/discover" className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-[#D8A53A] px-5 py-2.5 text-[14px] font-medium text-[#14181F] transition-colors hover:bg-white">
              Browse artworks <ArrowUpRight size={16} />
            </Link>
          </div>

          {active ? (
            <div className="an-rise rounded-xl bg-white/[0.06] p-5 ring-1 ring-white/10" style={{ "--d": "180ms" }}>
              <div className="flex items-center gap-4">
                <div className="an-frame rotate-[-2deg] border-[6px] border-white bg-white shadow-xl">
                  <Thumb art={active.art} className="h-24 w-24" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[17px] font-semibold text-white" style={DISPLAY}>{active.art.title}</p>
                  <p className="text-[13px] text-white/60">{active.art.artist}</p>
                  <p className="text-[12px] text-white/45">Order {active.id}{active.eta ? ` · ${active.eta}` : ""}</p>
                </div>
              </div>
              <Tracker stage={active.stage} />
              <button type="button" onClick={() => setChatFor(active)} className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/25 px-4 py-2 text-[14px] text-white transition-colors hover:bg-white/10">
                <MessageCircle size={16} /> Message {active.art.artist}
              </button>
            </div>
          ) : (
            <div className="grid h-full min-h-[160px] place-items-center rounded-xl border border-dashed border-white/20 p-6 text-center text-[14px] text-white/50">No active orders</div>
          )}
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-10">
          <div className="an-rise grid grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-xl ring-1 ring-white/10 lg:grid-cols-4" style={{ "--d": "360ms" }}>
            <Stat icon={Package} label="Orders placed" value={orders.length} to="/orders" />
            <Stat icon={Wallet} label="Collected so far" value={inr(spent)} to="/orders" />
            <Stat icon={Heart} label="Saved artworks" value={wishlist.length} to="/wishlist" />
            <Stat icon={ShoppingBag} label="In your cart" value={cart.length} to="/cart" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] space-y-14 px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Orders ledger */}
          <section data-reveal>
            <div className="mb-4 flex items-baseline justify-between border-b-2 border-[#14181F] pb-2">
              <h2 className={panelTitle} style={DISPLAY}>Orders</h2>
              <Link to="/orders" className={linkCls}>View all</Link>
            </div>
            <ul>
              {orders.map((o) => (
                <li key={o.id} className="border-b border-[#D5D9D2]">
                  <Link to={`/orders/${o.id}`} className="group flex items-center gap-4 py-4">
                    <Thumb art={o.art} className="h-14 w-14" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-[#14181F] group-hover:text-[#1F6F6B]">{o.art.title}</span>
                      <span className="text-[12.5px] text-[#6C7480]">{o.art.artist} · {o.id} · {o.date}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[15px] font-semibold text-[#14181F]" style={DISPLAY}>{inr(o.amount)}</span>
                      <span className={`mt-0.5 inline-block rounded-md px-2 py-0.5 text-[11.5px] ${o.stage === DELIVERED ? "bg-[#1F6F6B]/15 text-[#1F6F6B]" : "bg-[#D8A53A]/20 text-[#7A5A10]"}`}>{STAGES[o.stage]}</span>
                    </span>
                  </Link>
                  <div className="pb-3 pl-[72px]">
                    <button type="button" onClick={() => setChatFor(o)} className={linkCls}>Message {o.art.artist}</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-10">
            {/* Cart */}
            <section data-reveal style={{ "--d": "120ms" }} className="rounded-xl bg-white p-5 ring-1 ring-[#D5D9D2]">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className={panelTitle} style={DISPLAY}>Your cart</h2>
                <Link to="/cart" className={linkCls}>Open</Link>
              </div>
              {cart.length === 0 ? (
                <p className="text-[14px] text-[#6C7480]">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {cart.slice(0, 3).map((i) => (
                      <li key={i.id} className="flex items-center gap-3">
                        <Thumb art={i} className="h-11 w-11" />
                        <span className="min-w-0 flex-1 truncate text-[14px] text-[#14181F]">{i.title}</span>
                        <span className="text-[13px] text-[#6C7480]">{inr(i.value)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between border-t border-[#D5D9D2] pt-4">
                    <span className="text-[14px] text-[#6C7480]">Total</span>
                    <span className="text-[18px] font-semibold text-[#14181F]" style={DISPLAY}>{inr(cartTotal)}</span>
                  </div>
                  <Link to="/checkout" className="mt-3 block rounded-md bg-[#14181F] py-2.5 text-center text-[14px] text-white transition-colors hover:bg-[#1F6F6B]">Checkout</Link>
                </>
              )}
            </section>

            {/* Commissions */}
            <section data-reveal style={{ "--d": "200ms" }}>
              <div className="mb-4 flex items-baseline justify-between border-b-2 border-[#14181F] pb-2">
                <h2 className={`${panelTitle} flex items-center gap-2`} style={DISPLAY}><Palette size={18} className="text-[#1F6F6B]" /> Custom requests</h2>
                <Link to="/custom-art" className={linkCls}>New request</Link>
              </div>
              {REQUESTS.length === 0 ? (
                <p className="text-[14px] text-[#6C7480]">No requests yet. Ask an artist to make something for you.</p>
              ) : (
                <ul className="space-y-5">
                  {REQUESTS.map((r) => <RequestItem key={r.id} r={r} />)}
                </ul>
              )}
            </section>
          </div>
        </div>

        {/* Gallery wall */}
        <section>
          <div data-reveal className="mb-6 flex items-baseline justify-between">
            <h2 className="text-[30px] font-extrabold text-[#14181F]" style={DISPLAY}>{favCats.size ? "Picked from what you've saved" : "Worth a look"}</h2>
            <Link to="/discover" className={linkCls}>See more</Link>
          </div>
          <div className="grid grid-cols-2 items-end gap-x-6 gap-y-10 md:grid-cols-4">
            {picks.map((a, i) => (
              <Link key={a.id} to={`/artwork/${a.id}`} data-reveal style={{ "--d": `${i * 110}ms` }} className="group block">
                <div className="bg-white p-2.5 shadow-[0_10px_24px_-12px_rgba(20,24,31,0.45)] transition-transform group-hover:-translate-y-1">
                  <img src={a.img} alt={a.title} loading="lazy" className={`${frames[i % 4]} w-full object-cover`} />
                </div>
                <div className="mt-3 border-l-2 border-[#D8A53A] pl-2.5">
                  <p className="truncate text-[14px] font-medium text-[#14181F] group-hover:text-[#1F6F6B]">{a.title}</p>
                  <p className="text-[12px] text-[#6C7480]">{a.artist} · {inr(a.value)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}