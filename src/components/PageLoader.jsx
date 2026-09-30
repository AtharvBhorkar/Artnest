import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/* Text shown inside the loader */
const LOADER_TEXT = "ArtNest";

/* Hard limits (ms). Every page stays between 2s and 5s. */
const MIN_MS = 1000;
const MAX_MS = 2000;
const DEFAULT_MS = 1000;

/* Per-page loader time in ms. Most specific paths first. */
const DURATIONS = [
  // Auth
  ["/buyer", 1000],
  ["/artist/login", 1000],
  ["/artist/register", 1000],
  ["/artist/forgot-password", 1000],
  ["/admin/login", 1000],

  // Public
  ["/discover", 1700],
  ["/feed", 2000],
  ["/artists", 1500],
  ["/custom-art", 1800],
  ["/collections", 1700],
  ["/artwork", 1500],
  ["/about", 1200],
  ["/contact", 1000],
  ["/privacy", 1000],
  ["/terms", 1000],

  // Buyer
  ["/wishlist", 1200],
  ["/cart", 1200],
  ["/checkout", 1700],
  ["/order-success", 1000],
  ["/orders", 1500],
  ["/profile", 1200],

  // Dashboards
  ["/artist", 1700],
  ["/admin", 1800],
];

function getDuration(pathname) {
  let ms = DEFAULT_MS;
  if (pathname === "/") {
    ms = 1500;
  } else {
    const hit = DURATIONS.find(([p]) => pathname === p || pathname.startsWith(p + "/"));
    if (hit) ms = hit[1];
  }
  return Math.min(MAX_MS, Math.max(MIN_MS, ms));
}

export default function PageLoader() {
  const { pathname } = useLocation();
  const [doneFor, setDoneFor] = useState(null);

  // Derived during render, so the overlay is up in the same frame the route changes (no flash)
  const loading = doneFor !== pathname;
  const duration = useMemo(() => getDuration(pathname), [pathname]);

  useEffect(() => {
    const t = setTimeout(() => setDoneFor(pathname), duration);
    return () => clearTimeout(t);
  }, [pathname, duration]);

  // Stop the page scrolling behind the loader
  useEffect(() => {
    if (!loading) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="page-loader"
            className="pl-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            role="status"
            aria-label="Loading"
          >
            <p className="pl-loader">
              <span>{LOADER_TEXT}</span>
            </p>

          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pl-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: #14100c;
        }

        .pl-loader {
          --fs: 50px;
          max-width: fit-content;
          margin: 0;
          color: rgb(242, 255, 240);
          font-size: var(--fs);
          font-family: Mine, "Fraunces", "Iowan Old Style", Georgia, serif;
          position: relative;
          font-style: italic;
          font-weight: 600;
        }
        .pl-loader span {
          animation: pl-cut 2s infinite;
          transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .pl-loader:hover { color: #fcffdf; }
        .pl-loader::after {
          position: absolute; content: ""; width: 100%; height: 6px; border-radius: 4px;
          background-color: #ff828291; top: 0; left: 0; z-index: 0;
          filter: blur(10px);
          animation: pl-scan 2s infinite;
          transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .pl-loader::before {
          position: absolute; content: ""; width: 100%; height: 5px; border-radius: 4px;
          background-color: #ff8282; top: 0; left: 0; z-index: 1;
          filter: opacity(0.9);
          animation: pl-scan 2s infinite;
          transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes pl-scan {
          0%   { top: 0px; }
          25%  { top: calc(var(--fs) * 1.08); }
          50%  { top: 0px; }
          75%  { top: calc(var(--fs) * 1.08); }
        }
        @keyframes pl-cut {
          0%   { clip-path: inset(0 0 0 0); }
          25%  { clip-path: inset(100% 0 0 0); }
          50%  { clip-path: inset(0 0 100% 0); }
          75%  { clip-path: inset(0 0 0 0); }
        }
        @media (max-width: 520px) {
          .pl-loader { --fs: 38px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pl-loader span { animation: none; }
          .pl-loader::before, .pl-loader::after { animation: none; }
        }
      `}</style>
    </>
  );
}