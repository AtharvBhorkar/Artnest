import React, { useState, useMemo, useEffect, useRef } from "react";
import meetingVideo from "../../assets/meeting.mp4";



const ARTIST_LOGIN_PATH = "/artist-login";
const DISCOVER_PATH = "/discover";


const STICKY_TOP = 80;

const HEADING = "font-serif";

const SPOTLIGHT_ID = "elora-vance";

const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");


const unsplash = (id, w) =>
  id.startsWith("/") || id.startsWith("http")
    ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;


const RAW = [
  {
    name: "Elora Vance",
    craft: "Pottery",
    medium: "Sculptural stoneware & terracotta",
    location: "Provence, FR",
    since: 2009,
    bio: "Elora throws and hand-builds vessels from local Provençal clay, then finishes each one with ash glazes she mixes herself.",
    quote:
      "A pot should feel like it has been in your hands for years before you ever hold it.",
    portrait: "1544005313-94ddf0286df2",
    works: [
      "1610701596007-11502861dcfa",
      "1565193566173-7a0ee3dbe261",
      "1578749556568-bc2c40e68b61",
    ],
  },
  {
    name: "Mateo Rossi",
    craft: "Painting",
    medium: "Abstract expressionist oils",
    location: "Florence, IT",
    since: 2005,
    bio: "Trained in Florence, Mateo builds thick layers of oil with palette knives, chasing the moment a canvas stops being a plan and becomes a place.",
    quote: "I stop when the painting starts arguing back.",
    portrait: "1507003211169-0a1dd7228f2d",
    works: [
      "1541701494587-cb58502866ab",
      "1561214115-f2f134cc4912",
      "1578926375605-eaf7559b1458",
    ],
  },
  {
    name: "Sylvan Zhou",
    craft: "Sculpture",
    medium: "Architectural wood & bronze",
    location: "Kyoto, JP",
    since: 2012,
    bio: "Sylvan joins Japanese woodworking with cast bronze, making forms that fit together without a single screw.",
    quote: "Wood remembers how it grew. I only listen.",
    portrait: "1500648767791-00dcc994a43e",
    works: ["1549490349-8643362247b5", "1513519245088-0e12902e5a38", "1582561424760-0321d75e81fa"],
  },
  {
    name: "Clara Miró",
    craft: "Painting",
    medium: "Oil painting",
    location: "Barcelona, Spain",
    since: 2010,
    bio: "Clara paints Mediterranean light in warm, glazed layers that take weeks to dry and a moment to fall in love with.",
    quote: "Light is the one subject I have never finished.",
    portrait: "1438761681033-6461ffad8d80",
    
    works: [
      "1561214115-f2f134cc4912",
      "1578926375605-eaf7559b1458",
      "1541701494587-cb58502866ab",
    ],
  },
  {
    name: "Alejandro Cruz",
    craft: "Pottery",
    medium: "Ceramics",
    location: "Oaxaca, Mexico",
    since: 2007,
    bio: "Working with Oaxacan black clay, Alejandro keeps a centuries-old burnishing technique alive in modern forms.",
    quote: "My grandmother taught my hands. The clay does the rest.",
    portrait: "1519085360753-af0119f7cbe7",
    works: [
      "1610701596007-11502861dcfa",
      "1578749556568-bc2c40e68b61",
      "1513519245088-0e12902e5a38",
    ],
  },
  {
    name: "Hannah Berg",
    craft: "Sculpture",
    medium: "Marble & bronze",
    location: "Portland, USA",
    since: 2011,
    bio: "Hannah carves marble and casts bronze, balancing weight and lightness in figures that seem about to move.",
    quote: "Stone is patient. I try to be.",
    portrait: "1573496359142-b8d87734a5a2",
    works: [
      "1515569067071-ec3b4a3c3a4d",
      "1549490349-8643362247b5",
      "1577083552431-6e5fd01aa342",
    ],
  },
  {
    name: "Linus Aaberg",
    craft: "Printmaking",
    medium: "Fine art prints",
    location: "Copenhagen, DK",
    since: 2014,
    bio: "Linus pulls every print by hand on a century-old press, so each edition carries small, honest differences.",
    quote: "No two impressions are the same, and that is the point.",
    portrait: "1506794778202-cad84cf45f1d",
    works: [
      "1460661419201-fd4cecdf8a8b",
      "1501004318641-b39e6451bec6",
      "1549887534-1541e9326642",
    ],
  },
  {
    name: "Amina Diallo",
    craft: "Weaving",
    medium: "Textile & fiber",
    location: "Dakar, Senegal",
    since: 2008,
    bio: "Amina weaves hand-dyed cotton and indigo on a wooden loom, carrying Senegalese patterns into contemporary wall pieces.",
    quote: "Every thread is a sentence. The cloth is the story.",
    portrait: "1534528741775-53994a69daeb",
    works: [
      "1600585154340-be6161a56a0c",
      "1544816155-12df9643f363",
      "1584551246679-0daf3d275d0f",
    ],
  },
  {
    name: "Julien Moreau",
    craft: "Painting",
    medium: "Oil painting",
    location: "Normandy, France",
    since: 2006,
    bio: "Julien paints the Normandy coast outdoors in all weather, finishing in the studio only while the sea air is still in the canvas.",
    quote: "I paint what the weather lets me keep.",
    portrait: "1560250097-0b93528c311a",
    works: [
      "1577083552431-6e5fd01aa342",
      "1541701494587-cb58502866ab",
      "1561214115-f2f134cc4912",
    ],
  },
  {
    name: "Mei-Ling Tan",
    craft: "Pottery",
    medium: "Ceramics",
    location: "Hsinchu, Taiwan",
    since: 2013,
    bio: "Mei-Ling fires porcelain with celadon glazes, aiming for the quiet green of rain on leaves.",
    quote: "The kiln always has the final say.",
    portrait: "1580489944761-15a19d654956",
    works: [
      "1565193566173-7a0ee3dbe261",
      "1610701596007-11502861dcfa",
      "1578749556568-bc2c40e68b61",
    ],
  },
  {
    name: "Rowan Campbell",
    craft: "Carving",
    medium: "Woodcraft",
    location: "Edinburgh, UK",
    since: 2010,
    bio: "Rowan carves Scottish oak and ash with hand tools only, leaving the chisel marks as part of the finished piece.",
    quote: "I leave the marks. They show a person was here.",
    portrait: "1472099645785-5658abf4ff4e",
    works: [
      "1513519245088-0e12902e5a38",
      "1582561424760-0321d75e81fa",
      "1579783900882-c0d3dad7b119",
    ],
  },
];

