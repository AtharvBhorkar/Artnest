import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, HandHeart, ShieldCheck, Globe2, Quote } from "lucide-react";

import aboutVideo from "../auth/about.mp4";

const IMG = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const hideBroken = (e) => {
  e.currentTarget.style.display = "none";
};

const HERO_POSTER = IMG("photo-1536924940846-227afb31e2a5", 1600);


const STORY_VIDEO = "/videos/printmaking.mp4";
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

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-300 shadow-md">
      {!failed ? (
        <video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          src={STORY_VIDEO}
          poster={STORY_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="An artist inking and pulling a print by hand"
          onError={() => setFailed(true)}
        />
      ) : null}
      
      <img
        src={STORY_POSTER}
        alt="A hand-pulled print being lifted from the plate"
        onError={hideBroken}
        className={`absolute inset-0 w-full h-full object-cover athenura-drift ${failed ? "" : "hidden motion-reduce:block"}`}
      />
    </div>
  );
}

export default function About() {
  return (
    <div className="bg-[var(--color-canvas,#fcfbf9)] text-[var(--color-neutral,#1a1a1a)] font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`
        @keyframes athenura-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .athenura-marquee { animation: athenura-marquee 40s linear infinite; }
        @keyframes athenura-drift {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.12) translate(-2%, -2%); }
        }
        .athenura-drift { animation: athenura-drift 18s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .athenura-marquee { animation: none; }
          .athenura-drift { animation: none; }
        }
      `}</style>


      <section className="relative min-h-[560px] sm:min-h-[680px] flex items-center justify-center overflow-hidden bg-stone-900">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={aboutVideo}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-20 sm:py-28 text-center text-white">
          <p className="text-[13px] text-amber-200 font-medium">About Athenura</p>
          <h1 className="mt-3 mx-auto max-w-[800px] font-['Playfair_Display',serif] text-[38px] sm:text-[68px] leading-[1.05] font-normal tracking-tight">
            Every artwork starts with someone who couldn't stop making it.
          </h1>
          <p className="mt-5 mx-auto max-w-[580px] text-[15px] sm:text-[17px] leading-relaxed text-stone-200 font-light">
            Athenura is a gallery built for independent painters, sculptors and makers, and for collectors who want to know the hands behind the work.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/discover"
              className="h-11 px-8 rounded-full bg-white text-stone-900 text-[13.5px] font-semibold hover:bg-stone-100 transition-colors inline-flex items-center justify-center shadow-lg active:scale-95"
            >
              Explore the gallery
            </Link>
            <Link
              to="/artists"
              className="h-11 px-8 rounded-full border border-white/40 text-white text-[13.5px] font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center active:scale-95"
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

      
      <section className="max-w-[1100px] mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <StoryMedia />

        <div className="space-y-4 text-[15px] leading-[1.75]">
          <h2 className="font-['Playfair_Display',serif] text-[30px] sm:text-[38px] leading-tight mb-3">
            Craft comes first
          </h2>
          <p>
            Athenura started with a frustration: gifted artists were spending more hours posting online than making art, and buyers had no reliable way to find original work from a real maker.
          </p>
          <p>
            Every piece carries months of practice: sketches discarded, pigments remixed, plates re-inked, kilns fired twice. That effort deserves to be seen, so each listing tells you who made the piece, how, and why.
          </p>
          <p>
            Today, painters, sculptors, ceramicists, printmakers and digital artists from around the world sell here, and every one of them is reviewed before their first piece goes live.
          </p>
        </div>
      </section>

      
      <section className="border-y border-[var(--color-outline,#e5e5e5)] bg-[var(--color-section,#f5f4f0)]">
        <div className="max-w-[900px] mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-['Playfair_Display',serif] text-[30px] sm:text-[36px] font-medium">{s.value}</p>
              <p className="mt-1 text-[12.5px] text-[var(--color-secondary,#666666)]">{s.label}</p>
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

      
      <section className="bg-stone-900 text-white">
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
                <span className="font-['Playfair_Display',serif] text-[34px] text-amber-200">{i + 1}</span>
                <h3 className="mt-2 text-[16px] font-semibold">{j.step}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-stone-300">{j.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ARTIST VOICE */}
      <section className="max-w-[820px] mx-auto px-6 py-16 sm:py-24 text-center">
        <Quote size={28} strokeWidth={1.5} className="mx-auto text-amber-700" />
        <blockquote className="mt-5 font-['Playfair_Display',serif] text-[24px] sm:text-[32px] leading-snug">
          I used to price my work by what I thought people would pay. Here, I price it by what it took to make.
        </blockquote>
        <p className="mt-5 text-[13.5px] text-[var(--color-secondary,#666666)]">
          A sample of what our artists tell us. Replace with a real artist's words.
        </p>
      </section>

      {/* VALUES */}
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

      {/* CTA */}
      <section className="border-t border-[var(--color-outline,#e5e5e5)]">
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
              className="h-11 px-8 rounded-full bg-[var(--color-primary,#111111)] text-white text-[13.5px] font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center shadow-sm active:scale-95"
            >
              Discover artworks
            </Link>
            <Link
              to="/artists"
              className="h-11 px-8 rounded-full border border-[var(--color-outline,#d4d4d4)] text-[13.5px] font-medium hover:bg-stone-100 transition-colors inline-flex items-center justify-center active:scale-95"
            >
              See all artists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}