import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import discVideo from "../../assets/disc.mp4";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import {
  Search,
  Heart,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  Eye,
} from "lucide-react";
const ITEMS_PER_PAGE = 6;
const CATEGORIES = [
  { id: "paintings", label: "Paintings", count: 415 },
  { id: "sculptures", label: "Sculptures", count: 226 },
  { id: "ceramics", label: "Ceramics & Pottery", count: 138 },
  { id: "photography", label: "Photography", count: 190 },
  { id: "digital", label: "Digital & New Media", count: 84 },
  { id: "textile", label: "Textile & Fiber Art", count: 61 },
  { id: "printmaking", label: "Printmaking & Monotype", count: 42 },
];

const MEDIUMS = [
  "Oil", "Acrylic", "Stoneware", "Bronze", "Linen", "Archival Ink",
  "Marble", "Porcelain", "Watercolor", "Charcoal", "Wood", "Glass",
];

const BASE_ARTWORKS = [
  { id: 1, title: "Resonance in Sienna No. IV", artist: "Elena Voss", location: "Lyon, France", category: "paintings", medium: "Oil on Heavy Canvas", dims: "120 x 90 cm", value: 4200, img: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=900&auto=format&fit=crop", tag: "Original Oil" },
  { id: 2, title: "Volcanic Tellic Amphora", artist: "Renzo Takahashi", location: "Kyoto, Japan", category: "ceramics", medium: "Stoneware & Ash Glaze", dims: "44 x 28 cm", value: 850, img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=900&auto=format&fit=crop", tag: "Wood-Fired Stoneware" },
  { id: 3, title: "Tectonic Equilibrium", artist: "Matteo Rinni", location: "Carrara, Italy", category: "sculptures", medium: "Hand-Carved Marble", dims: "60 x 38 x 30 cm", value: 7800, img: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=900&auto=format&fit=crop", tag: "Carved Travertine" },
  { id: 4, title: "Strata of Winter Breath", artist: "Astrid Lindgren", location: "Stockholm, Sweden", category: "textile", medium: "Woven Linen & Wool", dims: "140 x 85 cm", value: 1950, img: "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=900&auto=format&fit=crop", tag: "Textile Sculpture" },
  { id: 5, title: "Shadows of the Solstice", artist: "Mateo Morales", location: "Oaxaca, Mexico", category: "photography", medium: "Archival Pigment on Rag", dims: "64 x 45 cm", value: 680, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900&auto=format&fit=crop", tag: "Limited Edition Print" },
  { id: 6, title: "Echoes in Ochre", artist: "Julian Cross", location: "London, UK", category: "paintings", medium: "Acrylic & Mineral Gesso", dims: "110 x 95 cm", value: 3100, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop", tag: "Mixed Media on Canvas" },
  { id: 7, title: "Quiet Basin, Study II", artist: "Noor Haddad", location: "Amman, Jordan", category: "ceramics", medium: "Porcelain & Slip", dims: "30 x 30 cm", value: 1120, img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=900&auto=format&fit=crop", tag: "Thrown Porcelain" },
  { id: 8, title: "Fold, Unfold", artist: "Priya Nair", location: "Kochi, India", category: "sculptures", medium: "Cast Bronze", dims: "52 x 20 x 20 cm", value: 5400, img: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=900&auto=format&fit=crop", tag: "Limited Cast, 3 of 9" },
  { id: 9, title: "Signal Garden", artist: "Theo Baptiste", location: "Montreal, Canada", category: "digital", medium: "Generative Print on Archival Paper", dims: "80 x 80 cm", value: 2250, img: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=900&auto=format&fit=crop", tag: "Digital / New Media" },
  { id: 10, title: "Marigold Hour", artist: "Ananya Deshpande", location: "Jaipur, India", category: "paintings", medium: "Watercolor on Cotton Paper", dims: "56 x 76 cm", value: 980, img: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=900&auto=format&fit=crop", tag: "Original Watercolor" },
  { id: 11, title: "Ashen Coastline", artist: "Bjorn Halvorsen", location: "Bergen, Norway", category: "photography", medium: "Silver Gelatin Print", dims: "50 x 60 cm", value: 1450, img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=900&auto=format&fit=crop", tag: "Fine Art Black & White" },
  { id: 12, title: "Vessel of Small Mercies", artist: "Renzo Takahashi", location: "Kyoto, Japan", category: "ceramics", medium: "Raku Stoneware", dims: "24 x 24 cm", value: 620, img: "https://images.unsplash.com/photo-1493106819501-66d381c466f1?q=80&w=900&auto=format&fit=crop", tag: "Raku Fired" },
  { id: 13, title: "Woven Meridian", artist: "Astrid Lindgren", location: "Stockholm, Sweden", category: "textile", medium: "Hand-Knotted Wool Tapestry", dims: "180 x 120 cm", value: 3400, img: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=900&auto=format&fit=crop", tag: "Tapestry" },
  { id: 14, title: "Fault Lines, Study I", artist: "Matteo Rinni", location: "Carrara, Italy", category: "sculptures", medium: "Bronze on Granite Base", dims: "40 x 22 x 18 cm", value: 4650, img: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=900&auto=format&fit=crop", tag: "Limited Cast, 5 of 12" },
  { id: 15, title: "Monsoon Interior", artist: "Priya Nair", location: "Kochi, India", category: "paintings", medium: "Charcoal & Ink on Paper", dims: "70 x 100 cm", value: 1580, img: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=900&auto=format&fit=crop", tag: "Charcoal Drawing" },
  { id: 16, title: "Latticework No. 7", artist: "Theo Baptiste", location: "Montreal, Canada", category: "digital", medium: "Algorithmic Light Installation Print", dims: "90 x 60 cm", value: 2900, img: "https://images.unsplash.com/photo-1633186710895-309db2eca9e4?q=80&w=900&auto=format&fit=crop", tag: "Digital / New Media" },
  { id: 17, title: "Blown Horizon Vessel", artist: "Noor Haddad", location: "Amman, Jordan", category: "sculptures", medium: "Hand-Blown Glass", dims: "35 x 18 cm", value: 1780, img: "https://images.unsplash.com/photo-1602526216832-b3ce07688f9c?q=80&w=900&auto=format&fit=crop", tag: "Hand-Blown Glass" },
  { id: 18, title: "Relief in Walnut", artist: "Bjorn Halvorsen", location: "Bergen, Norway", category: "sculptures", medium: "Carved Walnut Wood", dims: "48 x 32 x 10 cm", value: 2350, img: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?q=80&w=900&auto=format&fit=crop", tag: "Carved Wood Relief" },
  { id: 19, title: "Riverbed Monotype III", artist: "Ananya Deshpande", location: "Jaipur, India", category: "printmaking", medium: "Monotype on Rag Paper", dims: "38 x 50 cm", value: 540, img: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=900&auto=format&fit=crop", tag: "Monotype Print" },
  { id: 20, title: "Threadbare Constellations", artist: "Julian Cross", location: "London, UK", category: "textile", medium: "Embroidery on Linen", dims: "60 x 60 cm", value: 1290, img: "https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?q=80&w=900&auto=format&fit=crop", tag: "Hand Embroidery" },
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

function Chip({ active, onClick, children }) {
  return (
    <button className={`disc-chip ${active ? "is-active" : ""}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="disc-checkrow">
      <span className={`disc-checkbox ${checked ? "is-checked" : ""}`} onClick={onChange}>
        <motion.svg
          viewBox="0 0 12 10"
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.6 }}
          transition={{ duration: 0.15 }}
        >
          <path d="M1 5L4.2 8.2L11 1" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </motion.svg>
      </span>
      <span className="disc-checklabel">{label}</span>
      {typeof count === "number" && <span className="disc-checkcount">{count}</span>}
    </label>
  );
}

function Hero({ query, setQuery }) {
  return (
    <section className="disc-hero">
      <video className="disc-hero-bg" src={discVideo} poster="https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1920&auto=format&fit=crop" autoPlay muted loop playsInline />
      <div className="disc-hero-scrim" />
      <div className="disc-hero-inner">
        <motion.p
          className="disc-hero-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          The Foundry Collection
        </motion.p>
        <motion.h1
          className="disc-hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Original works, chosen
          <br />
          by hand, held in trust.
        </motion.h1>
        <motion.p
          className="disc-hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          Browse a living archive of paintings, sculpture, ceramics and print,
          each piece vetted by a curator before it reaches you.
        </motion.p>

        <motion.div
          className="disc-hero-search"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <Search size={18} strokeWidth={1.8} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, artists, mediums, or aesthetic movements…"
          />
          <button type="button">Explore</button>
        </motion.div>
      </div>
      <div className="disc-hero-fade" />
    </section>
  );
}

function Sidebar({
  activeCategories,
  toggleCategory,
  price,
  setPrice,
  mediums,
  toggleMedium,
  size,
  setSize,
  vetted,
  setVetted,
  onClear,
  mobileOpen,
  setMobileOpen,
}) {
  const content = (
    <>
      <div className="disc-sidebar-head">
        <h3>Curatorial Filters</h3>
        <button className="disc-clear" onClick={onClear} type="button">
          Clear all
        </button>
      </div>

      <div className="disc-filter-group">
        <h4>Category</h4>
        {CATEGORIES.map((c) => (
          <Checkbox
            key={c.id}
            checked={activeCategories.includes(c.id)}
            onChange={() => toggleCategory(c.id)}
            label={c.label}
            count={c.count}
          />
        ))}
      </div>

      <div className="disc-filter-group">
        <h4>Price range (INR)</h4>
        <div className="disc-price-labels">
          <span>₹{price[0]}</span>
          <span>₹{price[1].toLocaleString()}</span>
        </div>
        <input
          className="disc-range"
          type="range"
          min={100}
          max={9500}
          step={50}
          value={price[1]}
          onChange={(e) => setPrice([price[0], Number(e.target.value)])}
        />
      </div>

      <div className="disc-filter-group">
        <h4>Medium & Material</h4>
        <div className="disc-pillwrap">
          {MEDIUMS.map((m) => (
            <Chip key={m} active={mediums.includes(m)} onClick={() => toggleMedium(m)}>
              {m}
            </Chip>
          ))}
        </div>
      </div>

      <div className="disc-filter-group">
        <h4>Dimensions & Scale</h4>
        {["Small (< 40 cm)", "Medium (40–100 cm)", "Large (> 100 cm)"].map((s) => (
          <label key={s} className="disc-radiorow">
            <span
              className={`disc-radio ${size === s ? "is-checked" : ""}`}
              onClick={() => setSize(s)}
            >
              <span className="disc-radio-dot" />
            </span>
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
            <motion.div
              className="disc-drawer-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="disc-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="disc-drawer-close" onClick={() => setMobileOpen(false)} type="button">
                <X size={18} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ArtworkCard({ art, view, favorite, toggleFavorite, onAcquire }) {
  return (
    <motion.article
      className={`disc-card ${view === "list" ? "is-list" : ""}`}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="disc-card-media">
        <img src={art.img} alt={art.title} loading="lazy" />
        <button
          className={`disc-fav ${favorite ? "is-fav" : ""}`}
          onClick={() => toggleFavorite(art.id)}
          type="button"
          aria-label="Save artwork"
        >
          <motion.span whileTap={{ scale: 0.8 }}>
            <Heart size={16} strokeWidth={1.8} fill={favorite ? "currentColor" : "none"} />
          </motion.span>
        </button>
        <span className="disc-card-tag">{art.tag}</span>
      </div>

      <div className="disc-card-body">
        <p className="disc-card-artist">
          {art.artist} <span>· {art.location}</span>
        </p>
        <h3 className="disc-card-title">{art.title}</h3>
        {view === "list" && <p className="disc-card-medium">{art.medium} — {art.dims}</p>}

        <div className="disc-card-footer">
          <div>
            <span className="disc-card-value-label">Current value</span>
            <span className="disc-card-value">₹{art.value.toLocaleString()}</span>
          </div>
          <button className="disc-acquire" type="button" onClick={() => onAcquire(art)}>
            View
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

  if (!art) return null;

  const handleWishlist = () => {
    toggleFavorite(art.id);
    setToast(favorite ? "Removed from wishlist" : "Added to wishlist");
  };

  const carted = inCart.has(art.id);

  const handleCart = () => {
    if (carted) {
      navigate("/cart");
      return;
    }
    toggleCart(art);
    setToast("Added to cart");
  };
  return (
    <>
      <motion.div
        className="disc-modal-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="disc-modal-wrap">
      <motion.div
        className="disc-modal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="disc-modal-close" onClick={onClose} type="button" aria-label="Close">
          <X size={18} />
        </button>

        <div className="disc-modal-media">
          <img src={art.img} alt={art.title} />
          <button
            className="disc-modal-preview"
            type="button"
            onClick={() => setShowFullImage(true)}
            aria-label="View full image"
          >
            <Eye size={22} strokeWidth={1.6} />
          </button>
        </div>

        <div className="disc-modal-body">
          <span className="disc-card-tag">{art.tag}</span>
          <h2 className="disc-modal-title">{art.title}</h2>
          <p className="disc-modal-artist">
            {art.artist} <span>· {art.location}</span>
          </p>

          <div className="disc-modal-specs">
            <div>
              <span>Medium</span>
              <p>{art.medium}</p>
            </div>
            <div>
              <span>Dimensions</span>
              <p>{art.dims}</p>
            </div>
            <div>
              <span>Category</span>
              <p>{CATEGORIES.find((c) => c.id === art.category)?.label}</p>
            </div>
          </div>

          <div className="disc-modal-desc">
            <h4>About this piece</h4>
            {art.description && <p>{art.description}</p>}
            <p>
              "{art.title}" is an original work by {art.artist}, created in {art.location}.
              Rendered in {art.medium.toLowerCase()}, this piece measures {art.dims} and
              belongs to our {CATEGORIES.find((c) => c.id === art.category)?.label.toLowerCase()} collection.
              Each work is individually inspected and hand-catalogued by our curatorial team
              before being listed, ensuring condition, provenance and authenticity meet gallery standard.
            </p>
          </div>

          <div className="disc-modal-provenance">
            <div>
              <span className="disc-modal-provenance-label">Provenance</span>
              <p>Acquired directly from the artist's studio in {art.location}. Certificate of authenticity included.</p>
            </div>
            <div>
              <span className="disc-modal-provenance-label">Shipping & Framing</span>
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
                  <motion.span
                    key={toast}
                    className="disc-modal-toast"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {toast}
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

              <button className="disc-acquire" type="button" onClick={handleCart}>
                {carted ? "View cart" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>

      <AnimatePresence>
        {showFullImage && (
          <motion.div
            className="disc-fullimage-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(false)}
          >
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
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && CATEGORIES.some((c) => c.id === categoryParam)) {
      setActiveCategories([categoryParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setQuery(searchParam);
    }
  }, [searchParams]);
  const [price, setPrice] = useState([100, 9500]);
  const [mediums, setMediums] = useState([]);
  const [size, setSize] = useState("");
  const [vetted, setVetted] = useState(false);
  const [sort, setSort] = useState("Curated / Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { favorites, toggle } = useWishlist();
  const [selectedArt, setSelectedArt] = useState(null);
  const ARTWORKS = useMemo(() => [...loadArtistArtworks(), ...BASE_ARTWORKS], []);

  const toggleCategory = (id) =>
    setActiveCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const toggleMedium = (m) =>
    setMediums((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const toggleFavorite = (id) => {
    const art = ARTWORKS.find((a) => a.id === id);
    if (art) toggle(art);
  };

  const clearAll = () => {
    setActiveCategories([]);
    setPrice([100, 9500]);
    setMediums([]);
    setSize("");
    setVetted(false);
  };
  useEffect(() => {
    setPage(1);
  }, [activeCategories, price, query]);
  const filtered = useMemo(() => {
    return ARTWORKS.filter((a) => {
      if (activeCategories.length && !activeCategories.includes(a.category)) return false;
      if (a.value > price[1]) return false;
      if (query && !`${a.title} ${a.artist}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [ARTWORKS, activeCategories, price, query]);
  const goToPage = (n) => {
    setPage(n);
    document
      .querySelector(".disc-toolbar")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="disc-app">
      <Hero query={query} setQuery={setQuery} />

      <div className="disc-shell">
        <Sidebar
          activeCategories={activeCategories}
          toggleCategory={toggleCategory}
          price={price}
          setPrice={setPrice}
          mediums={mediums}
          toggleMedium={toggleMedium}
          size={size}
          setSize={setSize}
          vetted={vetted}
          setVetted={setVetted}
          onClear={clearAll}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="disc-main">
          <div className="disc-toolbar">
            <button className="disc-filter-toggle" onClick={() => setMobileOpen(true)} type="button">
              <SlidersHorizontal size={16} strokeWidth={1.8} />
              Filters
            </button>

            <p className="disc-count">
              {filtered.length.toLocaleString()} Original Artworks Found{" "}
              <span>· Sorted by Editorial Relevance</span>
            </p>

            <div className="disc-toolbar-right">
              <div className="disc-sort">
                <button onClick={() => setSortOpen((s) => !s)} type="button">
                  {sort}
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {["Curated / Recommended", "Price: Low to High", "Price: High to Low", "Newest Arrivals"].map(
                        (s) => (
                          <li
                            key={s}
                            onClick={() => {
                              setSort(s);
                              setSortOpen(false);
                            }}
                          >
                            {s}
                          </li>
                        )
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="disc-viewtoggle">
                <button
                  className={view === "grid" ? "is-active" : ""}
                  onClick={() => setView("grid")}
                  type="button"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} strokeWidth={1.8} />
                </button>
                <button
                  className={view === "list" ? "is-active" : ""}
                  onClick={() => setView("list")}
                  type="button"
                  aria-label="List view"
                >
                  <List size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>

          <div
            key={`${currentPage}-${view}`}
            className={`disc-grid ${view === "list" ? "is-list" : ""}`}
          >
            {paginated.map((art) => (
              <ArtworkCard
                key={art.id}
                art={art}
                view={view}
                favorite={favorites.has(art.id)}
                toggleFavorite={toggleFavorite}
                onAcquire={setSelectedArt}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="disc-empty">
              <p>No pieces match these filters yet.</p>
              <button onClick={clearAll} type="button">
                Clear filters
              </button>
            </div>
          )}

          <div className="disc-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={currentPage === n ? "is-active" : ""}
                onClick={() => goToPage(n)}
                type="button"
              >
                {n}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              type="button"
            >
              <ChevronRight size={16} />
            </button>
          </div>
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

      <style>{`
        .disc-app {
          --ink: #1c1712;
          --ink-soft: #4a423a;
          --paper: #f6f1e6;
          --paper-2: #efe6d3;
          --line: #ddd0b8;
          --brass: #96702f;
          --brass-deep: #6f5222;
          --wine: #5c2b30;
          --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
          --sans: "Work Sans", "Inter", system-ui, sans-serif;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          min-height: 100vh;
        }

        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');

        .disc-app * { box-sizing: border-box; }

        .disc-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          color: #f6f1e6;
          padding-top: 64px;
        }
        @media (max-width: 480px) {
          .disc-hero { padding-top: 56px; }
        }
        .disc-hero-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          background-size: cover;
          object-position: center 40%;
          transform: scale(1.02);
        }
        .disc-hero-scrim {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 55% at 50% 50%, rgba(20,15,10,.72) 0%, rgba(20,15,10,.45) 55%, rgba(20,15,10,0) 100%),
            linear-gradient(180deg, rgba(20,15,10,.55) 0%, rgba(20,15,10,.35) 40%, rgba(20,15,10,.86) 100%);
        }
        .disc-hero-fade {
          position: absolute; left: 0; right: 0; bottom: 0; height: 90px;
          background: linear-gradient(180deg, transparent, var(--paper));
        }
        .disc-hero-inner {
          position: relative; z-index: 2;
          max-width: 760px;
          margin: 0 auto;
          padding: 0 28px;
          text-align: center;
        }
        .disc-hero-inner::before {
          content: "";
          position: absolute; z-index: -1;
          inset: -60px -80px;
          background: radial-gradient(ellipse at center, rgba(20,15,10,.6) 0%, rgba(20,15,10,.3) 50%, rgba(20,15,10,0) 75%);
          filter: blur(20px);
          pointer-events: none;
        }
        .disc-hero-eyebrow {
          font-size: 13px; letter-spacing: .04em;
          color: #d9c48f; margin: 0 0 18px;
          font-family: var(--sans); font-weight: 500;
        }
        .disc-hero-title {
          font-family: var(--serif);
          font-weight: 500;
          font-size: clamp(34px, 5.2vw, 58px);
          line-height: 1.08;
          margin: 0 0 20px;
          letter-spacing: -0.01em;
        }
        .disc-hero-sub {
          font-size: 16px; line-height: 1.6;
          color: #e7ddc9; max-width: 520px;
          margin: 0 auto 36px;
        }
        .disc-hero-search {
          display: flex; align-items: center; gap: 10px;
          background: rgba(246,241,230,.96);
          border-radius: 999px;
          padding: 8px 8px 8px 20px;
          max-width: 560px; margin: 0 auto;
          color: var(--ink);
          box-shadow: 0 18px 40px rgba(0,0,0,.25);
        }
        .disc-hero-search svg { color: var(--ink-soft); flex-shrink: 0; }
        .disc-hero-search input {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: var(--sans); font-size: 14px; color: var(--ink);
          padding: 10px 0;
        }
        .disc-hero-search input::placeholder { color: #8a7f6d; }
        .disc-hero-search button {
          background: var(--ink); color: var(--paper);
          border: none; border-radius: 999px;
          padding: 10px 20px; font-size: 13.5px; font-weight: 500;
          cursor: pointer; font-family: var(--sans);
          transition: background .2s ease;
        }
        .disc-hero-search button:hover { background: var(--brass-deep); }

        .disc-shell {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 36px;
          max-width: 1360px;
          margin: 0 auto;
          padding: 40px 28px 80px;
        }

        .disc-sidebar { display: block; }
        .disc-drawer-scrim {
          position: fixed; inset: 0; background: rgba(20,15,10,.5); z-index: 40;
        }
        .disc-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 300px;
          background: var(--paper); z-index: 41; padding: 24px 22px;
          overflow-y: auto;
        }
        .disc-drawer-close {
          background: none; border: none; margin-bottom: 12px; cursor: pointer; color: var(--ink);
        }

        .disc-sidebar-head {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 18px;
        }
        .disc-sidebar-head h3 {
          font-family: var(--serif); font-size: 19px; font-weight: 500; margin: 0;
        }
        .disc-clear {
          background: none; border: none; color: var(--brass-deep);
          font-size: 12.5px; cursor: pointer; font-family: var(--sans); text-decoration: underline;
        }

        .disc-filter-group {
          padding: 18px 0; border-bottom: 1px solid var(--line);
        }
        .disc-filter-group h4 {
          font-size: 13px; font-weight: 600; margin: 0 0 12px;
          color: var(--ink-soft); letter-spacing: .01em;
        }
        .disc-hint { font-size: 12px; color: var(--ink-soft); margin: 4px 0 0 30px; }

        .disc-checkrow {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 0; cursor: pointer; font-size: 13.5px;
        }
        .disc-checkbox {
          width: 17px; height: 17px; border-radius: 4px;
          border: 1.4px solid #b7a682; display: flex; align-items: center; justify-content: center;
          color: var(--paper); flex-shrink: 0; cursor: pointer;
          transition: background .15s ease, border-color .15s ease;
        }
        .disc-checkbox.is-checked { background: var(--brass-deep); border-color: var(--brass-deep); }
        .disc-checkbox svg { width: 10px; height: 8px; }
        .disc-checklabel { flex: 1; color: var(--ink); }
        .disc-checkcount { color: #a3946f; font-size: 12px; }

        .disc-price-labels {
          display: flex; justify-content: space-between; font-size: 13px;
          margin-bottom: 10px; color: var(--ink-soft);
        }
        .disc-range {
          width: 100%; accent-color: var(--brass-deep); height: 4px;
        }

        .disc-pillwrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .disc-chip {
          border: 1px solid var(--line); background: var(--paper-2);
          padding: 6px 13px; border-radius: 999px; font-size: 12.5px;
          cursor: pointer; color: var(--ink-soft); font-family: var(--sans);
          transition: all .15s ease;
        }
        .disc-chip.is-active {
          background: var(--ink); color: var(--paper); border-color: var(--ink);
        }

        .disc-radiorow {
          display: flex; align-items: center; gap: 10px; padding: 6px 0;
          cursor: pointer; font-size: 13.5px;
        }
        .disc-radio {
          width: 17px; height: 17px; border-radius: 50%; border: 1.4px solid #b7a682;
          display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .disc-radio-dot {
          width: 8px; height: 8px; border-radius: 50%; background: transparent; transition: background .15s ease;
        }
        .disc-radio.is-checked .disc-radio-dot { background: var(--brass-deep); }

        .disc-advisory {
          margin-top: 20px; padding: 18px;
          background: var(--paper-2); border-radius: 14px;
          display: flex; gap: 12px; border: 1px solid var(--line);
        }
        .disc-advisory svg { color: var(--brass-deep); flex-shrink: 0; margin-top: 2px; }
        .disc-advisory h4 { font-size: 13.5px; margin: 0 0 6px; font-family: var(--serif); font-weight: 500; }
        .disc-advisory p { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 10px; line-height: 1.5; }
        .disc-advisory button {
          background: none; border: none; padding: 0; color: var(--wine);
          font-size: 12.5px; font-weight: 600; cursor: pointer; text-decoration: underline;
        }

        .disc-toolbar {
          display: flex; align-items: center; gap: 18px;
          margin-bottom: 22px; flex-wrap: wrap;
          scroll-margin-top: 90px;
        }
        .disc-filter-toggle {
          display: none; align-items: center; gap: 6px;
          border: 1px solid var(--line); background: var(--paper-2);
          padding: 8px 14px; border-radius: 999px; font-size: 13px; cursor: pointer;
        }
        .disc-count { font-size: 14px; color: var(--ink); margin: 0; flex: 1; }
        .disc-count span { color: #a3946f; }

        .disc-toolbar-right { display: flex; align-items: center; gap: 12px; }

        .disc-sort { position: relative; }
        .disc-sort > button {
          display: flex; align-items: center; gap: 8px;
          background: var(--paper-2); border: 1px solid var(--line);
          padding: 9px 14px; border-radius: 999px; font-size: 13px; cursor: pointer;
          color: var(--ink); font-family: var(--sans);
        }
        .disc-sort ul {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: var(--paper); border: 1px solid var(--line);
          border-radius: 12px; list-style: none; padding: 6px; margin: 0;
          width: 210px; box-shadow: 0 14px 30px rgba(0,0,0,.12); z-index: 10;
        }
        .disc-sort li {
          padding: 9px 10px; font-size: 13px; border-radius: 8px; cursor: pointer;
        }
        .disc-sort li:hover { background: var(--paper-2); }

        .disc-viewtoggle {
          display: flex; border: 1px solid var(--line); border-radius: 999px; overflow: hidden;
        }
        .disc-viewtoggle button {
          background: var(--paper-2); border: none; padding: 9px 12px; cursor: pointer; color: var(--ink-soft);
        }
        .disc-viewtoggle button.is-active { background: var(--ink); color: var(--paper); }

        .disc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .disc-grid.is-list { grid-template-columns: 1fr; }

        .disc-card {
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 16px;
          overflow: hidden;
          display: flex; flex-direction: column;
        }
        .disc-card.is-list { flex-direction: row; }
        .disc-card.is-list { align-items: flex-start; }
        .disc-card.is-list .disc-card-media { width: 260px; flex-shrink: 0; aspect-ratio: auto; height: 240px; }
        .disc-card.is-list .disc-card-body { flex: 1; padding-top: 16px; }
        .disc-card.is-list .disc-card-footer { margin-top: 16px; }

        .disc-card-media {
          position: relative; aspect-ratio: 4/3.1; overflow: hidden;
        }
        .disc-card-media img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s ease;
        }
        .disc-card:hover .disc-card-media img { transform: scale(1.045); }

        .disc-fav {
          position: absolute; top: 10px; right: 10px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(246,241,230,.92); border: none;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink-soft); cursor: pointer;
        }
        .disc-fav.is-fav { color: var(--wine); }

        .disc-card-tag {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(28,23,18,.72); color: #f1e8d4;
          font-size: 11px; padding: 5px 10px; border-radius: 999px;
          letter-spacing: .01em;
        }

        .disc-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 4px; }
        .disc-card-artist {
          font-size: 12.5px; color: var(--ink-soft); margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .disc-card-artist span { color: #a3946f; }
        .disc-card-title {
          font-family: var(--serif); font-weight: 500; font-size: 18px;
          margin: 2px 0 6px; color: var(--brass-deep); line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: calc(1.3em * 2);
        }
        .disc-card-medium { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 10px; }

        .disc-card-footer {
          margin-top: auto; display: flex; align-items: center; justify-content: space-between;
          padding-top: 10px;
        }
        .disc-card-value-label { display: block; font-size: 11px; color: #a3946f; }
        .disc-card-value { font-family: var(--serif); font-size: 17px; font-weight: 500; }
        .disc-acquire {
          background: var(--ink); color: var(--paper); border: none;
          padding: 9px 16px; border-radius: 999px; font-size: 12.5px; font-weight: 500;
          cursor: pointer; font-family: var(--sans); transition: background .2s ease;
        }
        .disc-acquire:hover { background: var(--wine); }

        .disc-empty {
          text-align: center; padding: 60px 0; color: var(--ink-soft);
        }
        .disc-empty button {
          margin-top: 12px; background: var(--ink); color: var(--paper); border: none;
          padding: 9px 18px; border-radius: 999px; cursor: pointer;
        }

        .disc-pagination {
          display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 42px;
        }
        .disc-pagination button {
          min-width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid var(--line); background: var(--paper-2);
          cursor: pointer; color: var(--ink); font-size: 13px;
          display: flex; align-items: center; justify-content: center;
        }
        .disc-pagination button.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .disc-pagination button:disabled { opacity: .4; cursor: default; }
        .disc-page-dots { color: var(--ink-soft); }

        @media (max-width: 980px) {
          .disc-shell { grid-template-columns: 1fr; }
          .disc-sidebar { display: none; }
          .disc-filter-toggle { display: flex; }
          .disc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 620px) {
          .disc-grid { grid-template-columns: 1fr; }
          .disc-card.is-list { flex-direction: column; }
          .disc-card.is-list .disc-card-media { width: 100%; aspect-ratio: 4/3.1; }
          .disc-hero { min-height: 100vh; }
        }

        @media (max-width: 480px) {
          .disc-hero { min-height: 100vh; }
          .disc-hero-inner { padding: 0 18px; }
          .disc-hero-search { flex-wrap: wrap; padding: 10px 10px; border-radius: 22px; }
          .disc-hero-search input { width: 100%; order: 3; padding: 4px 2px 2px; }
          .disc-hero-search button { margin-left: auto; }

          .disc-shell { padding: 28px 16px 60px; gap: 24px; }

          .disc-toolbar { gap: 10px; }
          .disc-count { flex-basis: 100%; order: 3; font-size: 13px; }
          .disc-toolbar-right { flex-basis: 100%; justify-content: space-between; }
          .disc-sort ul { width: 180px; right: auto; left: 0; }

          .disc-grid { gap: 14px; }
          .disc-card-body { padding: 12px 14px 14px; }
          .disc-card-title { font-size: 16px; }

          .disc-drawer { width: 86vw; }
        }

        .disc-modal-scrim {
          position: fixed; inset: 0; background: rgba(20,15,10,.6); z-index: 60;
        }
        .disc-modal-wrap {
          position: fixed; inset: 0; z-index: 61;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; pointer-events: none;
        }
        .disc-modal-wrap > * { pointer-events: auto; }
        .disc-modal {
          background: var(--paper); border-radius: 18px;
          width: min(880px, 92vw); height: min(600px, 88vh); overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          box-shadow: 0 30px 70px rgba(0,0,0,.35);
        }
        .disc-modal-close {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(246,241,230,.92); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; color: var(--ink);
        }
        .disc-modal-media { position: relative; height: 100%; overflow: hidden; }
        .disc-modal-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .disc-modal-preview {
          position: absolute; inset: 0; margin: auto;
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(20,15,10,.35); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #f6f1e6; opacity: 0; transition: opacity .2s ease, background .2s ease;
        }
        .disc-modal-media:hover .disc-modal-preview { opacity: 1; }
        .disc-modal-preview:hover { background: rgba(20,15,10,.55); }

        .disc-fullimage-scrim {
          position: fixed; inset: 0; z-index: 80;
          background: rgba(10,8,6,.9);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; cursor: zoom-out;
        }
        .disc-fullimage-scrim img {
          max-width: 92vw; max-height: 92vh; object-fit: contain;
          border-radius: 8px; box-shadow: 0 30px 80px rgba(0,0,0,.5);
        }
        .disc-modal-body { padding: 28px 30px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; height: 100%; }
        .disc-modal-title {
          font-family: var(--serif); font-size: 24px; font-weight: 500;
          margin: 8px 0 2px; color: var(--brass-deep); line-height: 1.25;
        }
        .disc-modal-artist { font-size: 13.5px; color: var(--ink-soft); margin: 0 0 6px; }
        .disc-modal-artist span { color: #a3946f; }
        .disc-modal-specs {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
          padding: 16px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
          margin: 8px 0;
        }
        .disc-modal-specs > div:last-child { grid-column: 1 / -1; }
        .disc-modal-specs span { display: block; font-size: 11px; color: #a3946f; margin-bottom: 3px; }
        .disc-modal-specs p { margin: 0; font-size: 13.5px; color: var(--ink); }
        .disc-modal-desc {
          padding: 4px 0 2px;
        }
        .disc-modal-desc h4 {
          font-family: var(--serif); font-weight: 500; font-size: 14.5px;
          margin: 0 0 8px; color: var(--ink);
        }
        .disc-modal-desc p {
          font-size: 13px; line-height: 1.65; color: var(--ink-soft); margin: 0;
        }

        .disc-modal-provenance {
          display: flex; flex-direction: column; gap: 14px;
          padding: 16px 0; border-top: 1px solid var(--line);
        }
        .disc-modal-provenance-label {
          display: block; font-size: 11px; color: #a3946f; margin-bottom: 3px;
        }
        .disc-modal-provenance p {
          margin: 0; font-size: 12.5px; line-height: 1.55; color: var(--ink);
        }

        .disc-modal-footer {
          margin-top: auto; display: flex; align-items: center; justify-content: space-between;
          padding-top: 14px;
        }
        .disc-modal-value { font-family: var(--serif); font-size: 22px; font-weight: 500; display: block; }

        .disc-modal-actions {
          position: relative; display: flex; align-items: center; gap: 10px;
        }
        .disc-wish-btn {
          position: relative;
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid var(--line); background: var(--paper-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink-soft); cursor: pointer;
          transition: color .2s ease, border-color .2s ease;
        }
        .disc-wish-btn:hover { border-color: var(--wine); color: var(--wine); }
        .disc-wish-btn.is-fav { color: var(--wine); border-color: var(--wine); }
        .disc-wish-btn::after {
          content: attr(data-tip);
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: var(--ink); color: var(--paper);
          font-size: 11.5px; white-space: nowrap;
          padding: 5px 9px; border-radius: 6px;
          opacity: 0; pointer-events: none;
          transition: opacity .15s ease, transform .15s ease;
        }
        .disc-wish-btn:hover::after {
          opacity: 1; transform: translateX(-50%) translateY(0);
        }
        .disc-modal-toast {
          position: absolute; right: 0; bottom: calc(100% + 46px);
          background: var(--brass-deep); color: var(--paper);
          font-size: 12px; padding: 6px 12px; border-radius: 999px;
          white-space: nowrap; box-shadow: 0 8px 20px rgba(0,0,0,.18);
        }

        @media (max-width: 900px) {
          .disc-modal { grid-template-columns: 1fr; height: min(90vh, 680px); }
          .disc-modal-media { height: 260px; flex-shrink: 0; }
          .disc-modal-body { height: auto; padding: 22px 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .disc-app * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}