const SECTIONS = [
  {
    craft: "Painting",
    image: "1541701494587-cb58502866ab",
    chip: "Paintings",
    eyebrow: "Painters",
    title: "Brush, pigment and gold leaf",
    link: "View all paintings",
  },
  {
    craft: "Sculpture",
    image: "1515569067071-ec3b4a3c3a4d",
    chip: "Sculptures",
    eyebrow: "Sculptors",
    title: "Hands that cast and carve",
    link: "View all sculptures",
  },
  {
    craft: "Pottery",
    image: "1493106641515-6b5631de4bb9",
    chip: "Pottery",
    eyebrow: "Potters",
    title: "Clay, fire and glaze",
    link: "View all pottery",
  },
  {
    craft: "Carving",
    image: "1549490349-8643362247b5",
    chip: "Carvings",
    eyebrow: "Carvers",
    title: "Wood shaped by hand",
    link: "View all carvings",
  },
  {
    craft: "Weaving",
    image: "1600585154340-be6161a56a0c",
    chip: "Textiles",
    eyebrow: "Weavers",
    title: "Thread, loom and fibre",
    link: "View all textiles",
  },
  {
    craft: "Printmaking",
    image: "1460661419201-fd4cecdf8a8b",
    chip: "Prints",
    eyebrow: "Printmakers",
    title: "Ink, press and paper",
    link: "View all prints",
  },
];


const STUDIO = [
  {
    title: "Clay and fire",
    image: "1493106641515-6b5631de4bb9",
    body: "A potter centres the clay on the wheel, shapes it, lets it dry slowly, then fires it twice: once to harden it, once to set the glaze. A crack at any step can mean starting over.",
    note: "Often 2 to 4 weeks from lump to finished piece",
  },
  {
    title: "Layers of oil paint",
    image: "1561214115-f2f134cc4912",
    body: "Oil paint dries slowly, so a painter builds a canvas in thin layers, waiting between each one. The depth you see in a finished painting is time made visible.",
    note: "A single canvas can take weeks or months",
  },
  {
    title: "Wood and stone",
    image: "1513519245088-0e12902e5a38",
    body: "Carvers work from the outside in, removing material they can never put back. Every cut is a decision, and the grain or the vein of the stone shapes the final form.",
    note: "Every mark is permanent",
  },
];

