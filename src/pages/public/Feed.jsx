import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Share2,
  X,
  Check,
  Send,
  Link2,
  Mail,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { ARTWORKS } from "../../data/artworks";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const artworkUrl = (art) => `${window.location.origin}/artwork/${art.id}`;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function Reel({ art, index, favorite, inCart, onLike, onCart, onMessage, onShare }) {
  const [burst, setBurst] = useState(0);

  const handleDoubleTap = () => {
    if (!favorite) onLike(art, true);
    setBurst((b) => b + 1);
  };

  return (
    <section className="fd-reel" data-index={index}>
      <div className="fd-reel-bg" style={{ backgroundImage: `url(${art.img})` }} />

      <div className="fd-stage">
        <div className="fd-card" onDoubleClick={handleDoubleTap}>
          <img
            src={art.img}
            alt={art.title}
            draggable={false}
            loading={index < 2 ? "eager" : "lazy"}
          />
          <div className="fd-card-shade" />
          <span className="fd-tag">{art.tag}</span>

          {burst > 0 && (
            <motion.div
              key={burst}
              className="fd-burst"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.25, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            >
              <Heart size={96} fill="currentColor" strokeWidth={0} />
            </motion.div>
          )}

          <div className="fd-info">
            <div className="fd-artist">
              <span className="fd-avatar">{initials(art.artist)}</span>
              <div>
                <p>{art.artist}</p>
                <span>{art.location}</span>
              </div>
            </div>
            <Link to={`/artwork/${art.id}`} className="fd-title">
              {art.title}
            </Link>
            <p className="fd-medium">
              {art.medium} · {art.dims}
            </p>
            <div className="fd-price-row">
              <strong>₹{art.value.toLocaleString()}</strong>
              <Link to={`/artwork/${art.id}`} className="fd-view">
                View details
              </Link>
            </div>
          </div>
        </div>

        <div className="fd-rail">
          <button
            type="button"
            className={`fd-act ${favorite ? "is-on" : ""}`}
            onClick={() => onLike(art)}
            aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <span className="fd-act-btn">
              <motion.span whileTap={{ scale: 0.75 }} style={{ display: "flex" }}>
                <Heart size={22} strokeWidth={1.8} fill={favorite ? "currentColor" : "none"} />
              </motion.span>
            </span>
            <em>{favorite ? "Saved" : "Wishlist"}</em>
          </button>

          <button
            type="button"
            className={`fd-act ${inCart ? "is-cart" : ""}`}
            onClick={() => onCart(art)}
            aria-label={inCart ? "Remove from cart" : "Add to cart"}
          >
            <span className="fd-act-btn">
              <ShoppingBag size={21} strokeWidth={1.8} fill={inCart ? "currentColor" : "none"} />
            </span>
            <em>{inCart ? "In cart" : "Cart"}</em>
          </button>

          <button
            type="button"
            className="fd-act"
            onClick={() => onMessage(art)}
            aria-label={`Message ${art.artist}`}
          >
            <span className="fd-act-btn">
              <MessageCircle size={21} strokeWidth={1.8} />
            </span>
            <em>Message</em>
          </button>

          <button type="button" className="fd-act" onClick={() => onShare(art)} aria-label="Share">
            <span className="fd-act-btn">
              <Share2 size={20} strokeWidth={1.8} />
            </span>
            <em>Share</em>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Message popup ------------------------------ */

const QUICK_MESSAGES = [
  "Is this piece still available?",
  "Can you ship to my city?",
  "Can I commission a custom size?",
  "Is the price negotiable?",
];

function MessageModal({ art, onClose, onSend }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    const msg = text.trim();
    if (msg) onSend(art, msg);
  };

  return (
    <div className="fd-modal-wrap" onClick={onClose}>
      <motion.div
        className="fd-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="fd-modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="fd-modal-head">
          <span className="fd-avatar lg">{initials(art.artist)}</span>
          <div>
            <h3>Message {art.artist}</h3>
            <p>{art.location} · usually replies within a day</p>
          </div>
        </div>

        <div className="fd-modal-art">
          <img src={art.img} alt={art.title} />
          <div>
            <strong>{art.title}</strong>
            <span>₹{art.value.toLocaleString()}</span>
          </div>
        </div>

        <div className="fd-quick">
          {QUICK_MESSAGES.map((q) => (
            <button key={q} type="button" onClick={() => setText(q)}>
              {q}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Write to ${art.artist} about “${art.title}”…`}
          rows={4}
          maxLength={500}
          autoFocus
        />

        <button className="fd-send" type="button" onClick={submit} disabled={!text.trim()}>
          <Send size={16} strokeWidth={1.8} /> Send message
        </button>
      </motion.div>
    </div>
  );
}

/* ------------------------------- Share popup ------------------------------- */

function ShareModal({ art, onClose, onCopied }) {
  const url = artworkUrl(art);
  const text = `${art.title} by ${art.artist} on ArtNest`;
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    const ok = await copyText(url);
    onCopied(ok ? "Link copied" : "Could not copy link");
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: art.title, text, url });
      onClose();
    } catch {
      /* user cancelled */
    }
  };

  const e = encodeURIComponent;
  const targets = [
    { label: "WhatsApp", href: `https://wa.me/?text=${e(`${text} ${url}`)}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${e(url)}&text=${e(text)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${e(url)}&text=${e(text)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
  ];

  return (
    <div className="fd-modal-wrap" onClick={onClose}>
      <motion.div
        className="fd-modal"
        onClick={(ev) => ev.stopPropagation()}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="fd-modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="fd-modal-head">
          <div>
            <h3>Share this artwork</h3>
            <p>Anyone with the link lands straight on this piece.</p>
          </div>
        </div>

        <div className="fd-modal-art">
          <img src={art.img} alt={art.title} />
          <div>
            <strong>{art.title}</strong>
            <span>{art.artist}</span>
          </div>
        </div>

        <div className="fd-linkbox">
          <Link2 size={16} />
          <input readOnly value={url} onFocus={(ev) => ev.target.select()} />
          <button type="button" onClick={copy}>
            Copy
          </button>
        </div>

        <div className="fd-share-grid">
          {targets.map((t) => (
            <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer">
              {t.label}
            </a>
          ))}
          <a href={`mailto:?subject=${e(text)}&body=${e(url)}`}>
            <Mail size={14} /> Email
          </a>
          {canNativeShare && (
            <button type="button" onClick={nativeShare}>
              More…
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */

export default function Feed() {
  const [searchParams] = useSearchParams();
  const { favorites, toggle } = useWishlist();
  const { inCart, toggleCart } = useCart();

  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [messageArt, setMessageArt] = useState(null);
  const [shareArt, setShareArt] = useState(null);
  const [toast, setToast] = useState("");

  const anyModal = !!messageArt || !!shareArt;

  // Feed page owns the viewport: stop the body from scrolling behind it
  useEffect(() => {
    const root = document.documentElement;
    const prev = {
      overflow: document.body.style.overflow,
      bg: root.style.backgroundColor,
      scrollbarColor: root.style.scrollbarColor,
      colorScheme: root.style.colorScheme,
    };
    document.body.style.overflow = "hidden";
    root.style.backgroundColor = "#100c09";
    root.style.scrollbarColor = "#100c09 #100c09";
    root.style.colorScheme = "dark";
    return () => {
      document.body.style.overflow = prev.overflow;
      root.style.backgroundColor = prev.bg;
      root.style.scrollbarColor = prev.scrollbarColor;
      root.style.colorScheme = prev.colorScheme;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1900);
    return () => clearTimeout(t);
  }, [toast]);

  const scrollToIndex = useCallback((i, smooth = true) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(ARTWORKS.length - 1, i));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // /feed?art=5 opens directly on that artwork
  useEffect(() => {
    const id = searchParams.get("art");
    if (!id) return;
    const i = ARTWORKS.findIndex((a) => String(a.id) === id);
    if (i > 0) scrollToIndex(i, false);
  }, [searchParams, scrollToIndex]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(Number(en.target.dataset.index));
        });
      },
      { root, threshold: 0.6 }
    );
    root.querySelectorAll(".fd-reel").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keyboard: arrows / j / k
  useEffect(() => {
    const onKey = (e) => {
      if (anyModal) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToIndex(active + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToIndex(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, anyModal, scrollToIndex]);

  const handleLike = (art, fromDoubleTap = false) => {
    const saved = favorites.has(art.id);
    if (fromDoubleTap && saved) return;
    toggle(art);
    setToast(saved ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleCart = (art) => {
    const has = inCart.has(art.id);
    toggleCart(art);
    setToast(has ? "Removed from cart" : "Added to cart");
  };

  const handleSend = (art, message) => {
    // TODO: replace with a real API call. Stored locally for now.
    try {
      const key = "artnest_feed_messages";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ artworkId: art.id, artist: art.artist, message, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* ignore */
    }
    setMessageArt(null);
    setToast(`Message sent to ${art.artist}`);
  };

  return (
    <div className="fd-app">
      <Navbar />

      <div className="fd-body">
        <div className="fd-scroll" ref={scrollerRef}>
          {ARTWORKS.map((art, i) => (
            <Reel
              key={art.id}
              art={art}
              index={i}
              favorite={favorites.has(art.id)}
              inCart={inCart.has(art.id)}
              onLike={handleLike}
              onCart={handleCart}
              onMessage={setMessageArt}
              onShare={setShareArt}
            />
          ))}
        </div>

        <div className="fd-nav">
          <button type="button" onClick={() => scrollToIndex(active - 1)} disabled={active === 0} aria-label="Previous">
            <ChevronUp size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === ARTWORKS.length - 1}
            aria-label="Next"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {messageArt && (
          <MessageModal key="msg" art={messageArt} onClose={() => setMessageArt(null)} onSend={handleSend} />
        )}
        {shareArt && (
          <ShareModal
            key="share"
            art={shareArt}
            onClose={() => setShareArt(null)}
            onCopied={(m) => setToast(m)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fd-toast"
            key={toast}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');

        .fd-app {
          --ink: #1c1712; --paper: #f6f1e6; --paper-2: #efe6d3; --line: #ddd0b8;
          --brass-deep: #6f5222; --wine: #5c2b30;
          --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
          --sans: "Work Sans", "Inter", system-ui, sans-serif;
          height: 100vh; height: 100dvh;
          display: flex; flex-direction: column;
          background: #100c09; color: var(--paper);
          font-family: var(--sans); overflow: hidden;
        }
        .fd-app * { box-sizing: border-box; }

        .fd-body { position: relative; flex: 1; min-height: 0; }
        .fd-scroll {
          height: 100%; overflow-y: scroll;
          scroll-snap-type: y mandatory; overscroll-behavior: contain;
          scrollbar-width: none;
        }
        .fd-scroll::-webkit-scrollbar { display: none; }

        .fd-reel {
          position: relative; height: 100%; overflow: hidden;
          scroll-snap-align: start; scroll-snap-stop: always;
        }
        .fd-reel-bg {
          position: absolute; inset: -40px; background-size: cover; background-position: center;
          filter: blur(40px) brightness(.32) saturate(1.25); transform: scale(1.1);
        }
        .fd-stage {
          position: relative; z-index: 1; height: 100%;
          display: flex; align-items: flex-end; justify-content: center;
          gap: 18px; padding: 16px 0;
        }

        .fd-card {
          position: relative; height: 100%; aspect-ratio: 9 / 16;
          max-width: min(460px, 100vw); border-radius: 22px; overflow: hidden;
          background: #000; box-shadow: 0 30px 70px rgba(0,0,0,.5);
          user-select: none; -webkit-user-select: none;
        }
        .fd-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .fd-card-shade {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(0,0,0,.28) 0%, transparent 22%, transparent 48%, rgba(0,0,0,.85) 100%);
        }
        .fd-tag {
          position: absolute; top: 16px; left: 16px;
          background: rgba(20,15,10,.6); backdrop-filter: blur(6px);
          font-size: 11.5px; padding: 6px 12px; border-radius: 999px; color: #f1e8d4;
        }
        .fd-burst {
          position: absolute; inset: 0; margin: auto; width: 96px; height: 96px;
          color: #ee6a5f; pointer-events: none; opacity: 0;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,.4));
        }

        .fd-info { position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 22px 24px; }
        .fd-artist { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .fd-artist p { margin: 0; font-size: 14px; font-weight: 600; }
        .fd-artist span { font-size: 12px; color: #d9cdb6; }
        .fd-avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #d6c4ae, #b99a78);
          color: #fff; font-size: 12px; font-weight: 600;
        }
        .fd-avatar.lg { width: 46px; height: 46px; font-size: 14px; }
        .fd-title {
          display: block; font-family: var(--serif); font-weight: 500;
          font-size: 24px; line-height: 1.2; color: #fff; text-decoration: none; margin-bottom: 6px;
        }
        .fd-medium { margin: 0 0 14px; font-size: 13px; color: #d9cdb6; }
        .fd-price-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .fd-price-row strong { font-family: var(--serif); font-weight: 500; font-size: 22px; }
        .fd-view {
          background: rgba(246,241,230,.94); color: var(--ink); text-decoration: none;
          font-size: 12.5px; font-weight: 500; padding: 8px 16px; border-radius: 999px;
          transition: background .2s ease;
        }
        .fd-view:hover { background: #fff; }

        .fd-rail { display: flex; flex-direction: column; align-items: center; gap: 18px; padding-bottom: 6px; }
        .fd-act {
          background: none; border: none; color: #f6f1e6; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 0;
        }
        .fd-act-btn {
          width: 50px; height: 50px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(246,241,230,.13); border: 1px solid rgba(246,241,230,.16);
          backdrop-filter: blur(10px);
          transition: background .2s ease, transform .2s ease, color .2s ease;
        }
        .fd-act:hover .fd-act-btn { background: rgba(246,241,230,.24); transform: scale(1.06); }
        .fd-act em { font-style: normal; font-size: 11px; color: #e7ddc9; }
        .fd-act.is-on .fd-act-btn { color: #ee6a5f; background: rgba(238,106,95,.16); border-color: rgba(238,106,95,.4); }
        .fd-act.is-cart .fd-act-btn { color: #e0b969; background: rgba(224,185,105,.16); border-color: rgba(224,185,105,.4); }
        .fd-nav {
          position: absolute; right: 26px; top: 50%; transform: translateY(-50%);
          z-index: 5; display: flex; flex-direction: column; gap: 10px;
        }
        .fd-nav button {
          width: 42px; height: 42px; border-radius: 50%; cursor: pointer; color: #f6f1e6;
          background: rgba(246,241,230,.12); border: 1px solid rgba(246,241,230,.16);
          display: flex; align-items: center; justify-content: center; transition: background .2s ease;
        }
        .fd-nav button:hover:not(:disabled) { background: rgba(246,241,230,.26); }
        .fd-nav button:disabled { opacity: .3; cursor: default; }

        /* Popups */
        .fd-modal-wrap {
          position: fixed; inset: 0; z-index: 100; padding: 20px;
          background: rgba(10,8,6,.66); backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
        }
        .fd-modal {
          position: relative; width: min(440px, 100%); max-height: 92vh; overflow-y: auto;
          background: var(--paper); color: var(--ink); border-radius: 20px; padding: 24px;
          box-shadow: 0 30px 80px rgba(0,0,0,.45);
        }
        .fd-modal-close {
          position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%;
          background: var(--paper-2); border: none; cursor: pointer; color: var(--ink);
          display: flex; align-items: center; justify-content: center;
        }
        .fd-modal-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-right: 30px; }
        .fd-modal-head h3 { margin: 0 0 2px; font-family: var(--serif); font-weight: 500; font-size: 20px; }
        .fd-modal-head p { margin: 0; font-size: 12.5px; color: #7a6d58; }
        .fd-modal-art {
          display: flex; align-items: center; gap: 12px; padding: 10px;
          background: var(--paper-2); border: 1px solid var(--line); border-radius: 14px; margin-bottom: 16px;
        }
        .fd-modal-art img { width: 54px; height: 54px; border-radius: 10px; object-fit: cover; }
        .fd-modal-art strong { display: block; font-family: var(--serif); font-weight: 500; font-size: 15px; color: var(--brass-deep); }
        .fd-modal-art span { font-size: 12.5px; color: #7a6d58; }

        .fd-quick { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .fd-quick button {
          border: 1px solid var(--line); background: var(--paper-2); color: #4a423a;
          padding: 6px 12px; border-radius: 999px; font-size: 12px; cursor: pointer;
          font-family: var(--sans); transition: all .15s ease;
        }
        .fd-quick button:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }

        .fd-modal textarea {
          width: 100%; resize: none; border: 1px solid var(--line); background: #fff;
          border-radius: 12px; padding: 12px 14px; font-family: var(--sans); font-size: 14px;
          color: var(--ink); outline: none; margin-bottom: 14px;
        }
        .fd-modal textarea:focus { border-color: var(--brass-deep); }
        .fd-send {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--ink); color: var(--paper); border: none; border-radius: 999px;
          padding: 12px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--sans);
          transition: background .2s ease;
        }
        .fd-send:hover:not(:disabled) { background: var(--wine); }
        .fd-send:disabled { opacity: .45; cursor: default; }

        .fd-linkbox {
          display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 14px;
          background: #fff; border: 1px solid var(--line); border-radius: 999px; margin-bottom: 16px;
          color: #7a6d58;
        }
        .fd-linkbox input {
          flex: 1; min-width: 0; border: none; outline: none; background: transparent;
          font-size: 13px; color: var(--ink); font-family: var(--sans);
        }
        .fd-linkbox button {
          background: var(--ink); color: var(--paper); border: none; border-radius: 999px;
          padding: 8px 16px; font-size: 12.5px; font-weight: 500; cursor: pointer;
        }
        .fd-linkbox button:hover { background: var(--wine); }

        .fd-share-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .fd-share-grid a, .fd-share-grid button {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          border: 1px solid var(--line); background: var(--paper-2); color: var(--ink);
          padding: 10px 8px; border-radius: 12px; font-size: 13px; text-decoration: none;
          cursor: pointer; font-family: var(--sans); transition: all .15s ease;
        }
        .fd-share-grid a:hover, .fd-share-grid button:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }

        .fd-toast {
          position: fixed; left: 50%; bottom: 30px; transform: translateX(-50%); z-index: 120;
          display: flex; align-items: center; gap: 8px; white-space: nowrap;
          background: var(--paper); color: var(--ink); font-size: 13px; font-weight: 500;
          padding: 10px 18px; border-radius: 999px; box-shadow: 0 14px 34px rgba(0,0,0,.4);
        }

        @media (max-width: 900px) {
          .fd-nav { display: none; }
        }
        @media (max-width: 640px) {
          .fd-stage { padding: 0; gap: 0; }
          .fd-card { width: 100%; max-width: none; aspect-ratio: auto; border-radius: 0; }
          .fd-rail { position: absolute; right: 10px; bottom: 132px; z-index: 3; gap: 14px; }
          .fd-act-btn { width: 46px; height: 46px; }
          .fd-info { padding: 24px 74px 22px 18px; }
          .fd-title { font-size: 21px; }
          .fd-modal-wrap { align-items: flex-end; padding: 0; }
          .fd-modal { width: 100%; border-radius: 22px 22px 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fd-app * { transition: none !important; }
          .fd-scroll { scroll-behavior: auto; }
        }
      `}</style>
    </div>
  );
}