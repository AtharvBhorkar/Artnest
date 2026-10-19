import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, X, ShoppingCart, CreditCard } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { IoMdBrush } from "react-icons/io";
import { IoCameraOutline, IoColorPaletteOutline } from "react-icons/io5";
import homeHeroVideo from "../../assets/home_hero_video.mp4";
import { PiCubeFocus, PiPaintBrushBroadFill } from "react-icons/pi";
import { FaArrowsToCircle, FaShieldHeart } from "react-icons/fa6";
import {
  MdTexture,
  MdOutlineDraw,
  MdOutlineLayers,
  MdOutlineVerified,
  MdArrowOutward,
  MdHandshake,
} from "react-icons/md";
import { LuTruck, LuHeadset } from "react-icons/lu";
import { TfiMedall } from "react-icons/tfi";
const MotionLink = motion(Link);

const mediums = [
  {
    name: "Painting",
    works: "1,420 works",
    icon: IoMdBrush,
    slug: "paintings",
  },
  {
    name: "Sculpture",
    works: "480 works",
    icon: PiCubeFocus,
    slug: "sculptures",
  },
  {
    name: "Ceramics",
    works: "610 works",
    icon: FaArrowsToCircle,
    slug: "ceramics",
  },
  {
    name: "Photography",
    works: "890 works",
    icon: IoCameraOutline,
    slug: "photography",
  },
  {
    name: "Textile",
    works: "340 works",
    icon: MdTexture,
    slug: "textile",
  },
  {
    name: "Digital Art",
    works: "520 works",
    icon: MdOutlineDraw,
    slug: "digital",
  },
  {
    name: "Mixed Media",
    works: "290 works",
    icon: MdOutlineLayers,
    slug: null,
  },
  {
    name: "Printmaking",
    works: "410 works",
    icon: PiPaintBrushBroadFill,
    slug: "printmaking",
  },
];

const PAINTINGS = [
  {
    title: "Radha-Krishna Under the Kadamba",
    artist: "Ananya Deshpande",
    medium: "Gouache & gold leaf on wasli paper",
    price: "\u20b968,000",
    img: "https://images.unsplash.com/photo-1719495851801-1caee1db2478?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Court of the Rajput Prince",
    artist: "Vikram Solanki",
    medium: "Miniature painting, natural pigments",
    price: "\u20b982,500",
    img: "https://images.unsplash.com/photo-1714250176002-f1945fb03c6f?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Woman Beneath the Mango Tree",
    artist: "Meera Iyer",
    medium: "Watercolor & ink on handmade paper",
    price: "\u20b924,000",
    img: "https://images.unsplash.com/photo-1714248376481-f3e37e023ec8?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Procession Through the Forest",
    artist: "Rohan Bhatt",
    medium: "Tempera on cotton canvas",
    price: "\u20b939,500",
    img: "https://images.unsplash.com/photo-1713986719526-8c44918a9688?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Peacock Garden",
    artist: "Kavita Rao",
    medium: "Gouache on wasli paper",
    price: "\u20b929,900",
    img: "https://images.unsplash.com/photo-1719498481691-d78f24dcff1b?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Letter From the Monsoon",
    artist: "Arjun Mehta",
    medium: "Watercolor on rag paper",
    price: "\u20b918,750",
    img: "https://images.unsplash.com/photo-1715627156647-8fc249b99b2a?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Village by the Riverbank",
    artist: "Sneha Kulkarni",
    medium: "Natural pigment on paper",
    price: "\u20b933,200",
    img: "https://images.unsplash.com/photo-1714248375969-a48cdc603a3f?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Woman in the Courtyard",
    artist: "Tanvi Joshi",
    medium: "Miniature painting, gouache on paper",
    price: "\u20b921,400",
    img: "https://images.unsplash.com/photo-1714248377458-1e87a445a57d?q=80&w=900&auto=format&fit=crop",
  },
];

const SCULPTURES = [
  {
    title: "Nataraja, Cosmic Dance",
    artist: "Muthu Sthapati",
    medium: "Lost-wax cast bronze",
    price: "\u20b91,45,000",
    img: "https://images.unsplash.com/photo-1775308637873-241642f89824?q=80&w=900&auto=format&fit=crop",

    images: [
      "https://images.unsplash.com/photo-1775308637873-241642f89824?q=80&w=900&auto=format&fit=crop",
      "https://commons.wikimedia.org/wiki/Special:FilePath/India%20meridionale%2C%20Shiva%20come%20Nataraja%20Re%20della%20Danza%2C%20in%20bronzo%2C%201200%20ca.%2002.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/India%20meridionale%2C%20Shiva%20come%20Nataraja%20Re%20della%20Danza%2C%20in%20bronzo%2C%201200%20ca.%2003%20demone%20nano%20(Apasmara%20o%20Muyalaka).jpg",
    ],
  },
  {
    title: "Nataraja, Temple Study",
    artist: "Ravi Achari",
    medium: "Panchaloha bronze",
    price: "\u20b91,68,000",
    img: "https://images.unsplash.com/photo-1780599865000-ee474a52b88c?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Devi Relief, Wall Panel",
    artist: "Lakshmi Varman",
    medium: "Hand-carved sandstone",
    price: "\u20b958,000",
    img: "https://images.unsplash.com/photo-1653455441061-6c21d3643eab?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Guardians of the Gopuram",
    artist: "Senthil Pillai",
    medium: "Carved granite, pair",
    price: "\u20b91,12,000",
    img: "https://images.unsplash.com/photo-1662218347087-6f298fbe368f?q=80&w=900&auto=format&fit=crop",
  },
];