const CRAFTS = ["All", ...SECTIONS.map((s) => s.craft)];
const CHIP_LABEL = Object.fromEntries(SECTIONS.map((s) => [s.craft, s.chip]));
const CRAFT_EMOJI = {
  Painting: "🎨",
  Sculpture: "🗿",
  Pottery: "🏺",
  Carving: "🪵",
  Weaving: "🧵",
  Printmaking: "🖼️",
};

const ARTISTS = RAW.map((a) => {
  const works = a.works.map((id) => ({
    image: unsplash(id, 1400),
    thumb: unsplash(id, 900),
  }));
  return {
    ...a,
    id: slug(a.name),
    initials: a.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join(""),
    emoji: CRAFT_EMOJI[a.craft] || "🎨",
    portrait: unsplash(a.portrait, 400),
    works,
    image: works[0].thumb,
  };
});

const TOTAL_WORKS = ARTISTS.reduce((n, a) => n + a.works.length, 0);


const COLLAGE = [
  ...new Set(ARTISTS.flatMap((a) => a.works.map((w) => w.thumb))),
].slice(0, 12);

const countOf = (craft) =>
  craft === "All"
    ? ARTISTS.length
    : ARTISTS.filter((a) => a.craft === craft).length;

const WELCOME = [
  "Painters",
  "Sculptors",
  "Potters",
  "Weavers",
  "Carvers",
  "Photographers",
  "Printmakers",
  "Jewellery makers",
  "Digital artists",
  "Self-taught artists",
];



const FALLBACK_ART_IMAGE = "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=85&w=1200";

