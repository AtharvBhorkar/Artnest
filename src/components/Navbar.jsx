import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdOutlineVerified, MdMenu, MdClose, MdSearch } from "react-icons/md";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About ArtNest", href: "/custom-art" },
  { label: "Discover", href: "/discover" },
  { label: "Artists", href: "/artists" },
  { label: "Sculptures", href: "/sculptures" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (href) => pathname === href;

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    navigate(q ? `/discover?search=${encodeURIComponent(q)}` : "/discover");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full bg-[#fffefe] border-b border-[#eee8e3] font-sans">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-12">
          <Link to="/" className="flex shrink-0 items-center">
            <img src={logo} alt="Athenura" className="h-9 w-auto sm:h-10 lg:h-11" />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-[26px]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`whitespace-nowrap text-[13px] transition-colors ${
                  isActive(link.href)
                    ? "font-semibold text-[#a65335]"
                    : "text-[#625650] hover:text-[#a85537]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-[19px]">
            <div className="relative hidden items-center sm:flex">
              {searchOpen ? (
                <form
                  onSubmit={submitSearch}
                  className="flex items-center gap-1.5 rounded-full border border-[#e6ded8] bg-white px-3 py-1.5"
                >
                  <MdSearch className="shrink-0 text-[#a65335]" size={17} />
                  <input
                    autoFocus
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onBlur={() => {
                      if (!searchValue) setSearchOpen(false);
                    }}
                    placeholder="Search artworks, artists..."
                    className="w-36 bg-transparent text-[13px] text-[#29221e] placeholder:text-[#a8917f] focus:outline-none md:w-48"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className="border-none bg-transparent p-[3px] text-[#4d4541] hover:text-[#a65335] cursor-pointer"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20L16.2 16.2" />
                  </svg>
                </button>
              )}
            </div>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative border-none bg-transparent p-[3px] text-[#4d4541] hover:text-[#a65335] cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 8 4c1.5 0 3 .7 4 2 1-1.3 2.5-2 4-2a4.8 4.8 0 0 1 4.8 4.8Z" />
              </svg>
              <span className="absolute -top-[7px] -right-[9px] w-4 h-4 rounded-full bg-[#a85a3a] text-white text-[9px] font-bold flex items-center justify-center">
                4
              </span>
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative border-none bg-transparent p-[3px] text-[#4d4541] hover:text-[#a65335] cursor-pointer"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="absolute -top-[7px] -right-[9px] w-4 h-4 rounded-full bg-[#a85a3a] text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            <div className="hidden h-[30px] w-px bg-[#e6ded8] sm:block" />
            <Link
              to="/profile"
              aria-label="Profile"
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d6c4ae] to-[#b99a78] text-[9px] font-semibold text-white sm:flex"
            >
              AN
            </Link>

            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-[4px] border-none bg-transparent text-[#4d4541] hover:bg-[#f1e4d8] lg:hidden"
            >
              {menuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#eee8e3] bg-[#fffefe] px-4 pb-4 pt-3 sm:px-6 lg:hidden">
            <form
              onSubmit={submitSearch}
              className="mb-3 flex items-center gap-1.5 rounded-full border border-[#e6ded8] bg-white px-3 py-2"
            >
              <MdSearch className="shrink-0 text-[#a65335]" size={17} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search artworks, artists..."
                className="w-full bg-transparent text-[14px] text-[#29221e] placeholder:text-[#a8917f] focus:outline-none"
              />
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-[4px] px-2 py-2.5 text-[14px] ${
                  isActive(link.href)
                    ? "font-semibold text-[#a65335]"
                    : "text-[#625650] hover:bg-[#f1e4d8] hover:text-[#a85537]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;