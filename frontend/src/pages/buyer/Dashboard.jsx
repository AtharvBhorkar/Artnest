import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, ShoppingBag, Package, Wallet, Palette, Truck, Check, Star, MessageCircle, ArrowUpRight, X, CreditCard, Send, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { ARTWORKS, getArtwork } from "../../data/artworks";

/* Design tokens */
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

const STAGES = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];
const STAGE_KEY = "artnest_order_stage";
const DELIVERED = 4;

const ORDERS = [
  { id: "ART-2041", artId: 6, date: "24 Sep 2026", stage: 1, eta: "Arrives 4 Oct" },
  { id: "ART-1987", artId: 10, date: "12 Sep 2026", stage: 4, eta: "Delivered 19 Sep" },
  { id: "ART-1904", artId: 19, date: "28 Aug 2026", stage: 4, eta: "Delivered 3 Sep" },
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

const ALL_ARTISTS = [
  "Elena Voss", "Julian Cross", "Priya Nair", "Renzo Takahashi", "Aarav Mehta", "Ananya Deshpande"
];

/* -------------------------- Components -------------------------- */

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

function Tracker({ stage, dark = false }) {
  return (
    <ol className="mt-6 flex w-full items-start justify-between" aria-label="Order progress">
      {STAGES.map((s, i) => (
        <li key={s} className="relative flex flex-1 flex-col items-center">
          {i < STAGES.length - 1 && (
            <span
              className={`absolute top-4 left-[50%] h-0.5 w-full -z-10 ${i < stage ? "bg-[#D8A53A]" : dark ? "bg-white/20" : "bg-[#D5D9D2]"}`}
            />
          )}
          <span
            className={`grid h-8 w-8 place-items-center rounded-full z-10 ${
              i <= stage
                ? "bg-[#D8A53A] text-[#14181F]"
                : dark
                ? "border border-white/25 text-white/40 bg-[#14181F]"
                : "border border-[#D5D9D2] text-[#6C7480] bg-[#F8F9F8]"
            }`}
          >
            {i < stage || i === 0 ? (
              <Check size={15} />
            ) : i === stage ? (
              <Truck size={15} />
            ) : null}
          </span>
          <span
            className={`mt-2 text-center text-[11.5px] sm:text-[12px] leading-tight ${
              i <= stage ? (dark ? "text-white" : "text-[#14181F] font-medium") : dark ? "text-white/50" : "text-[#6C7480]"
            }`}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Thumb({ art, className = "h-16 w-16" }) {
  return <img src={art.img} alt={art.title} loading="lazy" className={`${className} shrink-0 rounded-sm object-cover`} />;
}

/* -------------------------- Modals & Local Storage -------------------------- */

const MSG_KEY = "artnest_messages";
function readThreads() {
  try { return JSON.parse(localStorage.getItem(MSG_KEY)) || []; } catch { return []; }
}
function saveThreads(threads) {
  try { localStorage.setItem(MSG_KEY, JSON.stringify(threads)); } catch {}
}

function ChatView({ thread, onBack }) {
  const [msgs, setMsgs] = useState(thread.msgs || []);
  const [text, setText] = useState("");

  const send = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const next = [...msgs, { from: "buyer", text: body, time }];
    setMsgs(next);
    setText("");
    
    const all = readThreads();
    const updated = all.map(t => t.id === thread.id ? { ...t, msgs: next } : t);
    saveThreads(updated);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[#D5D9D2] px-5 py-4 bg-white">
        <button onClick={onBack} className="p-1 hover:bg-[#EDEFEA] rounded-md transition-colors"><X size={20} className="text-[#6C7480]" /></button>
        <div>
          <p className="text-[16px] font-semibold text-[#14181F]" style={DISPLAY}>{thread.artist}</p>
          {thread.subject && <p className="text-[12.5px] text-[#6C7480]">{thread.subject}</p>}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {!msgs.length && <p className="text-center text-[13.5px] text-[#6C7480]">Start the conversation with {thread.artist}.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "buyer" ? "justify-end" : ""}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] ${m.from === "buyer" ? "rounded-br-sm bg-[#1F6F6B] text-white" : "rounded-bl-sm bg-white text-[#14181F]"}`}>
              <p>{m.text}</p>
              <p className={`mt-1 text-[11px] ${m.from === "buyer" ? "text-white/70" : "text-[#6C7480]"}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-3 border-t border-[#D5D9D2] p-4 bg-white">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="h-11 flex-1 rounded-md border border-[#D5D9D2] bg-[#EDEFEA] px-4 text-[14px] outline-none focus:border-[#1F6F6B]" />
        <button type="submit" disabled={!text.trim()} className="grid h-11 w-11 place-items-center rounded-md bg-[#14181F] text-white hover:bg-[#1F6F6B] disabled:opacity-50"><Send size={18} /></button>
      </form>
    </div>
  );
}

function InboxModal({ initialThread, onClose }) {
  const [threads, setThreads] = useState(readThreads());
  const [activeThread, setActiveThread] = useState(initialThread || null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(ALL_ARTISTS[0]);
  const [newSubject, setNewSubject] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!selectedArtist) return;

    // Check if thread already exists with this artist
    const exists = threads.find(t => t.artist === selectedArtist);
    if (exists) {
      setActiveThread(exists);
    } else {
      // Create new thread for selected artist
      const newThread = {
        id: `MSG-${Date.now()}`,
        artist: selectedArtist,
        subject: newSubject.trim() || "General Inquiry",
        msgs: []
      };
      const updated = [newThread, ...threads];
      setThreads(updated);
      saveThreads(updated);
      setActiveThread(newThread);
    }
    setIsCreating(false);
    setNewSubject("");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-[#14181F]/60" onClick={onClose} />
      <div className="relative flex h-[560px] max-h-[90vh] w-full max-w-[500px] flex-col overflow-hidden rounded-xl bg-[#EDEFEA] shadow-2xl">
        
        {activeThread ? (
          <ChatView thread={activeThread} onBack={() => setActiveThread(null)} />
        ) : (
          <>
            <div className="flex items-center justify-between bg-[#14181F] px-5 py-4">
              <div>
                <p className="text-[18px] font-semibold text-white" style={DISPLAY}>Messages</p>
                <p className="text-[12.5px] text-white/60">Your conversations with artists</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="text-[22px] leading-none text-white/70 hover:text-white">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EDEFEA]">
              {isCreating ? (
                <form onSubmit={handleCreate} className="rounded-xl border border-[#D5D9D2] bg-white p-4 shadow-sm">
                  <p className="text-[14px] font-medium text-[#14181F] mb-3">New Message</p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[12px] text-[#6C7480]">Select Artist</span>
                      <select 
                        value={selectedArtist} 
                        onChange={e => setSelectedArtist(e.target.value)}
                        className="mt-1 w-full h-10 rounded-md border border-[#D5D9D2] bg-white px-3 text-[14px] outline-none focus:border-[#1F6F6B]"
                      >
                        {ALL_ARTISTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[12px] text-[#6C7480]">Subject (Optional)</span>
                      <input 
                        type="text" 
                        value={newSubject} 
                        onChange={e => setNewSubject(e.target.value)} 
                        placeholder="e.g. Question about order" 
                        className="mt-1 w-full h-10 rounded-md border border-[#D5D9D2] bg-white px-3 text-[14px] outline-none focus:border-[#1F6F6B]" 
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="submit" className="flex-1 rounded-md bg-[#14181F] py-2 text-[13px] text-white hover:bg-[#1F6F6B]">Start Chat</button>
                    <button type="button" onClick={() => setIsCreating(false)} className="rounded-md border border-[#D5D9D2] bg-white px-4 py-2 text-[13px] text-[#6C7480] hover:bg-[#EDEFEA]">Cancel</button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setIsCreating(true)} 
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D5D9D2] bg-white/50 py-3 text-[14px] font-medium text-[#1F6F6B] transition-colors hover:bg-white"
                >
                  <Plus size={16} /> New Message
                </button>
              )}

              {threads.length === 0 && !isCreating ? (
                <div className="py-10 text-center">
                  <MessageCircle size={32} className="mx-auto text-[#D5D9D2] mb-3" />
                  <p className="text-[14px] text-[#6C7480]">No conversations yet.</p>
                  <p className="text-[13px] text-[#6C7480] mt-1">Click "New Message" to start.</p>
                </div>
              ) : (
                <div className="space-y-2 mt-4">
                  {threads.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setActiveThread(t)}
                      className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left shadow-sm transition-transform hover:scale-[1.01]"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1F6F6B]/10 text-[#1F6F6B] font-semibold">
                        {t.artist.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-[#14181F]">{t.artist}</p>
                        <p className="truncate text-[12.5px] text-[#6C7480]">{t.msgs?.[t.msgs.length - 1]?.text || "No messages yet"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onChat }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-[#14181F]/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative flex max-h-[90vh] w-full max-w-[500px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#D5D9D2] px-6 py-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[#14181F]" style={DISPLAY}>Order {order.id}</h2>
            <p className="text-[13px] text-[#6C7480]">Placed on {order.date}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#EDEFEA] text-[#6C7480] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-xl bg-[#F8F9F8] p-4 border border-[#D5D9D2]/50">
            <p className="text-[13px] font-medium text-[#14181F]">Status: {STAGES[order.stage]}</p>
            <Tracker stage={order.stage} />
            {order.eta && <p className="mt-2 text-center text-[13px] text-[#1F6F6B]">{order.eta}</p>}
          </div>
          <div>
            <h3 className="mb-3 text-[12px] uppercase tracking-wider text-[#6C7480]">Items Ordered</h3>
            <div className="flex items-center gap-4 rounded-lg border border-[#D5D9D2] p-3">
              <Thumb art={order.art} className="h-16 w-16 rounded-md" />
              <div className="flex-1">
                <p className="text-[15px] font-medium text-[#14181F]">{order.art.title}</p>
                <p className="text-[13px] text-[#6C7480]">by {order.art.artist}</p>
                <p className="mt-1 text-[14px] font-semibold text-[#14181F]">{inr(order.amount)}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-1.5 flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#6C7480]"><Truck size={14}/> Shipping</h3>
              <p className="text-[13px] text-[#14181F]">Standard Delivery</p>
            </div>
            <div>
              <h3 className="mb-1.5 flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#6C7480]"><CreditCard size={14}/> Payment</h3>
              <p className="text-[13px] text-[#14181F]">Paid via UPI</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#D5D9D2] bg-[#F8F9F8] px-6 py-4">
          <button type="button" onClick={onClose} className="text-[14px] font-medium text-[#6C7480] hover:text-[#14181F] transition-colors">
            Close
          </button>
          <button type="button" onClick={() => onChat(order)} className="inline-flex items-center gap-2 rounded-md bg-[#14181F] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#1F6F6B]">
            <MessageCircle size={16} /> Message Artist
          </button>
        </div>
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
  } catch { return []; }
}

const panelTitle = "text-[20px] font-semibold text-[#14181F]";
const linkCls = "text-[13.5px] font-medium text-[#1F6F6B] hover:underline";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { items: cart } = useCart();
  const { items: wishlist } = useWishlist();
  
  const [received, setReceived] = useState(() => {
    try { return JSON.parse(localStorage.getItem("artnest_received_orders")) || []; } catch { return []; }
  });
  
  const [detailsFor, setDetailsFor] = useState(null); 
  const [inboxOpen, setInboxOpen] = useState(false);
  const [initialChatThread, setInitialChatThread] = useState(null);

  const [, setTick] = useState(0);
  useEffect(() => {
    const onStorage = (e) => { if (e.key === STAGE_KEY) setTick((t) => t + 1); };
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
    try { localStorage.setItem("artnest_received_orders", JSON.stringify(next)); } catch {}
    setTimeout(() => setReviewFor(order), 2000);
  };

  // FIXED: This strictly opens the chat for the exact artist passed
  const openChatWithArtist = (artistName, subjectText = "") => {
    const threads = readThreads();
    let existing = threads.find(t => t.artist === artistName);
    
    // Agar us artist ka chat pehle se nahi hai, toh naya banao
    if (!existing) {
      existing = { 
        id: `MSG-${Date.now()}`, 
        artist: artistName, 
        subject: subjectText || "General Inquiry", 
        msgs: [] 
      };
      saveThreads([existing, ...threads]);
    }
    
    setDetailsFor(null); // Close order details
    setInitialChatThread(existing); // Set the EXACT artist thread
    setInboxOpen(true);
  };

  if (!user || user.role !== "buyer") return <Navigate to="/buyer/login" replace />;

  const demoOrders = ORDERS.map((o) => ({ ...o, art: getArtwork(o.artId) }))
    .filter((o) => o.art)
    .map((o) => ({ ...o, amount: o.art.value }));
  let artistStages = {};
  try { artistStages = JSON.parse(localStorage.getItem(STAGE_KEY)) || {}; } catch {}
  
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
      
      {inboxOpen && (
        <InboxModal 
          initialThread={initialChatThread} 
          onClose={() => { setInboxOpen(false); setInitialChatThread(null); }} 
        />
      )}
      
      {detailsFor && (
        <OrderDetailsModal 
          order={detailsFor} 
          onClose={() => setDetailsFor(null)} 
          onChat={(o) => openChatWithArtist(o.art.artist, `Order ${o.id} · ${o.art.title}`)} 
        />
      )}

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
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/discover" className="inline-flex items-center gap-1.5 rounded-md bg-[#D8A53A] px-5 py-2.5 text-[14px] font-medium text-[#14181F] transition-colors hover:bg-white">
                Browse artworks <ArrowUpRight size={16} />
              </Link>
              <button 
                onClick={() => { setInitialChatThread(null); setInboxOpen(true); }} 
                className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle size={18} /> Messages
              </button>
            </div>
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
              <Tracker stage={active.stage} dark />
              <button type="button" onClick={() => openChatWithArtist(active.art.artist, `Order ${active.id} · ${active.art.title}`)} className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/25 px-4 py-2 text-[14px] text-white transition-colors hover:bg-white/10">
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
          
          <section data-reveal>
            <div className="mb-4 flex items-baseline justify-between border-b-2 border-[#14181F] pb-2">
              <h2 className={panelTitle} style={DISPLAY}>Orders</h2>
              <Link to="/orders" className={linkCls}>View all</Link>
            </div>
            <ul>
              {orders.map((o) => (
                <li key={o.id} className="border-b border-[#D5D9D2]">
                  <div 
                    onClick={() => setDetailsFor(o)}
                    className="group flex cursor-pointer items-center gap-4 py-4 transition-colors hover:bg-black/5 rounded-lg px-2 -mx-2"
                  >
                    <Thumb art={o.art} className="h-14 w-14" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-[#14181F] group-hover:text-[#1F6F6B]">{o.art.title}</span>
                      <span className="text-[12.5px] text-[#6C7480]">{o.art.artist} · {o.id} · {o.date}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[15px] font-semibold text-[#14181F]" style={DISPLAY}>{inr(o.amount)}</span>
                      <span className={`mt-0.5 inline-block rounded-md px-2 py-0.5 text-[11.5px] ${o.stage === DELIVERED ? "bg-[#1F6F6B]/15 text-[#1F6F6B]" : "bg-[#D8A53A]/20 text-[#7A5A10]"}`}>{STAGES[o.stage]}</span>
                    </span>
                    <span className="ml-2 text-[13px] font-medium text-[#1F6F6B] opacity-0 group-hover:opacity-100 transition-opacity">
                      View details &rarr;
                    </span>
                  </div>
                  
                  <div className="pb-3 pl-[72px] flex items-center gap-4">
                    <button type="button" onClick={() => openChatWithArtist(o.art.artist, `Order ${o.id} · ${o.art.title}`)} className={linkCls}>Message {o.art.artist}</button>
                    {o.stage === DELIVERED && !received.includes(o.id) && (
                      <button type="button" onClick={() => markReceived(o)} className="text-[13px] font-medium text-[#1F6F6B] hover:underline">
                        Mark as received
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-10">
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