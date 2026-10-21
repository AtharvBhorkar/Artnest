import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, HandHeart, ShieldCheck, Globe2, Quote } from "lucide-react";

import aboutVideo from "../../assets/about1.mp4";
import storyVideo from "../../assets/artist.mp4";

const IMG = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const hideBroken = (e) => {
  e.currentTarget.style.display = "none";
};

const STORY_POSTER = IMG("photo-1460661419201-fd4cecdf8a8b", 1000);

const MEDIUMS = [
  "Oil painting", "Watercolour", "Sculpture", "Ceramics", "Printmaking",
  "Charcoal & ink", "Mixed media", "Digital art", "Textile art", "Photography",
];

const STATS = [
  { value: "350+", label: "Independent artists" },
  { value: "2,800+", label: "Original artworks sold" },
  { value: "40+", label: "Countries shipped to" },
  { value: "4.8/5", label: "Average buyer rating" },
];

const ART_FORMS = [
  {
    title: "Paintings",
    body: "Oil, acrylic and watercolour works where you can still see the brushstroke, the layering and the artist's hand.",
    image: IMG("photo-1547826039-bfc35e0f1ea8", 700),
  },
  {
    title: "Ceramics & sculpture",
    body: "Thrown, carved and cast pieces. Each one is shaped by hand, so no two are ever identical.",
    image: IMG("photo-1493106641515-6b5631de4bb9", 700),
  },
  {
    title: "Abstract & mixed media",
    body: "Texture, collage and colour experiments from artists who ignore the rulebook.",
    image: IMG("photo-1541961017774-22349e4a1262", 700),
  },
  {
    title: "Prints & drawings",
    body: "Hand-pulled prints, ink and charcoal studies. Original art at a price that invites you to start collecting.",
    image: IMG("photo-1518998053901-5348d3961a04", 700),
  },
];

const JOURNEY = [
  { step: "Apply", body: "Artists share their portfolio, their process and the story behind their work." },
  { step: "Get reviewed", body: "Our curators check originality, craft and consistency before anyone is approved." },
  { step: "List your work", body: "Artists upload each piece with their own price, size, medium and story." },
  { step: "Ship worldwide", body: "Archival packaging, insured shipping and a signed certificate of authenticity." },
];

const VALUES = [
  { icon: HandHeart, title: "Fair to artists", body: "Artists set their own prices and keep the majority of every sale. No race to the bottom, no anonymous bulk listings." },
  { icon: ShieldCheck, title: "Verified, every time", body: "Every artist is reviewed before they can list, and every original piece ships with a signed certificate of authenticity." },
  { icon: Sparkles, title: "Curated, not crowded", body: "Our team hand-reviews new listings, so browsing Athenura feels like a gallery, not an endless feed." },
  { icon: Globe2, title: "Made to travel", body: "Archival packaging and insured shipping mean every piece arrives exactly as the artist intended." },
];

