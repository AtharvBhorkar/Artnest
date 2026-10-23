import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const TITLES = {
  "/artist": ["Dashboard", "Your studio at a glance."],
  "/artist/artworks": ["My Artworks", "Manage your listings."],
  "/artist/artworks/new": ["New Artwork", "Add a new piece to your studio."],
  "/artist/orders": ["Orders", "Track and fulfil your orders."],
  "/artist/requests": ["Custom Requests", "Commission requests sent to you."],
  "/artist/earnings": ["Earnings", "Your balance and payouts."],
  "/artist/reviews": ["Reviews", "What buyers say about your work."],
  "/artist/profile": ["Profile", "Your public artist details."],
};

function titleFor(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (/^\/artist\/artworks\/[^/]+\/edit$/.test(path)) {
    return ["Edit Artwork", "Update your listing."];
  }

  return TITLES[path] || ["Artist Studio", ""];
}

export default function ArtistLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [title, subtitle] = titleFor(pathname);

  if (!user || user.role !== "artist") {
    return <Navigate to="/artist/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F9F8F6] text-[#362F26]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className="
            sticky
            top-0
            z-20
            flex
            min-h-[76px]
            items-center
            justify-between
            gap-5
            border-b
            border-[#E8E1DB]
            bg-[#FEFDFB]/95
            px-5
            py-3
            backdrop-blur-md
            sm:px-7
            lg:px-10
          "
        >
          {/* Page title */}
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="min-w-0"
          >
            <h1
              className="
                truncate
                font-serif
                text-[23px]
                font-medium
                leading-tight
                tracking-[-0.3px]
                text-[#362F26]
                sm:text-[26px]
                lg:text-[28px]
              "
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="
                  mt-0.5
                  truncate
                  text-[12px]
                  text-[#A28F7D]
                  sm:text-[13px]
                  lg:text-[14px]
                "
              >
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Profile area */}
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="
              group
              flex
              shrink-0
              cursor-pointer
              items-center
              gap-2.5
              rounded-[14px]
              border
              border-transparent
              px-2
              py-1.5
              text-left
              transition-all
              duration-200
              ease-out
              hover:border-[#E8DDD5]
              hover:bg-[#F9F3EE]
              hover:shadow-[0_4px_14px_rgba(65,43,31,0.05)]
              sm:gap-3
              sm:px-2.5
            "
          >
            {/* Avatar */}
            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                grid
                h-9
                w-9
                shrink-0
                place-items-center
                rounded-full
                border
                border-white
                bg-[linear-gradient(135deg,#D6C4AE_0%,#B99A78_100%)]
                text-[11px]
                font-semibold
                text-white
                shadow-[0_4px_10px_rgba(65,43,31,0.10)]
                sm:h-10
                sm:w-10
                sm:text-[13px]
              "
            >
              AM
            </motion.div>

            {/* User information */}
            <div className="hidden min-w-0 sm:block">
              <p
                className="
                  truncate
                  text-[13px]
                  font-medium
                  leading-tight
                  text-[#362F26]
                  transition-colors
                  duration-200
                  group-hover:text-[#9F5639]
                  lg:text-[14px]
                "
              >
                Aarav Mehta
              </p>

              <p className="mt-0.5 truncate text-[10.5px] text-[#A28F7D] lg:text-[12px]">
                Paintings artist
              </p>
            </div>
          </motion.button>
        </motion.header>

        {/* Page content */}
        <motion.main
          key={pathname}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className="min-w-0 flex-1"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}