import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import discVideo from "../../assets/disc.mp4";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import {
  Search, Heart, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight,
  LayoutGrid, List, Eye, ArrowUpRight, ShoppingBag, Check, MapPin, Ruler,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;
const EASE = [0.16, 1, 0.3, 1];
const SORTS = ["Curated / Recommended", "Price: Low to High", "Price: High to Low", "Newest Arrivals"];
const SIZES = ["Small (< 40 cm)", "Medium (40–100 cm)", "Large (> 100 cm)"];

const CATEGORIES = [
  { id: "paintings", label: "Paintings", count: 415 },
  { id: "sculptures", label: "Sculptures", count: 226 },
  { id: "ceramics", label: "Ceramics & Pottery", count: 138 },
  { id: "photography", label: "Photography", count: 190 },
  { id: "digital", label: "Digital & New Media", count: 84 },
  { id: "textile", label: "Textile & Fiber Art", count: 61 },
  { id: "printmaking", label: "Printmaking & Monotype", count: 42 },
];

const MEDIUMS = ["Oil", "Acrylic", "Stoneware", "Bronze", "Linen", "Archival Ink", "Marble", "Porcelain", "Watercolor", "Charcoal", "Wood", "Glass"];

const U = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=900&auto=format&fit=crop`;
const BASE_ARTWORKS = [
  { id: 1, title: "Resonance in Sienna No. IV", artist: "Elena Voss", location: "Lyon, France", category: "paintings", medium: "Oil on Heavy Canvas", dims: "120 x 90 cm", value: 4200, img: U("1541961017774-22349e4a1262"), tag: "Original Oil" },
  { id: 2, title: "Volcanic Tellic Amphora", artist: "Renzo Takahashi", location: "Kyoto, Japan", category: "ceramics", medium: "Stoneware & Ash Glaze", dims: "44 x 28 cm", value: 850, img: U("1610701596007-11502861dcfa"), tag: "Wood-Fired Stoneware" },
  { id: 3, title: "Tectonic Equilibrium", artist: "Matteo Rinni", location: "Carrara, Italy", category: "sculptures", medium: "Hand-Carved Marble", dims: "60 x 38 x 30 cm", value: 7800, img: U("1554188248-986adbb73be4"), tag: "Carved Travertine" },
  { id: 4, title: "Strata of Winter Breath", artist: "Astrid Lindgren", location: "Stockholm, Sweden", category: "textile", medium: "Woven Linen & Wool", dims: "140 x 85 cm", value: 1950, img: U("1600166898405-da9535204843"), tag: "Textile Sculpture" },
  { id: 5, title: "Shadows of the Solstice", artist: "Mateo Morales", location: "Oaxaca, Mexico", category: "photography", medium: "Archival Pigment on Rag", dims: "64 x 45 cm", value: 680, img: U("1519681393784-d120267933ba"), tag: "Limited Edition Print" },
  { id: 6, title: "Echoes in Ochre", artist: "Julian Cross", location: "London, UK", category: "paintings", medium: "Acrylic & Mineral Gesso", dims: "110 x 95 cm", value: 3100, img: U("1579783902614-a3fb3927b6a5"), tag: "Mixed Media on Canvas" },
  { id: 7, title: "Quiet Basin, Study II", artist: "Noor Haddad", location: "Amman, Jordan", category: "ceramics", medium: "Porcelain & Slip", dims: "30 x 30 cm", value: 1120, img: U("1565193566173-7a0ee3dbe261"), tag: "Thrown Porcelain" },
  { id: 8, title: "Fold, Unfold", artist: "Priya Nair", location: "Kochi, India", category: "sculptures", medium: "Cast Bronze", dims: "52 x 20 x 20 cm", value: 5400, img: U("1544967082-d9d25d867d66"), tag: "Limited Cast, 3 of 9" },
  { id: 9, title: "Signal Garden", artist: "Theo Baptiste", location: "Montreal, Canada", category: "digital", medium: "Generative Print on Archival Paper", dims: "80 x 80 cm", value: 2250, img: U("1620121692029-d088224ddc74"), tag: "Digital / New Media" },
  { id: 10, title: "Marigold Hour", artist: "Ananya Deshpande", location: "Jaipur, India", category: "paintings", medium: "Watercolor on Cotton Paper", dims: "56 x 76 cm", value: 980, img: U("1578926288207-a90a5366759d"), tag: "Original Watercolor" },
  { id: 11, title: "Ashen Coastline", artist: "Bjorn Halvorsen", location: "Bergen, Norway", category: "photography", medium: "Silver Gelatin Print", dims: "50 x 60 cm", value: 1450, img: U("1500534623283-312aade485b7"), tag: "Fine Art Black & White" },
  { id: 12, title: "Vessel of Small Mercies", artist: "Renzo Takahashi", location: "Kyoto, Japan", category: "ceramics", medium: "Raku Stoneware", dims: "24 x 24 cm", value: 620, img: U("1493106819501-66d381c466f1"), tag: "Raku Fired" },
  { id: 13, title: "Woven Meridian", artist: "Astrid Lindgren", location: "Stockholm, Sweden", category: "textile", medium: "Hand-Knotted Wool Tapestry", dims: "180 x 120 cm", value: 3400, img: U("1615529162924-f8605388461d"), tag: "Tapestry" },
  { id: 14, title: "Fault Lines, Study I", artist: "Matteo Rinni", location: "Carrara, Italy", category: "sculptures", medium: "Bronze on Granite Base", dims: "40 x 22 x 18 cm", value: 4650, img: U("1577083552431-6e5fd01aa342"), tag: "Limited Cast, 5 of 12" },
  { id: 15, title: "Monsoon Interior", artist: "Priya Nair", location: "Kochi, India", category: "paintings", medium: "Charcoal & Ink on Paper", dims: "70 x 100 cm", value: 1580, img: U("1549289524-06cf8837ace5"), tag: "Charcoal Drawing" },
  { id: 16, title: "Latticework No. 7", artist: "Theo Baptiste", location: "Montreal, Canada", category: "digital", medium: "Algorithmic Light Installation Print", dims: "90 x 60 cm", value: 2900, img: U("1633186710895-309db2eca9e4"), tag: "Digital / New Media" },
  { id: 17, title: "Blown Horizon Vessel", artist: "Noor Haddad", location: "Amman, Jordan", category: "sculptures", medium: "Hand-Blown Glass", dims: "35 x 18 cm", value: 1780, img: U("1602526216832-b3ce07688f9c"), tag: "Hand-Blown Glass" },
  { id: 18, title: "Relief in Walnut", artist: "Bjorn Halvorsen", location: "Bergen, Norway", category: "sculptures", medium: "Carved Walnut Wood", dims: "48 x 32 x 10 cm", value: 2350, img: U("1567696911980-2eed69a46042"), tag: "Carved Wood Relief" },
  { id: 19, title: "Riverbed Monotype III", artist: "Ananya Deshpande", location: "Jaipur, India", category: "printmaking", medium: "Monotype on Rag Paper", dims: "38 x 50 cm", value: 540, img: U("1578301978018-3005759f48f7"), tag: "Monotype Print" },
  { id: 20, title: "Threadbare Constellations", artist: "Julian Cross", location: "London, UK", category: "textile", medium: "Embroidery on Linen", dims: "60 x 60 cm", value: 1290, img: U("1520222984843-df35ebc0f24d"), tag: "Hand Embroidery" },
];

const loadArtistArtworks = () => {
  try {
    return (JSON.parse(localStorage.getItem("artnest_artist_artworks")) || []).filter(
      (a) => a.status === "Published" && a.img
    );
  } catch {
    return [];
  }
};

const longestSide = (dims = "") => Math.max(0, ...(dims.match(/\d+(\.\d+)?/g) || []).map(Number));
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label;

function Chip({ active, onClick, children }) {
  return (
    <button className={`disc-chip ${active ? "is-active" : ""}`} onClick={onClick} type="button" aria-pressed={active}>
      {active && <Check size={12} strokeWidth={2.4} />}
      {children}
    </button>
  );
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="disc-checkrow">
      <input type="checkbox" className="disc-sr" checked={checked} onChange={onChange} />
      <span className={`disc-checkbox ${checked ? "is-checked" : ""}`}>
        <motion.svg viewBox="0 0 12 10" initial={false} animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.6 }} transition={{ duration: 0.15 }}>
          <path d="M1 5L4.2 8.2L11 1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </span>
      <span className="disc-checklabel">{label}</span>
      {typeof count === "number" && <span className="disc-checkcount">{count}</span>}
    </label>
  );
}

function Hero({ query, setQuery }) {
  const rise = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });
  return (
    <section className="disc-hero">
      <video className="disc-hero-bg" src={discVideo} poster={"https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1920&auto=format&fit=crop"} autoPlay muted loop playsInline />
      <div className="disc-hero-scrim" />
      <div className="disc-hero-inner">
        <motion.p className="disc-hero-eyebrow" {...rise(0)}>
          <span className="disc-hero-rule" /> The Foundry Collection <span className="disc-hero-rule" />
        </motion.p>
        <motion.h1 className="disc-hero-title" {...rise(0.08)}>
          Original works, chosen
          <br />
          by hand, held in trust.
        </motion.h1>
        <motion.p className="disc-hero-sub" {...rise(0.18)}>
          Browse a living archive of paintings, sculpture, ceramics and print, each piece vetted by a curator before it reaches you.
        </motion.p>
        <motion.form
          className="disc-hero-search"
          {...rise(0.28)}
          onSubmit={(e) => {
            e.preventDefault();
            document.querySelector(".disc-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <Search size={18} strokeWidth={1.8} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or artist…"
            aria-label="Search artworks"
          />
          {query && (
            <button type="button" className="disc-hero-clear" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
          <button type="submit" className="disc-hero-go">Explore</button>
        </motion.form>
      </div>
      <div className="disc-hero-fade" />
    </section>
  );
}

function Sidebar({ activeCategories, toggleCategory, price, setPrice, mediums, toggleMedium, size, setSize, onClear, mobileOpen, setMobileOpen }) {
  const pct = ((price[1] - 100) / (9500 - 100)) * 100;
  const content = (
    <>
      <div className="disc-sidebar-head">
        <h3>Filters</h3>
        <button className="disc-clear" onClick={onClear} type="button">Clear all</button>
      </div>

      <div className="disc-filter-group">
        <h4>Category</h4>
        {CATEGORIES.map((c) => (
          <Checkbox key={c.id} checked={activeCategories.includes(c.id)} onChange={() => toggleCategory(c.id)} label={c.label} count={c.count} />
        ))}
      </div>

      <div className="disc-filter-group">
        <h4>Maximum price</h4>
        <div className="disc-price-labels">
          <span>₹{price[0].toLocaleString()}</span>
          <strong>₹{price[1].toLocaleString()}</strong>
        </div>
        <input
          className="disc-range"
          type="range"
          min={100}
          max={9500}
          step={50}
          value={price[1]}
          style={{ "--pct": `${pct}%` }}
          onChange={(e) => setPrice([price[0], Number(e.target.value)])}
          aria-label="Maximum price"
        />
      </div>

      <div className="disc-filter-group">
        <h4>Medium & material</h4>
        <div className="disc-pillwrap">
          {MEDIUMS.map((m) => (
            <Chip key={m} active={mediums.includes(m)} onClick={() => toggleMedium(m)}>{m}</Chip>
          ))}
        </div>
      </div>

      <div className="disc-filter-group">
        <h4>Size</h4>
        {SIZES.map((s) => (
          <label key={s} className="disc-radiorow">
            <input type="radio" name="disc-size" className="disc-sr" checked={size === s} onChange={() => setSize(s)} />
            <span className={`disc-radio ${size === s ? "is-checked" : ""}`}><span className="disc-radio-dot" /></span>
            <span>{s}</span>
          </label>
        ))}
      </div>
    </>
  );

  return (
    <>
      <aside className="disc-sidebar">{content}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="disc-drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside className="disc-drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.32, ease: EASE }}>
              <button className="disc-drawer-close" onClick={() => setMobileOpen(false)} type="button" aria-label="Close filters">
                <X size={18} />
              </button>
              {content}
              <button className="disc-acquire disc-drawer-apply" type="button" onClick={() => setMobileOpen(false)}>Show results</button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ArtworkCard({ art, view, favorite, toggleFavorite, onOpen, onPreview }) {
  return (
    <motion.article
      className={`disc-card ${view === "list" ? "is-list" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="disc-card-media" onClick={() => onOpen(art)}>
        <img src={art.img} alt={art.title} loading="lazy" />
        <span className="disc-card-tag">{art.tag}</span>
        <button
          className="disc-card-peek"
          type="button"
          onClick={(e) => { e.stopPropagation(); onPreview(art); }}
        >
          <Eye size={14} /> Quick view
        </button>
      </div>
      <button
        className={`disc-fav ${favorite ? "is-fav" : ""}`}
        onClick={() => toggleFavorite(art.id)}
        type="button"
        aria-label={favorite ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={favorite}
      >
        <motion.span whileTap={{ scale: 0.75 }} style={{ display: "flex" }}>
          <Heart size={16} strokeWidth={1.8} fill={favorite ? "currentColor" : "none"} />
        </motion.span>
      </button>

      <div className="disc-card-body">
        <p className="disc-card-artist">{art.artist}</p>
        <h3 className="disc-card-title">{art.title}</h3>
        <p className="disc-card-meta"><MapPin size={12} /> {art.location}</p>
        <p className="disc-card-medium"><Ruler size={12} /> {art.medium} · {art.dims}</p>

        <div className="disc-card-footer">
          <div>
            <span className="disc-card-value-label">Current value</span>
            <span className="disc-card-value">₹{art.value.toLocaleString()}</span>
          </div>
          <button className="disc-acquire" type="button" onClick={() => onOpen(art)}>
            View <ArrowUpRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ArtworkDetailModal({ art, onClose, favorite, toggleFavorite }) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [toast, setToast] = useState("");
  const { inCart, toggleCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (showFullImage) setShowFullImage(false);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showFullImage, onClose]);

  if (!art) return null;

  const carted = inCart.has(art.id);
  const handleWishlist = () => {
    toggleFavorite(art.id);
    setToast(favorite ? "Removed from wishlist" : "Added to wishlist");
  };
  const handleCart = () => {
    if (carted) return navigate("/cart");
    toggleCart(art);
    setToast("Added to cart");
  };

  return (
    <>
      <motion.div className="disc-modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <div className="disc-modal-wrap">
        <motion.div
          className="disc-modal"
          role="dialog"
          aria-modal="true"
          aria-label={art.title}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <button className="disc-modal-close" onClick={onClose} type="button" aria-label="Close"><X size={18} /></button>

          <div className="disc-modal-media">
            <img src={art.img} alt={art.title} />
            <button className="disc-modal-preview" type="button" onClick={() => setShowFullImage(true)} aria-label="View full image">
              <Eye size={22} strokeWidth={1.6} />
            </button>
          </div>

          <div className="disc-modal-body">
            <span className="disc-modal-tag">{art.tag}</span>
            <h2 className="disc-modal-title">{art.title}</h2>
            <p className="disc-modal-artist">{art.artist} <span>· {art.location}</span></p>

            <div className="disc-modal-specs">
              <div><span>Medium</span><p>{art.medium}</p></div>
              <div><span>Dimensions</span><p>{art.dims}</p></div>
              <div><span>Category</span><p>{catLabel(art.category)}</p></div>
            </div>

            <div className="disc-modal-desc">
              <h4>About this piece</h4>
              {art.description && <p>{art.description}</p>}
              <p>
                "{art.title}" is an original work by {art.artist}, created in {art.location}. Rendered in {art.medium.toLowerCase()}, it measures {art.dims} and belongs to our {catLabel(art.category)?.toLowerCase()} collection. Each work is inspected and catalogued by our curators before listing, so condition, provenance and authenticity meet gallery standard.
              </p>
            </div>

            <div className="disc-modal-provenance">
              <div>
                <span className="disc-modal-provenance-label">Provenance</span>
                <p>Acquired directly from the artist's studio in {art.location}. Certificate of authenticity included.</p>
              </div>
              <div>
                <span className="disc-modal-provenance-label">Shipping & framing</span>
                <p>Ships in protective archival packaging within 5–9 business days. Custom framing available on request.</p>
              </div>
            </div>

            <div className="disc-modal-footer">
              <div>
                <span className="disc-card-value-label">Current value</span>
                <span className="disc-modal-value">₹{art.value.toLocaleString()}</span>
              </div>
              <div className="disc-modal-actions">
                <AnimatePresence>
                  {toast && (
                    <motion.span key={toast} className="disc-modal-toast" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}>
                      <Check size={12} strokeWidth={2.4} /> {toast}
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  className={`disc-wish-btn ${favorite ? "is-fav" : ""}`}
                  type="button"
                  onClick={handleWishlist}
                  data-tip={favorite ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <motion.span whileTap={{ scale: 0.8 }} style={{ display: "flex" }}>
                    <Heart size={18} strokeWidth={1.8} fill={favorite ? "currentColor" : "none"} />
                  </motion.span>
                </button>
                <button className="disc-acquire is-lg" type="button" onClick={handleCart}>
                  <ShoppingBag size={16} strokeWidth={1.9} />
                  {carted ? "View cart" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFullImage && (
          <motion.div className="disc-fullimage-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullImage(false)}>
            <img src={art.img} alt={art.title} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Discover() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState([]);
  const [price, setPrice] = useState([100, 9500]);
  const [mediums, setMediums] = useState([]);
  const [size, setSize] = useState("");
  const [sort, setSort] = useState(SORTS[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedArt, setSelectedArt] = useState(null);
  const [previewArt, setPreviewArt] = useState(null);
  const { favorites, toggle } = useWishlist();

  useEffect(() => {
    if (!previewArt) return;
    const onKey = (e) => e.key === "Escape" && setPreviewArt(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [previewArt]);
  const ARTWORKS = useMemo(() => [...loadArtistArtworks(), ...BASE_ARTWORKS], []);

  useEffect(() => {
    const c = searchParams.get("category");
    if (c && CATEGORIES.some((x) => x.id === c)) setActiveCategories([c]);
  }, [searchParams]);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s) setQuery(s);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [activeCategories, price, query, mediums, size, sort]);

  const toggleCategory = (id) => setActiveCategories((p) => (p.includes(id) ? p.filter((c) => c !== id) : [...p, id]));
  const toggleMedium = (m) => setMediums((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));
  const toggleFavorite = (id) => {
    const art = ARTWORKS.find((a) => a.id === id);
    if (art) toggle(art);
  };
  const clearAll = () => {
    setActiveCategories([]);
    setPrice([100, 9500]);
    setMediums([]);
    setSize("");
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ARTWORKS.filter((a) => {
      if (activeCategories.length && !activeCategories.includes(a.category)) return false;
      if (a.value > price[1]) return false;
      if (q && !`${a.title} ${a.artist} ${a.medium}`.toLowerCase().includes(q)) return false;
      if (mediums.length && !mediums.some((m) => a.medium.toLowerCase().includes(m.toLowerCase()))) return false;
      if (size) {
        const s = longestSide(a.dims);
        if (size.startsWith("Small") && !(s < 40)) return false;
        if (size.startsWith("Medium") && !(s >= 40 && s <= 100)) return false;
        if (size.startsWith("Large") && !(s > 100)) return false;
      }
      return true;
    });
    if (sort === "Price: Low to High") list.sort((a, b) => a.value - b.value);
    if (sort === "Price: High to Low") list.sort((a, b) => b.value - a.value);
    if (sort === "Newest Arrivals") list.sort((a, b) => Number(b.id) - Number(a.id));
    return list;
  }, [ARTWORKS, activeCategories, price, query, mediums, size, sort]);

  const goToPage = (n) => {
    setPage(n);
    document.querySelector(".disc-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const activeChips = [
    ...activeCategories.map((id) => ({ key: `c-${id}`, label: catLabel(id), remove: () => toggleCategory(id) })),
    ...mediums.map((m) => ({ key: `m-${m}`, label: m, remove: () => toggleMedium(m) })),
    ...(size ? [{ key: "size", label: size, remove: () => setSize("") }] : []),
    ...(price[1] < 9500 ? [{ key: "price", label: `Up to ₹${price[1].toLocaleString()}`, remove: () => setPrice([100, 9500]) }] : []),
  ];

  return (
    <div className="disc-app">
      <Hero query={query} setQuery={setQuery} />

      <div className="disc-shell">
        <Sidebar
          activeCategories={activeCategories} toggleCategory={toggleCategory}
          price={price} setPrice={setPrice}
          mediums={mediums} toggleMedium={toggleMedium}
          size={size} setSize={setSize}
          onClear={clearAll} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        />

        <main className="disc-main">
          <div className="disc-toolbar">
            <button className="disc-filter-toggle" onClick={() => setMobileOpen(true)} type="button">
              <SlidersHorizontal size={16} strokeWidth={1.8} /> Filters
              {activeChips.length > 0 && <b>{activeChips.length}</b>}
            </button>

            <p className="disc-count">
              <strong>{filtered.length.toLocaleString()}</strong> original artworks <span>· {sort}</span>
            </p>

            <div className="disc-toolbar-right">
              <div className="disc-sort">
                <button onClick={() => setSortOpen((s) => !s)} type="button" aria-haspopup="listbox" aria-expanded={sortOpen}>
                  {sort}
                  <ChevronDown size={14} style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul role="listbox" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                      {SORTS.map((s) => (
                        <li
                          key={s}
                          role="option"
                          aria-selected={s === sort}
                          className={s === sort ? "is-active" : ""}
                          onClick={() => { setSort(s); setSortOpen(false); }}
                        >
                          {s}
                          {s === sort && <Check size={14} strokeWidth={2.2} />}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="disc-viewtoggle">
                <button className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} type="button" aria-label="Grid view">
                  <LayoutGrid size={16} strokeWidth={1.8} />
                </button>
                <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} type="button" aria-label="List view">
                  <List size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="disc-active">
              {activeChips.map((c) => (
                <button key={c.key} type="button" className="disc-active-chip" onClick={c.remove}>
                  {c.label} <X size={12} strokeWidth={2.2} />
                </button>
              ))}
              <button type="button" className="disc-clear" onClick={clearAll}>Clear all</button>
            </div>
          )}

          <div key={`${currentPage}-${view}`} className={`disc-grid ${view === "list" ? "is-list" : ""}`}>
            {paginated.map((art) => (
              <ArtworkCard
                key={art.id} art={art} view={view}
                favorite={favorites.has(art.id)}
                toggleFavorite={toggleFavorite}
                onOpen={setSelectedArt}
                onPreview={setPreviewArt}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="disc-empty">
              <Search size={28} strokeWidth={1.4} />
              <p>No artworks match these filters.</p>
              <span>Try removing a filter or raising the price limit.</span>
              <button onClick={clearAll} type="button" className="disc-acquire">Clear filters</button>
            </div>
          )}

          {filtered.length > 0 && (
            <nav className="disc-pagination" aria-label="Pagination">
              <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} type="button" aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} className={currentPage === n ? "is-active" : ""} onClick={() => goToPage(n)} type="button" aria-current={currentPage === n ? "page" : undefined}>
                  {n}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} type="button" aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </main>
      </div>

      <AnimatePresence>
        {selectedArt && (
          <ArtworkDetailModal
            art={selectedArt}
            onClose={() => setSelectedArt(null)}
            favorite={favorites.has(selectedArt.id)}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {previewArt && (
          <motion.div
            className="disc-fullimage-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewArt(null)}
          >
            <img src={previewArt.img} alt={previewArt.title} />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');

        .disc-app {
          --ink: #1c1712; --ink-soft: #4a423a; --muted: #8c7f68;
          --paper: #f6f1e6; --paper-2: #efe6d3; --card: #fbf8f1; --line: #e0d4bc;
          --brass: #96702f; --brass-deep: #6f5222; --wine: #5c2b30;
          --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
          --sans: "Work Sans", "Inter", system-ui, sans-serif;
          --shadow-sm: 0 1px 2px rgba(60,40,10,.06), 0 2px 8px rgba(60,40,10,.05);
          --shadow-md: 0 2px 4px rgba(60,40,10,.06), 0 18px 40px -12px rgba(60,40,10,.22);
          background: var(--paper); color: var(--ink); font-family: var(--sans); min-height: 100vh;
        }
        .disc-app * { box-sizing: border-box; }
        .disc-app button { font-family: var(--sans); }
        .disc-app :focus-visible { outline: 2px solid var(--brass); outline-offset: 2px; }
        .disc-sr { position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none; }

        .disc-hero { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; color: #f6f1e6; padding-top: 64px; }
        .disc-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 40%; transform: scale(1.02); }
        .disc-hero-scrim {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 55% at 50% 50%, rgba(20,15,10,.72) 0%, rgba(20,15,10,.4) 55%, rgba(20,15,10,0) 100%),
            linear-gradient(180deg, rgba(20,15,10,.55) 0%, rgba(20,15,10,.3) 40%, rgba(20,15,10,.86) 100%);
        }
        .disc-hero-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 120px; background: linear-gradient(180deg, transparent, var(--paper)); }
        .disc-hero-inner { position: relative; z-index: 2; max-width: 780px; margin: 0 auto; padding: 0 28px; text-align: center; }
        .disc-hero-eyebrow { display: inline-flex; align-items: center; gap: 14px; font-size: 13px; letter-spacing: .06em; color: #e0cc98; margin: 0 0 22px; font-weight: 500; }
        .disc-hero-rule { width: 36px; height: 1px; background: linear-gradient(90deg, transparent, #d9c48f); }
        .disc-hero-rule:last-child { transform: scaleX(-1); }
        .disc-hero-title { font-family: var(--serif); font-weight: 500; font-size: clamp(36px, 5.4vw, 62px); line-height: 1.08; margin: 0 0 22px; letter-spacing: -0.015em; text-wrap: balance; text-shadow: 0 2px 30px rgba(0,0,0,.35); }
        .disc-hero-sub { font-size: 16.5px; line-height: 1.65; color: #ece3d0; max-width: 540px; margin: 0 auto 38px; }
        .disc-hero-search {
          display: flex; align-items: center; gap: 10px; max-width: 580px; margin: 0 auto;
          background: rgba(251,248,241,.97); color: var(--ink); border-radius: 999px;
          padding: 7px 7px 7px 22px; box-shadow: 0 24px 50px -10px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.4) inset;
          transition: box-shadow .25s ease;
        }
        .disc-hero-search:focus-within { box-shadow: 0 24px 50px -10px rgba(0,0,0,.45), 0 0 0 3px rgba(217,196,143,.7); }
        .disc-hero-search > svg { color: var(--brass-deep); flex-shrink: 0; }
        .disc-hero-search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-family: var(--sans); font-size: 14.5px; color: var(--ink); padding: 11px 0; }
        .disc-hero-search input::placeholder { color: #8a7f6d; }
        .disc-hero-clear { border: none; background: var(--paper-2); color: var(--ink-soft); width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; cursor: pointer; }
        .disc-hero-go { background: var(--ink); color: var(--paper); border: none; border-radius: 999px; padding: 12px 24px; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: background .2s, transform .15s; }
        .disc-hero-go:hover { background: var(--brass-deep); }
        .disc-hero-go:active { transform: scale(.97); }

        .disc-shell { display: grid; grid-template-columns: 280px 1fr; gap: 40px; max-width: 1360px; margin: 0 auto; padding: 40px 28px 90px; align-items: start; }

        .disc-sidebar { position: sticky; top: 84px; max-height: calc(100vh - 104px); overflow-y: auto; background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 22px 22px 8px; box-shadow: var(--shadow-sm); scrollbar-width: none; -ms-overflow-style: none; }
.disc-sidebar::-webkit-scrollbar { display: none; }
        .disc-drawer-scrim { position: fixed; inset: 0; background: rgba(20,15,10,.5); backdrop-filter: blur(2px); z-index: 40; }
        .disc-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 320px; background: var(--paper); z-index: 41; padding: 20px 22px 24px; overflow-y: auto; box-shadow: 20px 0 50px rgba(0,0,0,.25); }
        .disc-drawer-close { background: var(--paper-2); border: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; margin-bottom: 14px; cursor: pointer; color: var(--ink); }
        .disc-drawer-apply { width: 100%; justify-content: center; margin-top: 20px; padding: 13px; }
        .disc-sidebar-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; }
        .disc-sidebar-head h3 { font-family: var(--serif); font-size: 21px; font-weight: 500; margin: 0; }
        .disc-clear { background: none; border: none; color: var(--brass-deep); font-size: 12.5px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; padding: 4px; }
        .disc-clear:hover { color: var(--wine); }
        .disc-filter-group { padding: 18px 0; border-bottom: 1px solid var(--line); }
        .disc-filter-group:last-child { border-bottom: none; }
        .disc-filter-group h4 { font-size: 13px; font-weight: 600; margin: 0 0 12px; color: var(--ink); }

        .disc-checkrow, .disc-radiorow { position: relative; display: flex; align-items: center; gap: 11px; padding: 7px 8px; margin: 0 -8px; border-radius: 8px; cursor: pointer; font-size: 13.5px; transition: background .15s; }
        .disc-checkrow:hover, .disc-radiorow:hover { background: var(--paper-2); }
        .disc-checkrow:has(:focus-visible), .disc-radiorow:has(:focus-visible) { outline: 2px solid var(--brass); }
        .disc-checkbox { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #b7a682; display: grid; place-items: center; color: #fff; flex-shrink: 0; background: var(--card); transition: background .15s, border-color .15s; }
        .disc-checkbox.is-checked { background: var(--brass-deep); border-color: var(--brass-deep); }
        .disc-checkbox svg { width: 10px; height: 8px; }
        .disc-checklabel { flex: 1; }
        .disc-checkcount { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
        .disc-radio { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid #b7a682; display: grid; place-items: center; flex-shrink: 0; background: var(--card); transition: border-color .15s; }
        .disc-radio.is-checked { border-color: var(--brass-deep); }
        .disc-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: transparent; transition: background .15s, transform .15s; transform: scale(.4); }
        .disc-radio.is-checked .disc-radio-dot { background: var(--brass-deep); transform: scale(1); }

        .disc-price-labels { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 12px; color: var(--ink-soft); }
        .disc-price-labels strong { color: var(--brass-deep); font-weight: 600; }
        .disc-range { -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 99px; background: linear-gradient(90deg, var(--brass-deep) var(--pct, 100%), var(--line) var(--pct, 100%)); outline-offset: 6px; }
        .disc-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--card); border: 2px solid var(--brass-deep); box-shadow: 0 2px 6px rgba(60,40,10,.3); cursor: grab; transition: transform .15s; }
        .disc-range::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .disc-range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--card); border: 2px solid var(--brass-deep); box-shadow: 0 2px 6px rgba(60,40,10,.3); cursor: grab; }

        .disc-pillwrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .disc-chip { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--line); background: var(--card); padding: 6px 12px; border-radius: 999px; font-size: 12.5px; cursor: pointer; color: var(--ink-soft); transition: all .15s ease; }
        .disc-chip:hover { border-color: var(--brass); color: var(--ink); }
        .disc-chip.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }

        .disc-toolbar { display: flex; align-items: center; gap: 18px; margin-bottom: 18px; flex-wrap: wrap; scroll-margin-top: 90px; }
        .disc-filter-toggle { display: none; align-items: center; gap: 8px; border: 1px solid var(--line); background: var(--card); padding: 9px 16px; border-radius: 999px; font-size: 13px; cursor: pointer; color: var(--ink); box-shadow: var(--shadow-sm); }
        .disc-filter-toggle b { background: var(--brass-deep); color: #fff; font-size: 11px; font-weight: 600; min-width: 18px; height: 18px; border-radius: 99px; display: grid; place-items: center; padding: 0 5px; }
        .disc-count { font-size: 14px; color: var(--ink-soft); margin: 0; flex: 1; }
        .disc-count strong { color: var(--ink); font-family: var(--serif); font-size: 18px; font-weight: 500; margin-right: 2px; }
        .disc-count span { color: var(--muted); }
        .disc-toolbar-right { display: flex; align-items: center; gap: 12px; }
        .disc-sort { position: relative; }
        .disc-sort > button { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--line); padding: 9px 16px; border-radius: 999px; font-size: 13px; cursor: pointer; color: var(--ink); box-shadow: var(--shadow-sm); transition: border-color .15s; }
        .disc-sort > button:hover { border-color: var(--brass); }
        .disc-sort ul { position: absolute; right: 0; top: calc(100% + 8px); background: var(--card); border: 1px solid var(--line); border-radius: 14px; list-style: none; padding: 6px; margin: 0; width: 220px; box-shadow: var(--shadow-md); z-index: 10; }
        .disc-sort li { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; font-size: 13px; border-radius: 9px; cursor: pointer; }
        .disc-sort li:hover { background: var(--paper-2); }
        .disc-sort li.is-active { color: var(--brass-deep); font-weight: 500; }
        .disc-viewtoggle { display: flex; padding: 3px; gap: 2px; background: var(--card); border: 1px solid var(--line); border-radius: 999px; box-shadow: var(--shadow-sm); }
        .disc-viewtoggle button { background: transparent; border: none; width: 34px; height: 32px; border-radius: 999px; display: grid; place-items: center; cursor: pointer; color: var(--ink-soft); transition: background .15s, color .15s; }
        .disc-viewtoggle button.is-active { background: var(--ink); color: var(--paper); }

        .disc-active { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 20px; }
        .disc-active-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--paper-2); border: 1px solid var(--line); color: var(--ink); padding: 5px 8px 5px 12px; border-radius: 999px; font-size: 12.5px; cursor: pointer; transition: border-color .15s, background .15s; }
        .disc-active-chip:hover { border-color: var(--wine); background: #f1e2dc; }

        .disc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .disc-grid.is-list { grid-template-columns: 1fr; }
        .disc-card { position: relative; background: var(--card); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--shadow-sm); transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .25s; }
        .disc-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: #cdbb97; }
        .disc-card.is-list { flex-direction: row; align-items: stretch; }
        .disc-card.is-list .disc-card-media { width: 280px; flex-shrink: 0; aspect-ratio: auto; min-height: 240px; }
        .disc-card.is-list .disc-card-body { flex: 1; padding: 22px 24px; }
        .disc-card.is-list .disc-card-title { font-size: 21px; -webkit-line-clamp: 1; min-height: 0; }
        .disc-card-media { position: relative; aspect-ratio: 4/4.2; overflow: hidden; cursor: pointer; background: var(--paper-2); }
        .disc-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s cubic-bezier(.16,1,.3,1); }
        .disc-card:hover .disc-card-media img { transform: scale(1.06); }
        .disc-card-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,15,10,0) 55%, rgba(20,15,10,.5) 100%); opacity: 0; transition: opacity .3s; pointer-events: none; }
        .disc-card:hover .disc-card-media::after { opacity: 1; }
        .disc-card-tag { position: absolute; top: 12px; left: 12px; z-index: 1; background: rgba(251,248,241,.9); backdrop-filter: blur(8px); color: var(--ink); font-size: 11.5px; font-weight: 500; padding: 5px 11px; border-radius: 999px; max-width: calc(100% - 70px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .disc-card-peek { position: absolute; left: 50%; bottom: 14px; z-index: 1; display: inline-flex; align-items: center; gap: 6px; background: var(--paper); color: var(--ink); font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 999px; transform: translate(-50%, 10px); opacity: 0; transition: opacity .3s, transform .3s cubic-bezier(.16,1,.3,1); border: none; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,.25); }
.disc-card-peek:hover { background: #fff; }
.disc-card-peek:focus-visible { opacity: 1; transform: translate(-50%, 0); }
        .disc-card:hover .disc-card-peek { opacity: 1; transform: translate(-50%, 0); }
        .disc-fav { position: absolute; top: 10px; right: 10px; z-index: 2; width: 36px; height: 36px; border-radius: 50%; background: rgba(251,248,241,.92); backdrop-filter: blur(8px); border: none; display: grid; place-items: center; color: var(--ink-soft); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.15); transition: color .2s, transform .2s; }
        .disc-fav:hover { color: var(--wine); transform: scale(1.08); }
        .disc-fav.is-fav { color: var(--wine); }

        .disc-card-body { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .disc-card-artist { font-size: 12.5px; font-weight: 500; color: var(--brass-deep); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .disc-card-title { font-family: var(--serif); font-weight: 500; font-size: 19px; margin: 2px 0 6px; color: var(--ink); line-height: 1.28; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: calc(1.28em * 2); }
        .disc-card-meta, .disc-card-medium { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--ink-soft); margin: 0; }
        .disc-card-meta svg, .disc-card-medium svg { color: var(--muted); flex-shrink: 0; }
        .disc-card-medium { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .disc-card-footer { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 16px; border-top: 1px dashed var(--line); margin-top: 14px; }
        .disc-card-value-label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 1px; }
        .disc-card-value { font-family: var(--serif); font-size: 20px; font-weight: 500; font-variant-numeric: lining-nums; }

        .disc-acquire { display: inline-flex; align-items: center; gap: 6px; background: var(--ink); color: var(--paper); border: none; padding: 10px 18px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background .2s, transform .15s, box-shadow .2s; box-shadow: 0 4px 12px -4px rgba(28,23,18,.5); }
        .disc-acquire:hover { background: var(--wine); box-shadow: 0 8px 18px -6px rgba(92,43,48,.6); }
        .disc-acquire:active { transform: scale(.97); }
        .disc-acquire svg { transition: transform .2s; }
        .disc-acquire:hover svg { transform: translate(2px, -2px); }
        .disc-acquire.is-lg { padding: 12px 22px; font-size: 13.5px; }
        .disc-acquire.is-lg:hover svg { transform: none; }

        .disc-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 70px 20px; color: var(--ink-soft); border: 1px dashed var(--line); border-radius: 20px; background: var(--card); }
        .disc-empty svg { color: var(--muted); margin-bottom: 6px; }
        .disc-empty p { margin: 0; font-family: var(--serif); font-size: 20px; color: var(--ink); }
        .disc-empty span { font-size: 13.5px; margin-bottom: 14px; }

        .disc-pagination { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 46px; }
        .disc-pagination button { min-width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); cursor: pointer; color: var(--ink); font-size: 13px; display: grid; place-items: center; transition: all .15s; }
        .disc-pagination button:hover:not(:disabled):not(.is-active) { border-color: var(--brass); background: var(--paper-2); }
        .disc-pagination button.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .disc-pagination button:disabled { opacity: .35; cursor: default; }

        .disc-modal-scrim { position: fixed; inset: 0; background: rgba(20,15,10,.6); backdrop-filter: blur(4px); z-index: 60; }
        .disc-modal-wrap { position: fixed; inset: 0; z-index: 61; display: flex; align-items: center; justify-content: center; padding: 24px; pointer-events: none; }
        .disc-modal-wrap > * { pointer-events: auto; }
        .disc-modal { position: relative; background: var(--paper); border-radius: 22px; width: min(920px, 94vw); height: min(620px, 88vh); overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; box-shadow: 0 40px 90px rgba(0,0,0,.4); }
        .disc-modal-close { position: absolute; top: 14px; right: 14px; z-index: 2; width: 36px; height: 36px; border-radius: 50%; background: rgba(251,248,241,.94); border: none; cursor: pointer; display: grid; place-items: center; color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,.18); transition: transform .2s; }
        .disc-modal-close:hover { transform: rotate(90deg); }
        .disc-modal-media { position: relative; height: 100%; overflow: hidden; }
        .disc-modal-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .disc-modal-preview { position: absolute; inset: 0; margin: auto; width: 54px; height: 54px; border-radius: 50%; background: rgba(20,15,10,.4); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,.3); cursor: pointer; display: grid; place-items: center; color: #f6f1e6; opacity: 0; transition: opacity .2s, background .2s; }
        .disc-modal-media:hover .disc-modal-preview, .disc-modal-preview:focus-visible { opacity: 1; }
        .disc-modal-preview:hover { background: rgba(20,15,10,.6); }
        .disc-fullimage-scrim { position: fixed; inset: 0; z-index: 80; background: rgba(10,8,6,.92); display: flex; align-items: center; justify-content: center; padding: 24px; cursor: zoom-out; }
        .disc-fullimage-scrim img { max-width: 92vw; max-height: 92vh; object-fit: contain; border-radius: 8px; box-shadow: 0 30px 80px rgba(0,0,0,.5); }

        .disc-modal-body { padding: 32px 32px 26px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; height: 100%; }
        .disc-modal-tag { align-self: flex-start; background: var(--paper-2); border: 1px solid var(--line); color: var(--brass-deep); font-size: 11.5px; font-weight: 500; padding: 5px 11px; border-radius: 999px; }
        .disc-modal-title { font-family: var(--serif); font-size: 28px; font-weight: 500; margin: 8px 0 2px; color: var(--ink); line-height: 1.2; text-wrap: balance; }
        .disc-modal-artist { font-size: 14px; color: var(--brass-deep); font-weight: 500; margin: 0 0 6px; }
        .disc-modal-artist span { color: var(--muted); font-weight: 400; }
        .disc-modal-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px 18px; background: var(--card); border: 1px solid var(--line); border-radius: 14px; margin: 8px 0; }
        .disc-modal-specs > div:last-child { grid-column: 1 / -1; }
        .disc-modal-specs span { display: block; font-size: 11px; color: var(--muted); margin-bottom: 3px; }
        .disc-modal-specs p { margin: 0; font-size: 13.5px; color: var(--ink); }
        .disc-modal-desc h4 { font-family: var(--serif); font-weight: 500; font-size: 15.5px; margin: 6px 0 8px; }
        .disc-modal-desc p { font-size: 13.5px; line-height: 1.7; color: var(--ink-soft); margin: 0 0 8px; }
        .disc-modal-provenance { display: flex; flex-direction: column; gap: 14px; padding: 16px 0; border-top: 1px solid var(--line); }
        .disc-modal-provenance-label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 3px; }
        .disc-modal-provenance p { margin: 0; font-size: 13px; line-height: 1.6; color: var(--ink); }
        .disc-modal-footer { margin-top: auto; position: sticky; bottom: -26px; background: linear-gradient(180deg, rgba(246,241,230,0), var(--paper) 22%); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 0 26px; margin-bottom: -26px; border-top: 1px solid var(--line); }
        .disc-modal-value { font-family: var(--serif); font-size: 26px; font-weight: 500; display: block; }
        .disc-modal-actions { position: relative; display: flex; align-items: center; gap: 10px; }
        .disc-wish-btn { position: relative; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); display: grid; place-items: center; color: var(--ink-soft); cursor: pointer; transition: color .2s, border-color .2s, background .2s; }
        .disc-wish-btn:hover { border-color: var(--wine); color: var(--wine); }
        .disc-wish-btn.is-fav { color: var(--wine); border-color: var(--wine); background: #f5e8e4; }
        .disc-wish-btn::after { content: attr(data-tip); position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px); background: var(--ink); color: var(--paper); font-size: 11.5px; white-space: nowrap; padding: 5px 9px; border-radius: 6px; opacity: 0; pointer-events: none; transition: opacity .15s, transform .15s; }
        .disc-wish-btn:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
        .disc-modal-toast { position: absolute; right: 0; bottom: calc(100% + 52px); display: inline-flex; align-items: center; gap: 6px; background: var(--brass-deep); color: var(--paper); font-size: 12px; padding: 7px 13px; border-radius: 999px; white-space: nowrap; box-shadow: 0 8px 20px rgba(0,0,0,.2); }

        @media (max-width: 1180px) { .disc-grid:not(.is-list) { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 980px) {
          .disc-shell { grid-template-columns: 1fr; }
          .disc-sidebar { display: none; }
          .disc-filter-toggle { display: inline-flex; }
        }
        @media (max-width: 900px) {
          .disc-modal { grid-template-columns: 1fr; grid-template-rows: 240px 1fr; height: min(92vh, 720px); }
          .disc-modal-media { height: 240px; }
          .disc-modal-body { height: auto; padding: 22px 22px 20px; }
          .disc-modal-footer { bottom: -20px; padding-bottom: 20px; margin-bottom: -20px; }
        }
        @media (max-width: 620px) {
          .disc-grid:not(.is-list) { grid-template-columns: 1fr; }
          .disc-card.is-list { flex-direction: column; }
          .disc-card.is-list .disc-card-media { width: 100%; aspect-ratio: 4/3.4; min-height: 0; }
          .disc-card-peek { display: none; }
        }
        @media (max-width: 480px) {
          .disc-hero { padding-top: 56px; }
          .disc-hero-inner { padding: 0 18px; }
          .disc-hero-search { flex-wrap: wrap; padding: 10px; border-radius: 24px; }
          .disc-hero-search input { width: 100%; order: 3; padding: 6px 4px 4px; }
          .disc-hero-go { margin-left: auto; }
          .disc-shell { padding: 28px 16px 60px; gap: 24px; }
          .disc-toolbar { gap: 10px; }
          .disc-count { flex-basis: 100%; order: 3; font-size: 13px; }
          .disc-toolbar-right { flex-basis: 100%; justify-content: space-between; }
          .disc-sort ul { width: 200px; right: auto; left: 0; }
          .disc-grid { gap: 16px; }
          .disc-drawer { width: 88vw; }
          .disc-modal-actions .disc-acquire { padding: 12px 16px; }
        }
        @media (hover: none) { .disc-card-peek { display: none; } .disc-modal-preview { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .disc-app * { transition: none !important; animation: none !important; } }
      `}</style>
    </div>
  );
}