const ARTISTS = [
  {
    name: "Ananya Deshpande",
    location: "Jaipur, Rajasthan",
    bio: "Works in gouache and gold leaf, continuing the Rajput and Mughal miniature tradition on wasli paper.",
    avatar: "https://picsum.photos/seed/ananya-deshpande/200/200",
    specialties: ["Gouache", "Gold leaf", "Wasli paper"],
    studioStory:
      "Ananya paints in a small Jaipur studio, layering natural pigments and gold leaf onto handmade wasli paper.",
    yearsPracticing: "12 years",
    materials: ["Natural pigments", "Gold leaf", "Wasli paper"],
    featuredWorks: ["Radha-Krishna Under the Kadamba", "Court of the Rajput Prince"],
    commissionsOpen: true,
  },
  {
    name: "Muthu Sthapati",
    location: "Swamimalai, Tamil Nadu",
    bio: "A fifth-generation bronze caster, using the lost-wax method passed down since the Chola period.",
    avatar: "https://picsum.photos/seed/muthu-sthapati/200/200",
    specialties: ["Lost-wax casting", "Bronze", "Chola tradition"],
    studioStory:
      "Muthu works in a traditional foundry filled with the earthy scent of beeswax and clay, pouring molten bronze into intricate handmade molds.",
    yearsPracticing: "25 years",
    materials: ["Bronze", "Beeswax", "River clay", "Panchaloham metal alloy"],
    featuredWorks: ["Chola-Style Nataraja", "Bronze Processional Ganesha"],
    commissionsOpen: true,
  },
  {
    name: "Meera Iyer",
    location: "Kochi, Kerala",
    bio: "Watercolor and ink work rooted in Kerala’s backwaters and monsoon light.",
    avatar: "https://picsum.photos/seed/meera-iyer/200/200",
    specialties: ["Watercolor", "Ink", "Kerala landscapes"],
    studioStory:
      "Meera's studio overlooks the breezy backwaters of Kochi, where large windows let in the shifting monsoon light that defines her palette.",
    yearsPracticing: "8 years",
    materials: ["Artist-grade watercolor", "Archival ink", "Cotton paper"],
    featuredWorks: ["Monsoon Over Vembanad", "Shadows of Fort Kochi"],
    commissionsOpen: false,
  },
  {
    name: "Vikram Solanki",
    location: "Udaipur, Rajasthan",
    bio: "Miniature painter working with natural pigments, trained in the Mewar school of court painting.",
    avatar: "https://picsum.photos/seed/vikram-solanki/200/200",
    specialties: ["Miniature painting", "Natural pigments", "Mewar school"],
    studioStory:
      "Working under natural daylight with fine squirrel-hair brushes, Vikram grinds precious stones and minerals into vibrant mineral colors in his heritage studio.",
    yearsPracticing: "15 years",
    materials: ["Ground mineral pigments", "Gold dust", "Wasli paper", "Squirrel-hair brushes"],
    featuredWorks: ["Procession of the Mewar Maharana", "Royal Hunt at Lake Pichola"],
    commissionsOpen: true,
  },
  {
    name: "Kavita Rao",
    location: "Chennai, Tamil Nadu",
    bio: "Gouache and botanical studies drawing on Tanjore-style detailing and gold leaf work.",
    avatar: "https://picsum.photos/seed/kavita-rao/200/200",
    specialties: ["Gouache", "Botanical studies", "Gold leaf"],
    studioStory:
      "Kavita's sunlit workspace is filled with botanical sketches and traditional embossing tools, blending ancient temple craft with meticulous floral studies.",
    yearsPracticing: "10 years",
    materials: ["Gouache", "24k Gold foil", "Embossing chalk", "Teakwood boards"],
    featuredWorks: ["Sacred Lotus Study", "Golden Flora of the Western Ghats"],
    commissionsOpen: true,
  },
  {
    name: "Senthil Pillai",
    location: "Mahabalipuram, Tamil Nadu",
    bio: "Stone carver working in granite and sandstone, from a family of temple sculptors near the shore temples.",
    avatar: "https://picsum.photos/seed/senthil-pillai/200/200",
    specialties: ["Granite", "Sandstone", "Temple sculpture"],
    studioStory:
      "The rhythmic sound of hammer and chisel echoes through Senthil's open-air courtyard studio as raw blocks of local stone transform into classical deities.",
    yearsPracticing: "20 years",
    materials: ["Black granite", "Local sandstone", "Iron chisels", "Silica sand for polishing"],
    featuredWorks: ["Guardian of the Shore", "Celestial Dancer in Granite"],
    commissionsOpen: false,
  },
];

const CURATED_ARTWORKS = [
  PAINTINGS[0],
  PAINTINGS[1],
  PAINTINGS[2],
  PAINTINGS[3],
  PAINTINGS[4],
  PAINTINGS[5],
  PAINTINGS[6],
  PAINTINGS[7],
  SCULPTURES[0],
  SCULPTURES[1],
];

function EyebrowLabel({ children }) {
  return (
    <motion.p
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.4,
      }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mb-3 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#984c30] sm:text-xs"
    >
      {children}
    </motion.p>
  );
}

function SectionHeading({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 1,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="font-serif text-[#201a17] text-[34px] sm:text-[40px] lg:text-[42px] leading-none font-normal"
    >
      {children}
    </motion.h2>
  );
}

