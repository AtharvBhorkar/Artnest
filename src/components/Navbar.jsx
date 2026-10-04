import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  MdClose,
  MdFavorite,
  MdFavoriteBorder,
  MdKeyboardArrowDown,
  MdMenu,
  MdOutlineShoppingBag,
  MdPersonOutline,
} from "react-icons/md";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/*
  Abhi login/cart/wishlist ka data nahi hai, isliye neeche mock values hain.
  - CURRENT_USER = null            -> guest (Login / Register dikhega)
  - CURRENT_USER.role = "buyer"    -> /profile
  - CURRENT_USER.role = "artist"   -> /artist/profile
  - CURRENT_USER.role = "admin"    -> /admin
  Baad mein developer inhe AuthContext / CartContext se replace kar dega.
*/
const CURRENT_USER = {
  name: "Aarav Mehta",
  role: "artist",
  tagline: "Paintings artist",
  initials: "AM",
};


const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Artists", href: "/artists" },
  { label: "Custom Art", href: "/custom-art" },
  { label: "About", href: "/about" },
];

const PROFILE_LINK = {
  buyer: "/dashboard",
  artist: "/artist/profile",
  admin: "/admin",
};

const ROLE_LABEL = {
  buyer: "Buyer account",
  artist: "Artist dashboard",
  admin: "Admin panel",
};

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-[9px] -top-[7px] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a85a3a] px-1 text-[9px] font-bold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { items: wishlistItems } = useWishlist();
  const { items: cartItems } = useCart();
  const { user: CURRENT_USER, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef(null);
  const onWishlist = pathname === "/wishlist";

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const profileTo = CURRENT_USER ? PROFILE_LINK[CURRENT_USER.role] : "/buyer/login";

  const closeMenu = () => setMenuOpen(false);



  // Escape dabane par menu / search band ho jaye
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLoginOpen(false);
      }
    };
    const onClick = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) setLoginOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const iconBtn =
    "relative flex h-9 w-9 items-center justify-center rounded-full text-[#4d4541] transition-colors hover:bg-[#f1e4d8] hover:text-[#a65335]";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#eee8e3] bg-[#fffefe]/95 font-sans backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-12">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center">
          <img src={logo} alt="ArtNest" className="h-9 w-auto sm:h-10 lg:h-11" />
        </Link>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`relative whitespace-nowrap py-1 text-[13px] transition-colors ${
                isActive(link.href)
                  ? "font-semibold text-[#a65335] after:absolute after:inset-x-0 after:-bottom-[13px] after:h-[2px] after:bg-[#a65335]"
                  : "text-[#625650] hover:text-[#a85537]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Reels 3D button (desktop) */}
        <div className="hidden lg:block">
          <Link
            to="/feed"
            className={`nav-reel ${pathname.startsWith("/feed") ? "is-active" : ""}`}
          >
            Offer Feed
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">


          {/* Wishlist */}
          <Link to="/wishlist" aria-label="Wishlist" className={iconBtn}>
            {onWishlist ? (
              <MdFavorite
                size={21}
                className="animate-[pulse_2.4s_ease-in-out_infinite] text-[#a65335]"
              />
            ) : (
              <MdFavoriteBorder size={21} />
            )}
            <Badge count={wishlistItems.length} />
          </Link>

          {/* Cart */}
          <Link to="/cart" aria-label="Cart" className={iconBtn}>
            <MdOutlineShoppingBag size={21} />
            <Badge count={cartItems.length} />
          </Link>

          <div className="mx-1 hidden h-[26px] w-px bg-[#e6ded8] sm:block" />

          {/* Guest: Login button + Buyer/Artist options (desktop) */}
          {!CURRENT_USER && (
            <div ref={loginRef} className="relative hidden sm:block">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={loginOpen}
                onClick={() => setLoginOpen((v) => !v)}
                className="flex h-9 cursor-pointer items-center gap-1 rounded-full bg-[#a65335] pl-4 pr-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#8f462c]"
              >
                Login
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${loginOpen ? "rotate-180" : ""}`}
                />
              </button>

              {loginOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#e6ded8] bg-white p-1.5 shadow-[0_15px_30px_rgba(65,43,31,0.12)]"
                >
                  <Link
                    to="/buyer/login"
                    role="menuitem"
                    onClick={() => setLoginOpen(false)}
                    className="block rounded-lg px-3 py-2.5 hover:bg-[#f8eadc]"
                  >
                    <span className="block text-[13px] font-semibold text-[#29221e]">Login as Buyer</span>
                    <span className="block text-[11.5px] text-[#765e51]">Browse, save and buy art</span>
                  </Link>
                  <Link
                    to="/artist/login"
                    role="menuitem"
                    onClick={() => setLoginOpen(false)}
                    className="block rounded-lg px-3 py-2.5 hover:bg-[#f8eadc]"
                  >
                    <span className="block text-[13px] font-semibold text-[#29221e]">Login as Artist</span>
                    <span className="block text-[11.5px] text-[#765e51]">Manage your studio and sales</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Logged in: profile avatar + hover card (desktop) */}
          {CURRENT_USER && (
          <div className="group relative hidden sm:block">
            <Link
              to={profileTo}
              aria-label="Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] text-[11px] font-semibold text-white"
            >
              {CURRENT_USER ? CURRENT_USER.initials : <MdPersonOutline size={19} />}
            </Link>

            <div className="invisible absolute right-0 top-full z-50 w-64 pt-3 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border border-[#e6ded8] bg-white p-4 shadow-[0_15px_30px_rgba(65,43,31,0.12)]">
                {CURRENT_USER ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] text-[12px] font-semibold text-white">
                        {CURRENT_USER.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#29221e]">
                          {CURRENT_USER.name}
                        </p>
                        <p className="truncate text-[12px] text-[#765e51]">
                          {CURRENT_USER.tagline}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] text-[#a8917f]">
                      {ROLE_LABEL[CURRENT_USER.role]}
                    </p>
                    <Link
                      to={profileTo}
                      className="mt-3 inline-block text-[13px] font-semibold text-[#a65335] hover:text-[#8f462c]"
                    >
                      Open profile &rarr;
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="mt-3 block cursor-pointer text-[13px] font-semibold text-[#765e51] hover:text-[#a65335]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[14px] font-semibold text-[#29221e]">
                      Welcome to ArtNest
                    </p>
                    <p className="mt-1 text-[12px] leading-[1.5] text-[#765e51]">
                      Login karke wishlist, cart aur orders dekho.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/buyer/login"
                        className="flex-1 rounded-[3px] bg-[#a65335] py-2 text-center text-[13px] font-semibold text-white hover:bg-[#8f462c]"
                      >
                        Login
                      </Link>
                      <Link
                        to="/buyer/register"
                        className="flex-1 rounded-[3px] border border-[#a65335] py-2 text-center text-[13px] font-semibold text-[#a65335] hover:bg-[#f8eadc]"
                      >
                        Register
                      </Link>
                    </div>
                    <Link
                      to="/artist/register"
                      className="mt-3 inline-block text-[12px] text-[#765e51] hover:text-[#a65335]"
                    >
                      Artist ho? Join as artist &rarr;
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Hamburger (mobile / tablet) */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[4px] text-[#4d4541] hover:bg-[#f1e4d8] lg:hidden"
          >
            {menuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {menuOpen && (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-[#eee8e3] bg-[#fffefe] px-4 pb-5 pt-3 sm:px-6 lg:hidden">


          <div className="mb-3 mt-1">
            <Link
              to="/feed"
              onClick={closeMenu}
              className={`nav-reel !w-full ${pathname.startsWith("/feed") ? "is-active" : ""}`}
            >
              Reels
            </Link>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={closeMenu}
              className={`block rounded-[4px] px-2 py-2.5 text-[14px] ${
                isActive(link.href)
                  ? "bg-[#f8eadc] font-semibold text-[#a65335]"
                  : "text-[#625650] hover:bg-[#f1e4d8] hover:text-[#a85537]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-[#eee8e3] pt-3">
            {CURRENT_USER ? (
              <Link
                to={profileTo}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-[4px] px-2 py-2 hover:bg-[#f1e4d8]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] text-[12px] font-semibold text-white">
                  {CURRENT_USER.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#29221e]">
                    {CURRENT_USER.name}
                  </p>
                  <p className="truncate text-[12px] text-[#765e51]">
                    {ROLE_LABEL[CURRENT_USER.role]}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/buyer/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-[3px] bg-[#a65335] py-2.5 text-center text-[14px] font-semibold text-white"
                >
                  Buyer Login
                </Link>
                <Link
                  to="/artist/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-[3px] border border-[#a65335] py-2.5 text-center text-[14px] font-semibold text-[#a65335]"
                >
                  Artist Login
                </Link>
              </div>
            )}

            {CURRENT_USER && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="mt-2 w-full cursor-pointer rounded-[3px] border border-[#e6ded8] py-2.5 text-[14px] font-semibold text-[#765e51]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;