function Photo({ src, alt, fallback, className, textClass = "text-5xl" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${className} relative overflow-hidden bg-[#F1E4DC]`} role="img" aria-label={alt}>
        <img
          src={FALLBACK_ART_IMAGE}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E0A]/30 to-transparent" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}


function Avatar({ artist, className = "h-14 w-14", textClass = "text-base" }) {
  return (
    <Photo
      src={artist.portrait}
      alt={`Portrait of ${artist.name}`}
      fallback={artist.initials}
      textClass={textClass}
      className={`${className} shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white`}
    />
  );
}

const Icon = ({ d, className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);
const SEARCH = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z";
const CLOSE = "M6 18L18 6M6 6l12 12";
const LEFT = "M15 19l-7-7 7-7";
const RIGHT = "M9 5l7 7-7 7";
const USER = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0";
const PIN =
  "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z";

const ring =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A9462A]";
const primaryBtn = `bg-gradient-to-b from-[#B54D2C] to-[#8F3A22] hover:from-[#A9462A] hover:to-[#7E321D] text-white font-semibold shadow-sm cursor-pointer ${ring}`;

function ArtistCard({ artist, onOpen }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(120,60,40,0.08)]">
      <button
        type="button"
        onClick={() => onOpen(artist.id)}
        aria-label={`View ${artist.name}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-[#F1E4DC] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A9462A]"
      >
        <Photo
          src={artist.image}
          alt={`Artwork by ${artist.name}`}
          fallback={artist.emoji}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-[#5C453B] backdrop-blur">
          Since {artist.since}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center gap-2.5">
          <Avatar artist={artist} className="h-10 w-10" textClass="text-sm" />
          <div className="min-w-0">
            <h3 className={`${HEADING} text-lg leading-snug text-[#1F1410]`}>
              {artist.name}
            </h3>
            <p className="truncate text-xs text-[#7A6258]">{artist.location}</p>
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-[#A9462A]">
          {artist.medium}
        </p>
        <p className="line-clamp-2 text-xs leading-relaxed text-[#5C453B]">
          {artist.bio}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-xs text-[#7A6258]">
            {artist.works.length} artworks
          </p>
          <button
            type="button"
            onClick={() => onOpen(artist.id)}
            className={`rounded-lg px-3.5 py-1.5 text-xs ${primaryBtn}`}
          >
            View artist
          </button>
        </div>
      </div>
    </article>
  );
}

function QuickView({ artist, position, total, onPrev, onNext, onClose }) {
  const closeRef = useRef(null);
  const [active, setActive] = useState(0);
  const work = artist.works[active];

  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${artist.name} quick view`}
    >
      <div
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-[#FFF9F5] sm:max-w-5xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid sm:grid-cols-2">
          <Photo
            key={work.image}
            src={work.image}
            alt={`Artwork ${active + 1} by ${artist.name}`}
            fallback={artist.emoji}
            className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-full sm:min-h-[440px]"
          />

          <div className="flex flex-col gap-3 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <Avatar
                  artist={artist}
                  className="h-14 w-14"
                  textClass="text-xl"
                />
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-[#A9462A]">
                    {artist.craft.toUpperCase()}
                  </p>
                  <h2
                    className={`${HEADING} text-3xl leading-tight text-[#1F1410]`}
                  >
                    {artist.name}
                  </h2>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={`rounded-full p-2 text-[#7A6258] hover:bg-white cursor-pointer ${ring}`}
              >
                <Icon d={CLOSE} className="w-5 h-5" />
              </button>
            </div>

            <span className="flex items-center gap-1 text-sm text-[#7A6258]">
              <Icon d={PIN} className="w-3.5 h-3.5" /> {artist.location} ·
              Making art since {artist.since}
            </span>

            <p className="mt-1 text-base leading-relaxed text-[#3A2A22]">
              {artist.bio}
            </p>

            <blockquote
              className={`${HEADING} border-l-4 border-[#A9462A] pl-4 text-lg italic leading-snug text-[#5C453B]`}
            >
              “{artist.quote}”
            </blockquote>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[#7A6258]">
                Artwork {active + 1} of {artist.works.length}
              </p>
              <p className={`${HEADING} text-lg text-[#1F1410]`}>
                {artist.medium}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <a
                href={DISCOVER_PATH}
                className={`rounded-lg px-5 py-2.5 text-sm ${primaryBtn}`}
              >
                Browse artworks
              </a>
            </div>
          </div>
        </div>

        
        <div className="border-t border-[#EBD9CF] px-6 py-5 sm:px-8">
          <h3 className={`${HEADING} text-xl text-[#1F1410]`}>
            Artworks by {artist.name}
          </h3>
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
            {artist.works.map((w, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={`Show artwork ${i + 1}`}
                  className={`block w-full cursor-pointer text-left ${ring} rounded-xl`}
                >
                  <div
                    className={`overflow-hidden rounded-xl bg-[#F1E4DC] ${
                      i === active
                        ? "ring-2 ring-[#A9462A] ring-offset-2 ring-offset-[#FFF9F5]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Photo
                      src={w.thumb}
                      alt={`Artwork ${i + 1} by ${artist.name}`}
                      fallback={artist.emoji}
                      textClass="text-3xl"
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-[#EBD9CF] px-5 py-3 text-sm text-[#7A6258] sm:px-8">
          <button
            type="button"
            onClick={onPrev}
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-white cursor-pointer ${ring}`}
          >
            <Icon d={LEFT} /> Previous artist
          </button>
          <span>
            {position} of {total}
          </span>
          <button
            type="button"
            onClick={onNext}
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-white cursor-pointer ${ring}`}
          >
            Next artist <Icon d={RIGHT} />
          </button>
        </div>
      </div>
    </div>
  );
}


function Spotlight({ artist, onOpen }) {
  return (
    <section
      className="mb-16 grid items-center gap-8 lg:grid-cols-5 lg:gap-12"
      aria-label={`Artist spotlight: ${artist.name}`}
    >
      <div className="relative lg:col-span-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 overflow-hidden rounded-3xl bg-[#F1E4DC] shadow-[0_20px_50px_rgba(120,60,40,0.18)]">
            <Photo
              src={artist.works[1].image}
              alt={`Featured artwork by ${artist.name}`}
              fallback={artist.emoji}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl bg-[#F1E4DC]">
              <Photo
                src={artist.works[0].thumb}
                alt={`Artwork by ${artist.name}`}
                fallback={artist.emoji}
                textClass="text-3xl"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#F1E4DC]">
              <Photo
                src={artist.works[2].thumb}
                alt={`Artwork by ${artist.name}`}
                fallback={artist.emoji}
                textClass="text-3xl"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <Avatar
              artist={artist}
              className="mt-auto h-20 w-20 self-end"
              textClass="text-2xl"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-[#A9462A]">
          ARTIST SPOTLIGHT
        </p>
        <h2 className={`${HEADING} text-4xl leading-tight sm:text-5xl`}>
          {artist.name}
        </h2>
        <p className="mt-2 text-sm text-[#7A6258]">
          {artist.medium} · {artist.location}
        </p>
        <p className="mt-4 text-base leading-relaxed text-[#3A2A22]">
          {artist.bio}
        </p>
        <blockquote
          className={`${HEADING} mt-5 border-l-4 border-[#A9462A] pl-5 text-2xl italic leading-snug text-[#5C453B]`}
        >
          “{artist.quote}”
        </blockquote>
        <button
          type="button"
          onClick={() => onOpen(artist.id)}
          className={`mt-6 rounded-xl px-7 py-3.5 text-sm ${primaryBtn}`}
        >
          See {artist.name.split(" ")[0]}'s work
        </button>
      </div>
    </section>
  );
}


function Studio() {
  return (
    <section className="mb-16" aria-label="Inside the studio">
      <div className="mb-8 max-w-2xl">
        <h2 className={`${HEADING} text-3xl leading-tight sm:text-5xl`}>
          What goes into a piece
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#5C453B] sm:text-lg">
          Original art is slow on purpose. Behind each work on Athenura are
          weeks of drying, firing, layering and carving, and an artist who
          decided when it was done.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {STUDIO.map((s) => (
          <article
            key={s.title}
            className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(120,60,40,0.08)]"
          >
            <Photo
              src={unsplash(s.image, 900)}
              alt={s.title}
              fallback="🎨"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5 sm:p-6">
              <h3 className={`${HEADING} text-2xl text-[#1F1410]`}>
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C453B]">
                {s.body}
              </p>
              <p className="mt-3 text-sm font-medium text-[#A9462A]">
                {s.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}



export default function Artists() {
  const [query, setQuery] = useState("");
  const [craft, setCraft] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [videoFailed, setVideoFailed] = useState(false);

  
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTISTS.filter((a) => {
      const text =
        `${a.name} ${a.medium} ${a.location} ${a.craft} ${CHIP_LABEL[a.craft]}`.toLowerCase();
      return (craft === "All" || a.craft === craft) && text.includes(q);
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, craft]);

  const groups = SECTIONS.map((s) => ({
    ...s,
    items: results.filter((a) => a.craft === s.craft),
  })).filter((g) => g.items.length);
  const ordered = groups.flatMap((g) => g.items);
  const isFiltering = query.trim() !== "" || craft !== "All";
  const spotlight = ARTISTS.find((a) => a.id === SPOTLIGHT_ID);

  const selectedIndex = ordered.findIndex((a) => a.id === selectedId);
  const selected = selectedIndex >= 0 ? ordered[selectedIndex] : null;
  const step = (dir) => () =>
    setSelectedId(
      ordered[(selectedIndex + dir + ordered.length) % ordered.length].id,
    );

  
  const openFromSpotlight = (id) => {
    setQuery("");
    setCraft("All");
    setSelectedId(id);
  };

  const reset = () => {
    setQuery("");
    setCraft("All");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF8] via-[#FBEFE9] to-[#F3DDD3] text-[#1F1410] antialiased">
      
      <section
        className="relative flex min-h-[78vh] items-center overflow-hidden bg-gradient-to-br from-[#3B1C12] to-[#170D09] bg-cover bg-center sm:min-h-[calc(92vh-80px)] lg:min-h-[calc(94vh-80px)]"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=85&w=2000)` }}
      >
        {!videoFailed && (
          <video
            src={meetingVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#160B08]/75 via-[#1A0E0A]/45 to-[#1A0E0A]/30" />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-20 text-center sm:py-28 lg:py-32">
          <h1
            className={`${HEADING} text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl`}
          >
            Meet the artists
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#F1E4DC] sm:text-xl">
            Every piece on Athenura was made by a person with a story. Meet the
            painters, potters, sculptors and weavers behind the work, and see
            how they make it.
          </p>

          <dl className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-4 text-white">
            {[
              [ARTISTS.length, "Independent artists"],
              [SECTIONS.length, "Crafts"],
              [TOTAL_WORKS, "Original works"],
            ].map(([n, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur"
              >
                <dt className="sr-only">{label}</dt>
                <dd className={`${HEADING} text-3xl sm:text-4xl`}>{n}</dd>
                <dd className="mt-1 text-xs text-[#F1E4DC] sm:text-sm">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      
      <div
        className="sticky z-30 border-b border-[#EBD9CF] bg-[#FFFBF8]/95 backdrop-blur"
        style={{ top: STICKY_TOP }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-12">
          <label className="relative block lg:w-80 lg:shrink-0">
            <span className="sr-only">Search artists</span>
            <Icon
              d={SEARCH}
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8938A]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by artist, material or place"
              className="w-full rounded-xl border border-[#E4D2C8] bg-white py-2 pl-10 pr-4 text-sm focus:border-[#A9462A] focus:outline-none focus:ring-2 focus:ring-[#A9462A]/25"
            />
          </label>

          <div
            className="flex min-w-0 gap-2 overflow-x-auto"
            role="group"
            aria-label="Filter by art form"
          >
            {CRAFTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCraft(c)}
                aria-pressed={craft === c}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${ring} ${
                  craft === c
                    ? "bg-[#1F1410] text-white"
                    : "border border-[#E4D2C8] bg-white text-[#5C453B] hover:bg-[#F7E9E1]"
                }`}
              >
                {c === "All" ? "All artists" : CHIP_LABEL[c]}{" "}
                <span className="opacity-60">{countOf(c)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-12">
        
        {!isFiltering && spotlight && (
          <Spotlight artist={spotlight} onOpen={openFromSpotlight} />
        )}

        {isFiltering && (
          <div
            className="mb-6 flex items-center justify-between text-sm text-[#7A6258]"
            aria-live="polite"
          >
            <p>
              {results.length} {results.length === 1 ? "artist" : "artists"}{" "}
              found
            </p>
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer font-semibold text-[#A9462A] underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}

        {groups.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className={`${HEADING} text-3xl`}>No artists found</h2>
            <p className="mt-2 text-[#7A6258]">
              Try a different name, material or place.
            </p>
            <button
              type="button"
              onClick={reset}
              className={`mt-6 rounded-xl px-6 py-3 text-sm ${primaryBtn}`}
            >
              Show all artists
            </button>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.craft} className="mb-10">
            
              <div className="relative mb-4 h-32 overflow-hidden rounded-2xl bg-[#2A1510] sm:h-36 lg:h-40">
                <Photo
                  src={unsplash(g.image, 1400)}
                  alt={`${g.eyebrow} at work`}
                  fallback={CRAFT_EMOJI[g.craft]}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E0A]/85 via-[#1A0E0A]/50 to-transparent" />
                <div className="relative flex h-full items-center justify-between gap-4 px-5 sm:px-7">
                  <div>
                    <p className="mb-0.5 text-[11px] font-semibold tracking-[0.14em] text-[#F1C9B8]">
                      {g.eyebrow.toUpperCase()}
                    </p>
                    <h2
                      className={`${HEADING} text-xl leading-tight text-white sm:text-3xl`}
                    >
                      {g.title}
                    </h2>
                  </div>
                  <a
                    href={DISCOVER_PATH}
                    className="shrink-0 text-sm font-medium text-white underline underline-offset-4"
                  >
                    {g.link}
                  </a>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map((a) => (
                  <ArtistCard key={a.id} artist={a} onOpen={setSelectedId} />
                ))}
              </div>
            </section>
          ))
        )}

        
        {!isFiltering && <Studio />}

        
        <section className="relative overflow-hidden rounded-3xl bg-[#2A1510]">
          <div
            className="absolute inset-0 grid grid-cols-4 grid-rows-3 sm:grid-cols-6 sm:grid-rows-2"
            aria-hidden="true"
          >
            {COLLAGE.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                className="h-full w-full object-cover"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-[#1A0E0A]/75" />

          <div className="relative mx-auto flex min-h-[380px] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[440px] sm:px-12 sm:py-16">
            <h2
              className={`${HEADING} text-4xl leading-tight text-white sm:text-5xl`}
            >
              Every artist is welcome
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#F1E4DC] sm:text-lg">
              Athenura is open to artists of every craft and background. Whether
              you are trained or self-taught, working full-time or just starting
              out, you can share your work here and reach buyers across the
              country.
            </p>

            <ul
              className="mt-5 flex flex-wrap justify-center gap-2"
              aria-label="Kinds of artists on Athenura"
            >
              {WELCOME.map((w) => (
                <li
                  key={w}
                  className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm text-white"
                >
                  {w}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <a
                href={ARTIST_LOGIN_PATH}
                className={`inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#8F3A22] hover:bg-[#FBEFE9] ${ring}`}
              >
                <Icon d={USER} /> Artist login
              </a>
              <p className="mt-3 text-sm text-[#E7D3C8]">
                New to Athenura? You can create your account from the login
                page.
              </p>
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <QuickView
          key={selected.id}
          artist={selected}
          position={selectedIndex + 1}
          total={ordered.length}
          onPrev={step(-1)}
          onNext={step(1)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}