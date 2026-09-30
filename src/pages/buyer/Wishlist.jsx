import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, ChevronDown, Trash2 } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

const CATEGORY_LABELS = {
  paintings: "Paintings",
  sculptures: "Sculptures",
  ceramics: "Ceramics & Pottery",
  photography: "Photography",
  digital: "Digital & New Media",
  textile: "Textile & Fiber Art",
  printmaking: "Printmaking & Monotype",
};

const SORTS = ["Recently saved", "Price: Low to High", "Price: High to Low", "Artist A–Z"];

export default function Wishlist() {
  const { items, remove, restore, clear } = useWishlist();
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState(SORTS[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [undo, setUndo] = useState(null);

  // Auto-hide the undo toast
  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 5000);
    return () => clearTimeout(t);
  }, [undo]);

  // Auto-cancel the "Confirm clear" state
  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 3500);
    return () => clearTimeout(t);
  }, [confirmClear]);

  const categoryCounts = useMemo(() => {
    const map = {};
    items.forEach((i) => {
      map[i.category] = (map[i.category] || 0) + 1;
    });
    return map;
  }, [items]);

  // If the selected category becomes empty (after removing), fall back to All
  useEffect(() => {
    if (category !== "all" && !categoryCounts[category]) setCategory("all");
  }, [category, categoryCounts]);

  const visible = useMemo(() => {
    const list = items.filter((i) => category === "all" || i.category === category);
    const sorted = [...list];
    if (sort === "Price: Low to High") sorted.sort((a, b) => a.value - b.value);
    else if (sort === "Price: High to Low") sorted.sort((a, b) => b.value - a.value);
    else if (sort === "Artist A–Z") sorted.sort((a, b) => a.artist.localeCompare(b.artist));
    else sorted.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    return sorted;
  }, [items, category, sort]);

  const totalValue = items.reduce((sum, i) => sum + i.value, 0);
  const artistCount = new Set(items.map((i) => i.artist)).size;

  const handleRemove = (id) => {
    const index = items.findIndex((i) => i.id === id);
    const item = items[index];
    if (!item) return;
    remove(id);
    setUndo({ item, index });
  };

  const handleUndo = () => {
    if (!undo) return;
    restore(undo.item, undo.index);
    setUndo(null);
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clear();
    setConfirmClear(false);
    setUndo(null);
  };

  return (
    <div className="wl-app">
      <div className="wl-shell">
        {/* Header */}
        <motion.header
          className="wl-head"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="wl-eyebrow">Your collection</p>
            <h1 className="wl-title">Saved works</h1>
            <p className="wl-sub">
              Pieces you have set aside. Come back to them whenever you are ready to acquire.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              className={`wl-clear ${confirmClear ? "is-confirm" : ""}`}
              onClick={handleClear}
            >
              <Trash2 size={14} strokeWidth={1.8} />
              {confirmClear ? "Tap again to confirm" : "Clear all"}
            </button>
          )}
        </motion.header>

        {items.length === 0 ? (
          <motion.div
            className="wl-empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="wl-empty-icon">
              <Heart size={30} strokeWidth={1.5} />
            </div>
            <h2>Nothing saved yet</h2>
            <p>
              Tap the heart on any artwork to keep it here. Your saved pieces stay on this device
              until you remove them.
            </p>
            <Link to="/discover" className="wl-cta">
              Explore artworks <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="wl-stats">
              <div>
                <span>Saved works</span>
                <strong>{items.length}</strong>
              </div>
              <div>
                <span>Artists</span>
                <strong>{artistCount}</strong>
              </div>
              <div>
                <span>Combined value</span>
                <strong>₹{totalValue.toLocaleString()}</strong>
              </div>
            </div>

            {/* Toolbar */}
            <div className="wl-toolbar">
              <div className="wl-chips">
                <button
                  type="button"
                  className={`wl-chip ${category === "all" ? "is-active" : ""}`}
                  onClick={() => setCategory("all")}
                >
                  All <em>{items.length}</em>
                </button>
                {Object.keys(categoryCounts).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`wl-chip ${category === c ? "is-active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {CATEGORY_LABELS[c] || c} <em>{categoryCounts[c]}</em>
                  </button>
                ))}
              </div>

              <div className="wl-sort">
                <button type="button" onClick={() => setSortOpen((s) => !s)}>
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
                      {SORTS.map((s) => (
                        <li
                          key={s}
                          className={s === sort ? "is-active" : ""}
                          onClick={() => {
                            setSort(s);
                            setSortOpen(false);
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grid */}
            <div className="wl-grid">
              <AnimatePresence>
                {visible.map((art) => (
                  <motion.article
                    key={art.id}
                    className="wl-card"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link to={`/artwork/${art.id}`} className="wl-card-media">
                      <img src={art.img} alt={art.title} loading="lazy" />
                      <span className="wl-card-tag">{art.tag}</span>
                    </Link>

                    <button
                      type="button"
                      className="wl-remove"
                      onClick={() => handleRemove(art.id)}
                      aria-label="Remove from wishlist"
                      data-tip="Remove from wishlist"
                    >
                      <Heart size={16} strokeWidth={1.8} fill="currentColor" />
                    </button>

                    <div className="wl-card-body">
                      <p className="wl-card-artist">
                        {art.artist} <span>· {art.location}</span>
                      </p>
                      <h3 className="wl-card-title">{art.title}</h3>
                      <p className="wl-card-medium">
                        {art.medium} · {art.dims}
                      </p>

                      <div className="wl-card-footer">
                        <div>
                          <span className="wl-card-label">Current value</span>
                          <span className="wl-card-value">₹{art.value.toLocaleString()}</span>
                        </div>
                        <Link to={`/artwork/${art.id}`} className="wl-view">
                          View details
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <div className="wl-more">
              <Link to="/discover">
                Continue exploring <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Undo toast */}
      <AnimatePresence>
        {undo && (
          <motion.div
            className="wl-toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <span>Removed “{undo.item.title}”</span>
            <button type="button" onClick={handleUndo}>
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');

        .wl-app {
          --ink: #1c1712;
          --ink-soft: #4a423a;
          --paper: #f6f1e6;
          --paper-2: #efe6d3;
          --line: #ddd0b8;
          --brass-deep: #6f5222;
          --wine: #5c2b30;
          --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
          --sans: "Work Sans", "Inter", system-ui, sans-serif;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          min-height: 100vh;
        }
        .wl-app * { box-sizing: border-box; }

        .wl-shell {
          max-width: 1240px; margin: 0 auto;
          padding: 56px 28px 90px;
        }

        .wl-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; flex-wrap: wrap; margin-bottom: 34px;
        }
        .wl-eyebrow { font-size: 13px; letter-spacing: .04em; color: var(--brass-deep); margin: 0 0 10px; font-weight: 500; }
        .wl-title {
          font-family: var(--serif); font-weight: 500;
          font-size: clamp(34px, 5vw, 54px); line-height: 1.05;
          margin: 0 0 12px; letter-spacing: -0.01em;
        }
        .wl-sub { margin: 0; color: var(--ink-soft); font-size: 15px; line-height: 1.6; max-width: 460px; }

        .wl-clear {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; border: 1px solid var(--line); color: var(--ink-soft);
          padding: 9px 16px; border-radius: 999px; font-size: 13px; cursor: pointer;
          font-family: var(--sans); transition: all .2s ease;
        }
        .wl-clear:hover { border-color: var(--wine); color: var(--wine); }
        .wl-clear.is-confirm { background: var(--wine); border-color: var(--wine); color: var(--paper); }

        .wl-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          margin-bottom: 30px;
        }
        .wl-stats > div {
          background: var(--paper-2); border: 1px solid var(--line);
          border-radius: 16px; padding: 18px 22px;
        }
        .wl-stats span { display: block; font-size: 12px; color: #a3946f; margin-bottom: 6px; }
        .wl-stats strong { font-family: var(--serif); font-weight: 500; font-size: 26px; }

        .wl-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .wl-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .wl-chip {
          border: 1px solid var(--line); background: var(--paper-2);
          padding: 7px 14px; border-radius: 999px; font-size: 12.5px;
          cursor: pointer; color: var(--ink-soft); font-family: var(--sans);
          transition: all .15s ease;
        }
        .wl-chip em { font-style: normal; opacity: .6; margin-left: 4px; }
        .wl-chip.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }

        .wl-sort { position: relative; }
        .wl-sort > button {
          display: flex; align-items: center; gap: 8px;
          background: var(--paper-2); border: 1px solid var(--line);
          padding: 9px 14px; border-radius: 999px; font-size: 13px; cursor: pointer;
          color: var(--ink); font-family: var(--sans);
        }
        .wl-sort ul {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: var(--paper); border: 1px solid var(--line);
          border-radius: 12px; list-style: none; padding: 6px; margin: 0;
          width: 200px; box-shadow: 0 14px 30px rgba(0,0,0,.12); z-index: 10;
        }
        .wl-sort li { padding: 9px 10px; font-size: 13px; border-radius: 8px; cursor: pointer; }
        .wl-sort li:hover { background: var(--paper-2); }
        .wl-sort li.is-active { font-weight: 600; }

        .wl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }

        .wl-card {
          position: relative;
          background: var(--paper-2); border: 1px solid var(--line);
          border-radius: 16px; display: flex; flex-direction: column;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .wl-card:hover { transform: translateY(-5px); box-shadow: 0 18px 36px rgba(28,23,18,.1); }

        .wl-card-media {
          position: relative; display: block; aspect-ratio: 4/3.1;
          overflow: hidden; border-radius: 16px 16px 0 0;
        }
        .wl-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
        .wl-card:hover .wl-card-media img { transform: scale(1.045); }
        .wl-card-tag {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(28,23,18,.72); color: #f1e8d4;
          font-size: 11px; padding: 5px 10px; border-radius: 999px;
        }

        .wl-remove {
          position: absolute; top: 10px; right: 10px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(246,241,230,.94); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--wine); transition: transform .15s ease;
        }
        .wl-remove:hover { transform: scale(1.1); }
        .wl-remove::after {
          content: attr(data-tip);
          position: absolute; top: calc(100% + 8px); right: 0;
          background: var(--ink); color: var(--paper);
          font-size: 11.5px; white-space: nowrap;
          padding: 5px 9px; border-radius: 6px;
          opacity: 0; pointer-events: none; transition: opacity .15s ease;
        }
        .wl-remove:hover::after { opacity: 1; }

        .wl-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .wl-card-artist {
          font-size: 12.5px; color: var(--ink-soft); margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wl-card-artist span { color: #a3946f; }
        .wl-card-title {
          font-family: var(--serif); font-weight: 500; font-size: 18px;
          margin: 2px 0 2px; color: var(--brass-deep); line-height: 1.3;
        }
        .wl-card-medium { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 8px; }

        .wl-card-footer {
          margin-top: auto; padding-top: 10px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .wl-card-label { display: block; font-size: 11px; color: #a3946f; }
        .wl-card-value { font-family: var(--serif); font-size: 17px; font-weight: 500; }
        .wl-view {
          background: var(--ink); color: var(--paper); text-decoration: none;
          padding: 9px 16px; border-radius: 999px; font-size: 12.5px; font-weight: 500;
          transition: background .2s ease;
        }
        .wl-view:hover { background: var(--wine); }

        .wl-more { display: flex; justify-content: center; margin-top: 44px; }
        .wl-more a {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--brass-deep); font-size: 14px; text-decoration: none; font-weight: 500;
          border-bottom: 1px solid transparent; transition: border-color .2s ease;
        }
        .wl-more a:hover { border-color: var(--brass-deep); }

        .wl-empty {
          text-align: center; padding: 70px 20px 90px;
          background: var(--paper-2); border: 1px dashed var(--line); border-radius: 22px;
        }
        .wl-empty-icon {
          width: 72px; height: 72px; margin: 0 auto 20px; border-radius: 50%;
          background: var(--paper); border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center; color: var(--wine);
        }
        .wl-empty h2 { font-family: var(--serif); font-weight: 500; font-size: 26px; margin: 0 0 10px; }
        .wl-empty p { color: var(--ink-soft); font-size: 14.5px; line-height: 1.6; max-width: 400px; margin: 0 auto 24px; }
        .wl-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--ink); color: var(--paper); text-decoration: none;
          padding: 12px 22px; border-radius: 999px; font-size: 14px; font-weight: 500;
          transition: background .2s ease;
        }
        .wl-cta:hover { background: var(--brass-deep); }

        .wl-toast {
          position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%);
          z-index: 90; display: flex; align-items: center; gap: 16px;
          background: var(--ink); color: var(--paper);
          padding: 12px 14px 12px 20px; border-radius: 999px; font-size: 13px;
          box-shadow: 0 16px 40px rgba(0,0,0,.28); max-width: 92vw;
        }
        .wl-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .wl-toast button {
          background: rgba(246,241,230,.14); color: var(--paper); border: none;
          padding: 6px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 600; cursor: pointer;
        }
        .wl-toast button:hover { background: rgba(246,241,230,.26); }

        @media (max-width: 980px) {
          .wl-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 620px) {
          .wl-shell { padding: 36px 16px 70px; }
          .wl-grid { grid-template-columns: 1fr; gap: 16px; }
          .wl-stats { grid-template-columns: 1fr; gap: 10px; }
          .wl-stats > div { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; }
          .wl-stats span { margin: 0; }
          .wl-stats strong { font-size: 22px; }
          .wl-sort { width: 100%; }
          .wl-sort > button { width: 100%; justify-content: space-between; }
          .wl-sort ul { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wl-app * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}