function MediumCard({ medium, index }) {
  const ref = React.useRef(null);

  // Detect when the card enters the viewport.
  const isInView = useInView(ref, {
    once: true,
    amount: 0.25,
  });

  // Remembers that the card has already entered the viewport.
  // This stays true even when Home re-renders because of wishlist/modal state.
  const [hasEntered, setHasEntered] = React.useState(false);

  React.useEffect(() => {
    if (isInView) {
      setHasEntered(true);
    }
  }, [isInView]);

  const hiddenY = index % 2 === 0 ? -35 : 35;

  return (
    <MotionLink
      ref={ref}
      to={
        medium.slug
          ? `/discover?category=${medium.slug}`
          : "/discover"
      }

      /*
        We do NOT use `initial={{ opacity: 0 }}`
        because after a re-render we never want the card
        to go back to its hidden state.
      */
      initial={false}

      /*
        Before first viewport entry:
        opacity = 0
        y = starting position

        After first viewport entry:
        opacity = 1
        y = 0

        Once hasEntered becomes true, it never becomes false.
      */
      animate={{
        opacity: hasEntered ? 1 : 0,
        y: hasEntered ? 0 : hiddenY,
      }}

      transition={
        hasEntered
          ? {
              duration: 0.8,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }
          : {
              duration: 0,
            }
      }

      className="
        group
        relative
        isolate
        flex
        min-h-[145px]
        cursor-pointer
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[10px]
        border
        border-transparent
        bg-[radial-gradient(circle_at_90%_95%,rgba(255,255,255,0.88)_0%,transparent_48%),radial-gradient(circle_at_85%_75%,rgba(226,205,187,0.55)_0%,transparent_58%),linear-gradient(140deg,#ffffff_0%,#f8eadc_48%,#eee0d3_100%)]
        px-3
        py-5
        transition-[border-color,box-shadow,background-color]
        duration-500
        ease-out
        hover:-translate-y-5
        hover:border-[#984c30]
        hover:shadow-[0_10px_25px_rgba(248,234,220,0.8)]
        sm:min-h-[160px]
        sm:px-4
        sm:py-6
        md:min-h-[170px]
        lg:min-h-[180px]
        xl:min-h-[190px]
      "
    >
      {/* White Top → Bottom Hover Overlay */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          origin-top
          scale-y-0
          bg-white
          transition-transform
          duration-500
          ease-out
          group-hover:scale-y-100
        "
      />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Icon Box */}
        <div
          className="
            flex
            h-[54px]
            w-[54px]
            items-center
            justify-center
            rounded-[16px]
            bg-white
            text-[#984c30]
            shadow-[0_2px_5px_rgba(80,50,30,0.08)]
            transition-all
            duration-300
            ease-out
            group-hover:scale-105
            group-hover:shadow-[0_0_25px_rgba(248,234,220,0.8)]
            group-hover:border
            group-hover:border-[#984c30]
            sm:h-[58px]
            sm:w-[58px]
            sm:rounded-[17px]
          "
        >
          <span
            className={`
              relative
              z-10
              inline-block
              transform-gpu
              transition-transform
              duration-300
              ease-out
              group-hover:scale-110
              ${
                medium.name === "Textile"
                  ? "text-[17px] font-semibold tracking-[-2px]"
                  : "text-[25px] sm:text-[26px]"
              }
            `}
          >
            <medium.icon />
          </span>
        </div>

        {/* Medium Name */}
        <h3
          className="
            mt-4
            text-center
            text-[16px]
            font-medium
            leading-tight
            text-[#171310]
            transition-colors
            duration-300
            sm:text-[18px]
            md:text-[19px]
          "
        >
          {medium.name}
        </h3>

        {/* Number of Works */}
        <p
          className="
            mt-3
            text-center
            text-[12px]
            font-medium
            tracking-[0.3px]
            text-[#765e51]
            transition-colors
            duration-300
            sm:mt-4
            sm:text-[13px]
            md:text-[14px]
          "
        >
          {medium.works}
        </p>

      </div>
    </MotionLink>
  );
}

function WishlistButton({ isWishlisted, onToggle }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`
        absolute
        right-3
        top-3
        z-20
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        bg-white
        shadow-sm
        transition-transform
        duration-300
        ease-out
        hover:scale-105
        ${isWishlisted
          ? "text-[#d64545]"
          : "text-black"
        }
      `}
    >
      <Heart
        size={17}
        strokeWidth={2}
        className={
          isWishlisted
            ? "text-[#d64545]"
            : "text-black"
        }
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>
  );
}

function ArtworkCard({
  work,
  index,
  onSelect,
  onAddToWishlist,
  isWishlisted,
}) {
  return (
    <motion.article
      onClick={() => onSelect(work)}

      initial={{
        opacity: 0,
        y: 35,
        scale: 0.97,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}

      viewport={{
        once: true,
        amount: 0.2,
      }}

      transition={{
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}

      whileHover={{
        y: -5,
        transition: {
          type: "spring",
          stiffness: 320,
          damping: 24,
        },
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(work);
        }
      }}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-[12px]
        bg-white
        shadow-[0_6px_18px_rgba(80,50,30,0.06)]
        transition-shadow
        duration-300
        hover:shadow-[0_12px_28px_rgba(80,50,30,0.12)]
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#a65335]
      "
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8eadc]">
        <img
          src={work.img}
          alt={work.title}
          className="
      h-full
      w-full
      object-cover
      transition-all
      duration-700
      ease-out
      group-hover:scale-[1.05]
    "
        />

        {/* Wishlist */}
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={() => onAddToWishlist(work)}
        />
      </div>

      {/* Details */}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[18px] leading-[1.15] text-[#201a17] sm:text-[19px]">
            {work.title}
          </h3>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f1e4d8] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.4px] text-[#875039]">
            <MdOutlineVerified className="text-[11px]" />
            Verified
          </span>
        </div>

        <p className="mt-2 text-[12px] leading-[1.5] text-[#765e51] sm:text-[13px]">
          {work.artist}
        </p>

        <p className="mt-1 text-[12px] leading-[1.5] text-[#8a7569] sm:text-[13px]">
          {work.medium}
        </p>

        <p className="mt-3 text-[15px] font-semibold text-[#29221e]">
          {work.price}
        </p>
      </div>
    </motion.article>
  );
}

function ViewAllArtistsButton() {
  const ref = React.useRef(null);

  // Detect when the button enters the viewport.
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });

  // Once true, it stays true for the lifetime of this page visit.
  const [hasEntered, setHasEntered] = React.useState(false);

  React.useEffect(() => {
    if (isInView) {
      setHasEntered(true);
    }
  }, [isInView]);

  return (
    <MotionLink
      ref={ref}
      to="/artists"

      /*
        Do not use an initial hidden state.
        We control the hidden/visible state ourselves.
      */
      initial={false}

      animate={{
        opacity: hasEntered ? 1 : 0,
        y: hasEntered ? 0 : 20,
      }}

      transition={
        hasEntered
          ? {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }
          : {
              duration: 0,
            }
      }

      whileHover={{
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 20,
        },
      }}

      whileTap={{ scale: 0.97 }}

      className="
        inline-flex
        min-h-11
        items-center
        justify-center
        rounded-[8px]
        border
        border-[#a65335]
        px-6
        py-2.5
        text-[13px]
        font-semibold
        text-[#a65335]
        transition-colors
        duration-300
        hover:bg-[#a65335]
        hover:text-white
      "
    >
      View all artists
    </MotionLink>
  );
}


function ArtistCard({ artist, onSelect, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col rounded-[10px] border border-[#ead8ca] bg-[radial-gradient(circle_at_8%_50%,rgba(255,232,214,0.4)_0%,transparent_40%),radial-gradient(circle_at_92%_50%,rgba(255,232,214,0.4)_0%,transparent_40%),linear-gradient(90deg,#fffaf5_0%,#ffffff_20%,#ffffff_80%,#fffaf5_100%)] p-5 transition-shadow duration-300 hover:shadow-[0_14px_30px_rgba(80,50,30,0.13)] sm:p-6"
    >
      <div className="flex items-center gap-4">
        <img
          src={artist.avatar}
          alt={artist.name}
          className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white transition-transform duration-300 group-hover:scale-105 sm:h-[72px] sm:w-[72px]"
        />
        <div className="min-w-0">
          <h3 className="font-serif text-[20px] leading-tight text-[#201a17]">
            {artist.name}
          </h3>
          <p className="mt-1 text-[13px] text-[#765e51]">{artist.location}</p>
        </div>
      </div>

      <p className="mt-5 flex-1 text-[14px] leading-[1.6] text-[#665650]">
        {artist.bio}
      </p>

      <motion.button
        type="button"
        onClick={onSelect}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.97 }}
        aria-haspopup="dialog"
        className="mt-5 self-start border-b border-[#a65335]/50 pb-1 text-[13px] font-semibold text-[#a65335] transition-colors hover:border-[#8f462c] hover:text-[#8f462c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a65335]"
      >
        View studio <span aria-hidden="true">→</span>
      </motion.button>
    </motion.article>
  );
}


function CuratedArtworkCard({ work, index, onSelect, onAddToWishlist, isWishlisted }) {
  return (
    <motion.div
      onClick={() => onSelect(work)}
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.94,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.75,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative h-full cursor-pointer overflow-hidden rounded-[12px] bg-[#eaded5]"
    >
      {/* Artwork */}
      <img
        src={work.img}
        alt={work.title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,13,9,0.85)] via-[rgba(20,13,9,0.18)] to-transparent" />

      {/* Wishlist */}
      <WishlistButton
        isWishlisted={isWishlisted}
        onToggle={() => onAddToWishlist(work)}
      />

      {/* Artwork details */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.8px] text-white">
          {work.medium}
        </p>

        <h3 className="font-serif text-[21px] leading-[1.1] text-white">
          {work.title}
        </h3>

        <p className="mt-1 text-[12px] text-white">
          {work.artist}
        </p>

        <p className="mt-1 text-[13px] font-medium text-white">
          {work.price}
        </p>
      </div>
    </motion.div>
  );
}


function ArtworkDetailModal({
  work,
  onClose,
  onAddToWishlist,
  isWishlisted,
  onAddToCart,
}) {

  const [activeImage, setActiveImage] = useState(
    work.images?.[0] || work.img
  );


  const isInCart = JSON.parse(
    localStorage.getItem("artnest-cart") || "[]"
  ).some((item) => item.title === work.title);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-3
        backdrop-blur-sm
        sm:p-5
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-detail-title"
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-[900px]
          overflow-hidden
          rounded-[16px]
          border
          border-[#ead8ca]
          bg-white
          shadow-[0_25px_60px_rgba(20,13,9,0.20)]
        "
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close artwork details"
          className="
            group
            absolute
            right-4
            top-4
            z-30
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-[#ead8ca]
            bg-white
            text-[#4a3429]
            transition-all
            duration-300
            hover:border-[#a65335]
            hover:bg-[#a65335]
            hover:text-white
            hover:scale-105
          "
        >
          <span className="flex h-5 w-5 items-center justify-center transform-gpu transition-transform duration-300 group-hover:rotate-90">
            <X size={20} strokeWidth={2} />
          </span>
        </button>

        {/* Scrollable Content */}
        <div
          className="
            max-h-[92vh]
            overflow-y-auto
            [scrollbar-width:thin]
            [scrollbar-color:#c98a6e_transparent]
            [&::-webkit-scrollbar]:w-[5px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#c98a6e]
            [&::-webkit-scrollbar-thumb:hover]:bg-[#a65335]
          "
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Product Image + Thumbnails */}
            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#edd7cc_50%,#ffffff_100%)] p-4 sm:p-6 lg:p-7">

              {/* Main Image */}
              <div className="overflow-hidden rounded-[10px]">
                <img
                  src={activeImage}
                  alt={work.title}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="mt-10 grid grid-cols-3 gap-5">
                {(work.images || [work.img]).slice(0, 3).map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`
          overflow-hidden
          rounded-[8px]
          border
          bg-white
          transition-transform
          duration-200
          hover:scale-[1.03]
          ${activeImage === image
                        ? "border-2 border-[#a65335]"
                        : "border-[#ead8ca]"
                      }
        `}
                  >
                    <img
                      src={image}
                      alt={`${work.title} view ${index + 1}`}
                      className="h-[75px] w-full object-cover"
                    />
                  </button>
                ))}
              </div>

            </div>



            {/* Product Information */}
            <div className="p-5 sm:p-7 lg:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#984c30] sm:text-[11px]">
                Original Artwork
              </p>

              <h2
                id="artwork-detail-title"
                className="mt-2 pr-10 font-serif text-[27px] leading-[1.08] text-[#201a17] sm:text-[32px]"
              >
                {work.title}
              </h2>

              <p className="mt-2 text-[13px] text-[#765e51]">
                by {work.artist}
              </p>

              <div className="mt-5 border-y border-[#eee8e3] py-5">
                <p className="text-[22px] font-semibold text-[#29221e]">
                  {work.price}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <MdOutlineVerified className="text-[18px] text-[#a65335]" />
                  <span className="text-[12px] font-medium text-[#665650]">
                    Verified artwork
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                    Medium
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-[#665650]">
                    {work.medium}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                    About this work
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.7] text-[#665650]">
                    An original artwork by {work.artist}, created using{" "}
                    {work.medium.toLowerCase()}.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 space-y-3">
                <motion.button
                  type="button"
                  onClick={() => onAddToCart(work)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[8px]
                    bg-[#a65335]
                    px-5
                    py-3
                    text-[14px]
                    font-semibold
                    text-white
                    transition-colors
                    duration-300
                    hover:bg-[#8f462c]
                  "
                >
                  <ShoppingCart size={17} strokeWidth={2} />
{isInCart ? "Added to cart" : "Add to cart"}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(
                      "artnest-buy-now",
                      JSON.stringify(work)
                    );
                    window.location.href = "/checkout";
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[8px]
                    border
                    border-[#a65335]
                    bg-transparent
                    px-5
                    py-3
                    text-[14px]
                    font-semibold
                    text-[#a65335]
                    transition-colors
    duration-300
    hover:bg-[#fff4eb]
                  "
                >
                  <CreditCard size={17} strokeWidth={2} />
                  Buy now
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => onAddToWishlist(work)}
                  whileHover={{ scale: 1.03 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[8px]
                    px-5
                    py-3
                    text-[13px]
                    font-semibold
                    text-[#4a3429]
                    transition-colors
                    duration-300
                    hover:bg-[#fff4eb]
                  "
                >
                  <Heart
                    size={18}
                    strokeWidth={1.8}
                    fill={isWishlisted ? "currentColor" : "none"}
                    className={
                      isWishlisted
                        ? "text-[#d64545]"
                        : "text-[#4a3429]"
                    }
                  />
                  {isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const Home = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("artnest-wishlist")) || [];
  });

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("artnest-cart")) || [];
  });

  const addToWishlist = (work) => {
    setWishlist((currentWishlist) => {

      const alreadyExists = currentWishlist.some(
        (item) => item.title === work.title
      );

      const updatedWishlist = alreadyExists
        ? currentWishlist.filter(
          (item) => item.title !== work.title
        )
        : [...currentWishlist, work];

      localStorage.setItem(
        "artnest-wishlist",
        JSON.stringify(updatedWishlist)
      );

      return updatedWishlist;
    });
  };

  const addToCart = (work) => {
    setCart((currentCart) => {
      const alreadyExists = currentCart.some(
        (item) => item.title === work.title
      );

      if (alreadyExists) {
        return currentCart;
      }

      const updatedCart = [...currentCart, work];

      localStorage.setItem(
        "artnest-cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  useEffect(() => {
    if (!selectedArtist && !selectedWork) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [selectedArtist, selectedWork]);

  return (
    <div>
      <section className="relative isolate w-full overflow-hidden bg-[#1c1712]">

        {/* Background Video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={homeHeroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />


        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-[1450px] items-center justify-center px-4 py-16 text-center sm:min-h-[650px] sm:px-6 sm:py-20 lg:min-h-[650px] lg:px-[70px] lg:py-[68px]">

          <div className="w-full max-w-[900px]">


            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-5 inline-flex items-center gap-[9px] rounded-full  text-[10px] font-semibold tracking-[0.5px] text-white"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#a65335]" />
              CURATED GLOBAL MARKETPLACE
            </motion.div>


            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-5 font-serif text-[clamp(34px,7vw,68px)] font-normal leading-[1.04] text-white sm:leading-[0.99]"
            >
              A marketplace for{" "}
              <em className="font-normal italic text-[#f0b39a]">
                original
              </em>
              <br className="hidden sm:block" />{" "}
              <em className="font-normal italic text-[#f0b39a]">
                art
              </em>
              , sculptures &amp;
              <br className="hidden sm:block" /> handmade creations
            </motion.h1>


            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.75,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto max-w-[610px] text-[14px] leading-[1.65] text-white/90 sm:text-[16px]"
            >
              Connect directly with independent creators worldwide.
              Acquire museum-grade paintings, studio ceramics, and
              bespoke commissions with verified authenticity.
            </motion.p>


            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-[30px]"
            >

              {/* Explore Art */}
              <MotionLink
                to="/discover"
                whileHover={{ scale: 1.06 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="group flex h-[43px] w-full max-w-[230px] items-center justify-center gap-[10px] rounded-[10px] border border-[#a65335] bg-[#a65335] px-[22px] text-[15px] font-semibold text-white transition-colors duration-300 sm:w-auto"
              >
                Explore Art
                <span className="inline-block text-[18px] transition-transform duration-300 group-hover:translate-x-1.5 group-hover:rotate-[45deg]">
                  <MdArrowOutward />
                </span>
              </MotionLink>


              {/* Meet the Artists */}
              <MotionLink
                to="/artists"
                whileHover={{ scale: 1.06 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="flex h-[43px] w-full max-w-[230px] items-center justify-center gap-[10px] border-none rounded-[10px] bg-[#f0b39a] px-[22px] text-[15px] font-semibold text-[#1c1712] transition-colors duration-300 hover:bg-[#f0b39a] hover:text-[#1c1712] sm:w-auto"
              >
                Meet the Artists
                <span className="text-[18px]">
                  <IoColorPaletteOutline />
                </span>
              </MotionLink>

            </motion.div>


            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-[18px] gap-y-3 text-[12px] text-white/90 sm:gap-x-[20px] sm:text-[13px]"
            >

              <div className="flex items-center gap-[7px] whitespace-nowrap ">
                <TfiMedall className="text-[17px] text-[#f0b39a]" />
                100% Original Work
              </div>

              <div className="flex items-center gap-[7px] whitespace-nowrap ">
                <MdHandshake className="text-[17px] text-[#f0b39a]" />
                Direct From Artists
              </div>

              <div className="flex items-center gap-[7px] whitespace-nowrap ">
                <FaShieldHeart className="text-[17px] text-[#f0b39a]" />
                Worldwide Insured Delivery
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-14 md:px-8 lg:px-[5%] lg:py-16">
        <div className="mx-auto max-w-[1600px]">

          {/* Section Header */}
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:mb-10">
            <div>
              <EyebrowLabel>Department Index</EyebrowLabel>

              <SectionHeading>
                Explore by Medium
              </SectionHeading>
            </div>
          </div>

          {/* Medium Cards */}
          <div
            className="
        grid
        grid-cols-2
        gap-3

        sm:grid-cols-3
        sm:gap-4

        md:grid-cols-4

        lg:grid-cols-4

        xl:grid-cols-8
      "
          >
            
          {mediums.map((medium, index) => (
  <MediumCard
    key={medium.name}
    medium={medium}
    index={index}
  />
))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[linear-gradient(180deg,#ffffff_0%,#edd7cc_50%,#ffffff_100%)] px-5 sm:px-8 lg:px-[5%] py-12 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#eee8e3] pb-6 sm:mb-10">
            <div>
              <EyebrowLabel>Painting Collection</EyebrowLabel>
              <SectionHeading>
                This week&apos;s exhibition
              </SectionHeading>
            </div>
            <MotionLink
              to="/discover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="shrink-0 border-b border-[#a65335]/40 pb-0.5 text-[13px] font-semibold text-[#a65335] transition-colors duration-300 hover:border-[#8f462c] hover:text-[#8f462c]"
            >
              View all paintings
            </MotionLink>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PAINTINGS.map((work, index) => (
              <ArtworkCard
                key={work.title}
                work={work}
                index={index}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === work.title
                )}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[linear-gradient(180deg,#ffffff_0%,#edd7cc_50%,#ffffff_100%)] px-5 sm:px-8 lg:px-[5%] py-12 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#eee8e3] pb-6 sm:mb-10">
            <div>
              <EyebrowLabel>Featured Sculptures</EyebrowLabel>
              <SectionHeading>
                Form, cast and carved
              </SectionHeading>
            </div>
            <MotionLink
              to="/discover?category=sculptures"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="shrink-0 border-b border-[#a65335]/40 pb-0.5 text-[13px] font-semibold text-[#a65335] transition-colors duration-300 hover:border-[#8f462c] hover:text-[#8f462c]"
            >
              View all sculptures
            </MotionLink>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SCULPTURES.map((work, index) => (
              <ArtworkCard
                key={work.title}
                work={work}
                index={index}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === work.title
                )}
              />
            ))}
          </div>
        </div>
      </section>


      <section className="w-full  px-4 py-12 sm:px-6 sm:py-14 md:px-8 lg:px-[5%] lg:py-16">
        <div className="mx-auto max-w-[1600px]">
          <EyebrowLabel>Artist Spotlight</EyebrowLabel>
          <SectionHeading>
            The studios behind this season&apos;s work
          </SectionHeading>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {ARTISTS.map((artist, index) => (
              <ArtistCard
                key={artist.name}
                artist={artist}
                index={index}
                onSelect={() => setSelectedArtist(artist)}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <ViewAllArtistsButton />
          </div>
        </div>
      </section>

      {selectedArtist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          onClick={() => setSelectedArtist(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="artist-studio-title"
            className="
        relative
        w-full
        max-w-[560px]
        overflow-hidden
        rounded-[15px]
        border
        border-[#ead8ca]
        bg-[radial-gradient(circle_at_8%_50%,rgba(255,232,214,0.4)_0%,transparent_40%),radial-gradient(circle_at_92%_50%,rgba(255,232,214,0.4)_0%,transparent_40%),linear-gradient(90deg,#fffaf5_0%,#ffffff_20%,#ffffff_80%,#fffaf5_100%)]
        shadow-[0_25px_60px_rgba(20,13,9,0.20)]
      "
          >
            {/* Fixed Close Button */}
            <button
              type="button"
              onClick={() => setSelectedArtist(null)}
              aria-label="Close artist studio"
              className="
          group
          absolute
          right-6
          top-4
          z-30
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-[#ead8ca]
          bg-white
          text-[#4a3429]
          transition-all
          duration-300
          ease-out
          hover:border-[#a65335]
          hover:bg-[#a65335]
          hover:text-white
          hover:scale-105
        "
            >
              <span
                className="
    flex
    h-5
    w-5
    items-center
    justify-center
    transform-gpu
    origin-center
    transition-transform
    duration-300
    ease-out
    group-hover:rotate-90
  "
              >
                <X size={20} strokeWidth={2} />
              </span>
            </button>

            {/* Scrollable Modal Content */}
            <div
              className="
    max-h-[90vh]
    overflow-y-auto
    px-5
    pb-7
    pt-6
    [scrollbar-width:thin]
    [scrollbar-color:#c98a6e_transparent]
    [&::-webkit-scrollbar]:w-[5px]
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-[#c98a6e]
    [&::-webkit-scrollbar-thumb:hover]:bg-[#a65335]

    sm:px-8
    sm:pb-9
    sm:pt-8
  "
            >

              {/* Artist Header */}
              <div className="flex items-start gap-4 pr-12">
                <img
                  src={selectedArtist.avatar}
                  alt=""
                  className="
              h-16
              w-16
              shrink-0
              rounded-full
              object-cover
              ring-2
              ring-white
              sm:h-20
              sm:w-20
            "
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#984c30] sm:text-[11px]">
                    Artist studio
                  </p>

                  <h2
                    id="artist-studio-title"
                    className="mt-1 font-serif text-[24px] leading-tight text-[#201a17] sm:text-[30px]"
                  >
                    {selectedArtist.name}
                  </h2>

                  <p className="mt-1 text-[13px] text-[#765e51]">
                    {selectedArtist.location}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-6 border-t border-[#ead8ca]" />

              {/* About */}
              <div className="mt-6">
                <h3 className="font-serif text-[19px] text-[#201a17] sm:text-[20px]">
                  About the studio
                </h3>

                <p className="mt-3 text-[13px] leading-[1.7] text-[#665650] sm:text-[14px]">
                  {selectedArtist.studioStory || selectedArtist.bio}
                </p>
              </div>

              {/* Practice + Commissions */}
              {(selectedArtist.yearsPracticing ||
                selectedArtist.commissionsOpen !== undefined) && (
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selectedArtist.yearsPracticing && (
                      <div className="rounded-[10px] border border-[#a65335] bg-white/75 p-4 shadow-[0_4px_12px_rgba(80,50,30,0.05)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                          Practice
                        </p>

                        <p className="mt-1.5 text-[14px] text-[#201a17]">
                          {selectedArtist.yearsPracticing}
                        </p>
                      </div>
                    )}

                    {selectedArtist.commissionsOpen !== undefined && (
                      <div className="rounded-[10px] border border-[#a65335] bg-white/75 p-4 shadow-[0_4px_12px_rgba(80,50,30,0.05)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                          Commissions
                        </p>

                        <p className="mt-1.5 text-[14px] text-[#201a17]">
                          {selectedArtist.commissionsOpen
                            ? "Open for commissions"
                            : "Not taking commissions"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {/* Specialties */}
              {selectedArtist.specialties?.length > 0 && (
                <div className="mt-7">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                    Specialties
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedArtist.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="border border-[#a65335] rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-[#665650] shadow-[0_2px_6px_rgba(80,50,30,0.04)]"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {selectedArtist.materials?.length > 0 && (
                <div className="mt-7">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                    Materials
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedArtist.materials.map((material) => (
                      <span
                        key={material}
                        className="border border-[#a65335] rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-[#665650] shadow-[0_2px_6px_rgba(80,50,30,0.04)]"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Works */}
              {selectedArtist.featuredWorks?.length > 0 && (
                <div className="mt-7">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[#984c30]">
                    Selected works
                  </h4>

                  <ul className="mt-3 space-y-2">
                    {selectedArtist.featuredWorks.map((work) => (
                      <li
                        key={work}
                        className="border border-[#a65335] rounded-[8px] bg-white/75 px-4 py-3 text-[13px] text-[#665650] shadow-[0_2px_6px_rgba(80,50,30,0.04)]"
                      >
                        {work}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explore Artist Directory */}
              <div className="mt-8 pt-1">
                <MotionLink
                  to="/artists"
                  onClick={() => setSelectedArtist(null)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="
              inline-flex
              min-h-[44px]
              items-center
              justify-center
              rounded-[8px]
              bg-[#a65335]
              px-5
              py-2.5
              text-[13px]
              font-semibold
              text-white
              transition-colors
              duration-300
              ease-out
              hover:bg-[#8f462c]
            "
                >
                  Explore artist directory
                </MotionLink>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedWork && (
        <ArtworkDetailModal
        key={selectedWork.title}
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
          onAddToWishlist={addToWishlist}
          isWishlisted={wishlist.some(
            (item) => item.title === selectedWork.title
          )}
          onAddToCart={addToCart}
        />
      )}

      {/* =========================================================
    CURATED COLLECTION
========================================================= */}

      <section className="w-full bg-[linear-gradient(180deg,#ffffff_0%,#edd7cc_50%,#ffffff_100%)] px-5 py-16 pb-20 sm:px-8 sm:py-16 sm:pb-24 lg:px-[5%] lg:py-20 lg:pb-28">

        <div className="mx-auto max-w-[1600px]">

          {/* Heading */}
          <div className="mb-10 flex flex-col gap-5 border-b border-[#e8ddd5] pb-6 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <EyebrowLabel>
                CURATED COLLECTION
              </EyebrowLabel>

              <SectionHeading>
                Art worth making room for
              </SectionHeading>
            </div>

          </div>


          {/* Bento Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:[grid-auto-rows:150px]">

            {/* Card 1 */}
            <div className="h-[400px] sm:h-auto lg:col-span-1 lg:row-span-3">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[0]}
                index={0}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[0].title
                )}
              />
            </div>


            {/* Card 2 */}
            <div className="h-[260px] sm:h-auto lg:col-span-1 lg:row-span-1">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[1]}
                index={1}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[1].title
                )}
              />
            </div>


            {/* Card 3 */}
            <div className="h-[260px] sm:h-auto lg:col-span-1 lg:row-span-1">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[2]}
                index={2}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[2].title
                )}
              />
            </div>


            {/* Card 4 */}
            <div className="h-[400px] sm:h-auto lg:col-span-1 lg:row-span-2">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[3]}
                index={3}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[3].title
                )}
              />
            </div>


            {/* Card 5 */}
            <div className="h-[260px] sm:h-auto lg:col-span-1 lg:row-span-1">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[4]}
                index={4}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[4].title
                )}
              />
            </div>


            {/* Card 6 */}
            <div className="h-[400px] sm:h-auto lg:col-span-1 lg:row-span-2">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[5]}
                index={5}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[5].title
                )}
              />
            </div>


            {/* Card 7 */}
            <div className="h-[260px] sm:h-auto lg:col-span-1 lg:row-span-1">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[6]}
                index={6}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[6].title
                )}
              />
            </div>


            {/* Card 8 */}
            <div className="h-[260px] sm:h-auto lg:col-span-1 lg:row-span-1">
              <CuratedArtworkCard
                work={CURATED_ARTWORKS[7]}
                index={7}
                onSelect={setSelectedWork}
                onAddToWishlist={addToWishlist}
                isWishlisted={wishlist.some(
                  (item) => item.title === CURATED_ARTWORKS[7].title
                )}
              />
            </div>



          </div>

        </div>

      </section>

      <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-14">
        <div
          className="
  mx-auto
  grid
  max-w-[1600px]
  grid-cols-1
  gap-5

  sm:gap-6

  md:grid-cols-3
  md:gap-5

  lg:gap-6
"
        >
          {[
            {
              title: "Authenticity guaranteed",
              body: "Every work is verified and issued a provenance certificate before it ships.",
              icon: MdOutlineVerified,
            },
            {
              title: "White-glove shipping",
              body: "Climate-aware packing and tracked delivery, insured door to door.",
              icon: LuTruck,
            },
            {
              title: "Collector concierge",
              body: "Talk to our team about a piece, a commission, or building a collection.",
              icon: LuHeadset,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`
          group
rounded-[20px]
border
border-[#e6ded8]
bg-[#fff8f3]
px-6
py-8
shadow-[0_8px_20px_rgba(65,43,31,0.05)]
transition-all
duration-300
ease-out
hover:-translate-y-1
hover:border-[#984c30]
hover:bg-white
hover:shadow-[0_12px_26px_rgba(65,43,31,0.08)]

          sm:px-6
          sm:py-8

          md:px-7
          md:py-9
        `}
            >
              {/* Icon */}
              <span
                className="
            inline-flex
            text-[22px]
            text-[#a65335]
            transition-transform
            duration-300
            ease-out
            group-hover:scale-110
          "
              >
                <item.icon />
              </span>

              {/* Title */}
              <h3
                className="
            mt-3
            font-serif
            text-[18px]
            leading-[1.15]
            text-[#201a17]

            sm:text-[19px]
          "
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="
            mt-2
            max-w-[390px]
            text-[13px]
            leading-[1.6]
            text-[#665650]

            sm:text-[14px]
          "
              >
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-[5%] lg:py-16">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-[10px] border border-[#e6ded8] bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.95)_0%,transparent_55%),radial-gradient(circle_at_78%_82%,rgba(255,214,170,0.6)_0%,transparent_60%),linear-gradient(145deg,#fff4eb_0%,#ffffff_100%)] px-5 py-12 text-center shadow-[0_15px_30px_rgba(65,43,31,0.08)] sm:px-8 sm:py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 xl:px-20 xl:py-[88px]"
          >
            {/* Label */}
            <EyebrowLabel
            >
              Join ArtNest
            </EyebrowLabel>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-4 max-w-[850px] font-serif text-[28px] leading-[1.08] text-[#201a17] sm:text-[34px] md:text-[38px] lg:text-[42px] xl:text-[44px]"
            >
              Start a collection, one piece at a time.
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-4 max-w-[520px] text-[13px] leading-[1.6] text-[#665650] sm:text-[14px] md:mt-5 md:text-[15px]"
            >
              Create a free account to save favorites, follow artists, and get
              early access to new exhibitions.
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 sm:mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="inline-block"
              >
                <Link
                  to="/buyer/register"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#a65335] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-400 ease-out hover:bg-[#8f462c] sm:px-7 sm:text-[15px]"
                >
                  Create your account
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;