function StoryMedia() {
  const [failed, setFailed] = useState(false);
  const vidRef = useRef(null);

  const playVid = () => {
    const p = vidRef.current?.play();
    if (p && p.catch) p.catch(() => {});
  };
  const pauseVid = () => vidRef.current?.pause();

  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-300 shadow-xl ring-1 ring-black/5"
      onMouseEnter={playVid}
      onMouseLeave={pauseVid}
      onTouchStart={playVid}
      onTouchEnd={pauseVid}
    >
      {!failed ? (
        <video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          ref={vidRef}
          src={storyVideo}
          muted
          loop
          playsInline
          preload="auto"
          aria-label="An artist at work in the studio"
          onError={() => setFailed(true)}
        />
      ) : null}

      <img
        src={STORY_POSTER}
        alt="A hand-pulled print being lifted from the plate"
        onError={hideBroken}
        className={`absolute inset-0 w-full h-full object-cover athenura-drift ${failed ? "" : "hidden motion-reduce:block"}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}

function HeroVideo() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, []);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
      src={aboutVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
    />
  );
}

export default function About() {
  return (
    <div className="bg-[var(--color-canvas,#fcfbf9)] text-[var(--color-neutral,#1a1a1a)] font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Work+Sans:wght@400;500;600&display=swap');

        @keyframes athenura-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .athenura-hero-glow { position: absolute; inset: -25%; pointer-events: none; background: radial-gradient(circle at 28% 32%, rgba(201,163,90,.24), transparent 46%), radial-gradient(circle at 72% 66%, rgba(92,43,48,.3), transparent 50%); animation: athenura-glow 20s ease-in-out infinite alternate; }
        @keyframes athenura-glow { from { transform: translate3d(-2%,-1%,0) scale(1.02); } to { transform: translate3d(2%,2%,0) scale(1.1); } }
        .athenura-hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse 62% 58% at 50% 48%, rgba(30,17,10,.62) 0%, rgba(30,17,10,.34) 55%, transparent 100%), linear-gradient(180deg, rgba(40,24,14,.52) 0%, rgba(40,24,14,.08) 38%, rgba(40,24,14,.44) 100%), radial-gradient(ellipse at center, transparent 52%, rgba(20,10,5,.55) 100%); }
        .athenura-hero-accent { font-style: italic; font-weight: 400; background: linear-gradient(100deg, #f8e6b8 0%, #e0bb74 45%, #c9a35a 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; padding-right: .08em; }
        @media (prefers-reduced-motion: reduce) { .athenura-hero-glow { animation: none; } }
        .athenura-marquee { animation: athenura-marquee 40s linear infinite; }
        @keyframes athenura-drift {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.12) translate(-2%, -2%); }
        }
        .athenura-drift { animation: athenura-drift 18s ease-in-out infinite alternate; }

        .athenura-story-title {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
        }
        .athenura-story-title em {
          font-style: italic;
          background: linear-gradient(120deg, #b45309, #d97706 55%, #92400e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .athenura-story-copy p {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px;
          line-height: 1.7;
          font-weight: 500;
          color: #44403c;
          letter-spacing: 0.005em;
          text-wrap: pretty;
          hyphens: auto;
        }
        .athenura-story-copy p.athenura-lead {
          font-size: 25px;
          line-height: 1.55;
          color: #1c1917;
        }
        .athenura-story-copy p.athenura-lead::first-letter {
          font-family: 'Playfair Display', serif;
          float: left;
          font-size: 4.4rem;
          line-height: 0.82;
          padding: 0.35rem 0.7rem 0 0;
          color: #b45309;
          font-weight: 500;
        }
        .athenura-story-copy p strong {
          font-weight: 600;
          color: #1c1917;
        }
        .athenura-story-copy p em {
          font-style: italic;
          color: #92400e;
        }
        @media (max-width: 640px) {
          .athenura-story-copy p { font-size: 19px; }
          .athenura-story-copy p.athenura-lead { font-size: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .athenura-marquee { animation: none; }
          .athenura-drift { animation: none; }
        }
      `}</style>

      <section className="relative flex items-center overflow-hidden bg-[#2a1a10] min-h-[100svh] font-['Work_Sans',sans-serif]">
        <HeroVideo />
        <div className="athenura-hero-glow" aria-hidden="true" />
        <div className="athenura-hero-overlay" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-[clamp(104px,16vh,140px)] pb-[clamp(96px,14vh,128px)] text-center text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#f0d9a3]/40 bg-white/10 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.2em] text-[#f1d9a3] backdrop-blur-md">
            <Sparkles size={13} className="text-[#e0bb74]" /> About Athenura
          </p>
          <h1 className="mt-3 mx-auto max-w-[800px] font-['Fraunces',serif] text-[34px] sm:text-[48px] lg:text-[60px] leading-[1.08] font-medium tracking-tight [text-shadow:0_4px_40px_rgba(0,0,0,.45)]">
            Every artwork starts with someone who{" "}
            <em className="athenura-hero-accent">couldn't stop making it.</em>
          </h1>
          <p className="mt-5 mx-auto max-w-[580px] text-[15px] sm:text-[17px] leading-relaxed text-[#fbf1da] [text-shadow:0_1px_18px_rgba(0,0,0,.55)]">
            Athenura is a gallery built for independent painters, sculptors and makers, and for collectors who want to know the hands behind the work.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/discover"
              className="h-12 px-8 rounded-full text-white text-[14px] font-medium bg-gradient-to-br from-[#b88a3e] via-[#96702f] to-[#7a5a22] border border-white/20 shadow-[0_12px_30px_-8px_rgba(150,112,47,.85),inset_0_1px_0_rgba(255,255,255,.28)] hover:-translate-y-0.5 hover:from-[#c9984a] hover:via-[#a67b36] hover:to-[#86632a] transition-all inline-flex items-center justify-center active:scale-95"
            >
              Explore the gallery
            </Link>
            <Link
              to="/artists"
              className="h-12 px-8 rounded-full border border-white/55 bg-white/10 text-white text-[14px] font-medium backdrop-blur-md hover:bg-white hover:text-[#5c2b30] transition-colors inline-flex items-center justify-center active:scale-95"
            >
              Meet the artists
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-[var(--color-outline,#e5e5e5)] bg-[var(--color-section,#f5f4f0)] py-4" aria-label="Art mediums on Athenura">
        <div className="athenura-marquee flex w-max gap-10 whitespace-nowrap font-['Playfair_Display',serif] italic text-[20px] text-stone-600">
          {[...MEDIUMS, ...MEDIUMS].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </section>

      <section id="mission" className="scroll-mt-20 max-w-[1100px] mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <StoryMedia />

        <div className="athenura-story-copy">
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700 !font-['Plus_Jakarta_Sans',sans-serif] !text-[12px] !leading-none">
            Our story
          </p>
          <h2 className="athenura-story-title mt-4 mb-8 text-[38px] sm:text-[52px] leading-[1.05]">
            Craft <em>comes first</em>
          </h2>
          <div className="space-y-5">
            <p className="athenura-lead">
              Athenura started with a frustration: gifted artists were spending more hours posting online than making art, and buyers had no reliable way to find original work from a real maker.
            </p>
            <p>
              Every piece carries months of practice: sketches discarded, pigments remixed, plates re-inked, kilns fired twice. That effort deserves to be seen, so each listing tells you who made the piece, how, and why.
            </p>
            <p>
              Today, painters, sculptors, ceramicists, printmakers and digital artists from around the world sell here, and every one of them is reviewed before their first piece goes live.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e0d4bc] bg-[#efe6d3] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(201,163,90,.22),transparent_70%)]">
        <div className="max-w-[900px] mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-['Playfair_Display',serif] text-[30px] sm:text-[36px] font-medium text-[#6f5222]">{s.value}</p>
              <p className="mt-1 text-[12.5px] text-[#8c7f68]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-[620px] mb-12">
          <h2 className="font-['Playfair_Display',serif] text-[30px] sm:text-[38px] leading-tight">
            What you'll find here
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-secondary,#666666)]">
            Art is more than paint on canvas. Browse by the way a piece was made and see how each medium carries its own kind of skill.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ART_FORMS.map((f) => (
            <Link
              to="/discover"
              key={f.title}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-800 block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <img
                src={f.image}
                alt={f.title}
                onError={hideBroken}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="font-['Playfair_Display',serif] text-[20px]">{f.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-stone-200">{f.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#2a1a10] bg-[radial-gradient(circle_at_20%_20%,rgba(201,163,90,.2),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(92,43,48,.4),transparent_50%)] text-white">
        <div className="max-w-[1100px] mx-auto px-6 py-16 sm:py-24">
          <h2 className="font-['Playfair_Display',serif] text-[30px] sm:text-[38px] leading-tight max-w-[560px]">
            How an artist joins Athenura
          </h2>
          <p className="mt-3 max-w-[560px] text-[15px] text-stone-300 leading-relaxed">
            We keep the door open to new talent, and the standard high.
          </p>
          <ol className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {JOURNEY.map((j, i) => (
              <li key={j.step} className="border-t border-white/20 pt-5">
                <span className="font-['Playfair_Display',serif] text-[34px] text-[#e0bb74]">{i + 1}</span>
                <h3 className="mt-2 text-[16px] font-semibold">{j.step}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-stone-300">{j.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-[820px] mx-auto px-6 py-16 sm:py-24 text-center">
        <Quote size={28} strokeWidth={1.5} className="mx-auto text-amber-700" />
        <blockquote className="mt-5 font-['Playfair_Display',serif] text-[24px] sm:text-[32px] leading-snug">
          I used to price my work by what I thought people would pay. Here, I price it by what it took to make.
        </blockquote>
        <p className="mt-5 text-[13.5px] text-[var(--color-secondary,#666666)]">
          A sample of what our artists tell us. Replace with a real artist's words.
        </p>
      </section>

      <section className="border-t border-[var(--color-outline,#e5e5e5)] bg-[var(--color-section,#f5f4f0)]">
        <div className="max-w-[1100px] mx-auto px-6 py-16 sm:py-20">
          <h2 className="font-['Playfair_Display',serif] text-[30px] sm:text-[38px] leading-tight">What we believe</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex gap-4">
                  <span className="shrink-0 w-11 h-11 rounded-full bg-white border border-[var(--color-outline,#e5e5e5)] flex items-center justify-center">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold">{v.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-secondary,#555555)]">{v.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e0d4bc] bg-[#f6f1e6] bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(201,163,90,.25),transparent_70%)]">
        <div className="max-w-[640px] mx-auto px-6 py-16 sm:py-20 text-center">
          <h2 className="font-['Playfair_Display',serif] text-[28px] sm:text-[34px] leading-tight">
            Find the piece that stays with you
          </h2>
          <p className="mt-3 text-[14.5px] text-[var(--color-secondary,#666666)] leading-relaxed">
            Browse original, verified artworks from independent artists around the world, or share your own.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/discover"
              className="h-11 px-8 rounded-full bg-[#2a1a10] text-white text-[13.5px] font-medium hover:bg-[#5c2b30] transition-colors inline-flex items-center justify-center shadow-sm active:scale-95"
            >
              Discover artworks
            </Link>
            <Link
              to="/artists"
              className="h-11 px-8 rounded-full border border-[#cdbb97] text-[#1c1712] text-[13.5px] font-medium hover:bg-[#efe6d3] transition-colors inline-flex items-center justify-center active:scale-95"
            >
              See all artists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}