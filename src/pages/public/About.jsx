import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, HandHeart, ShieldCheck, Globe2 } from "lucide-react";

// Image URLs
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80"; // Gallery background for hero
const CRAFT_SECTION_IMAGE = "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80"; // Handcrafted pottery image

const STATS = [
  { value: "350+", label: "Independent artists" },
  { value: "2,800+", label: "Original artworks sold" },
  { value: "40+", label: "Countries shipped to" },
  { value: "4.8/5", label: "Average buyer rating" },
];

const VALUES = [
  {
    icon: HandHeart,
    title: "Fair to artists",
    body: "Artists set their own prices and keep the majority of every sale. No race to the bottom, no anonymous bulk listings.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: ShieldCheck,
    title: "Verified, every time",
    body: "Every artist is reviewed before they can list, and every original piece ships with a signed certificate of authenticity.",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Curated, not crowded",
    body: "Our team hand-reviews new listings and collections, so browsing Athenura feels like a gallery — not an endless marketplace feed.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Globe2,
    title: "Made to travel",
    body: "From archival packaging to insured shipping, every piece is prepared to arrive exactly as the artist intended, anywhere in the world.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
  },
];

export default function About() {
  return (
    <div className="bg-[var(--color-canvas,#fcfbf9)] text-[var(--color-neutral,#1a1a1a)] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hero Section: "A gallery built for independent artists" */}
      <section className="relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center overflow-hidden border-b border-[var(--color-outline,#e5e5e5)] bg-stone-900">
        {/* Background Image */}
        <img
          src={HERO_BG_IMAGE}
          alt="Art gallery space filled with artwork"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        />

        {/* Dark Overlay for optimal text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/85 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-[850px] mx-auto px-6 py-24 text-center text-white">
          <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11.5px] uppercase tracking-widest font-semibold text-amber-200 inline-block">
            Our story
          </span>
          <h1 className="mt-4 font-['Playfair_Display',serif] text-[34px] sm:text-[50px] leading-tight font-normal tracking-tight">
            A gallery built for independent artists
          </h1>
          <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-stone-200 max-w-[620px] mx-auto font-light">
            Athenura connects original painters, sculptors, and makers with collectors who care where their art comes from.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <Link
              to="/discover"
              className="h-11 px-8 rounded-full bg-white text-stone-900 text-[13.5px] font-semibold hover:bg-stone-100 transition-all inline-flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Main Story: "Craft first, always" */}
      <section className="max-w-[1050px] mx-auto px-6 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-[14.5px] leading-relaxed text-[var(--color-neutral,#2d2d2d)]">
          <h2 className="font-['Playfair_Display',serif] text-[28px] sm:text-[32px] text-[var(--color-neutral,#1a1a1a)] mb-3">
            Craft first, always
          </h2>
          <p>
            Athenura started with a simple frustration: talented independent artists were spending more
            time marketing themselves on social media than making work, while buyers had no easy way to
            find original, verified pieces they could trust.
          </p>
          <p>
            We built a marketplace that puts the artist's craft first — careful curation, honest pricing,
            and a buying experience that feels like walking through a small, considered gallery rather
            than scrolling an endless feed.
          </p>
          <p>
            Today, Athenura is home to painters, sculptors, ceramicists, and digital artists from across the
            world, each reviewed and verified before their first piece goes live.
          </p>
        </div>

        {/* Handcrafted Pottery Image */}
        <div className="relative rounded-2xl overflow-hidden border border-[var(--color-outline,#e5e5e5)] shadow-md aspect-[4/3] group">
          <img
            src={CRAFT_SECTION_IMAGE}
            alt="Handcrafted ceramic pots and vessels in an artisan studio"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[var(--color-outline,#e5e5e5)] bg-[var(--color-section,#f5f4f0)]">
        <div className="max-w-[900px] mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-['Playfair_Display',serif] text-[28px] sm:text-[34px] font-medium text-[var(--color-primary,#111111)]">
                {s.value}
              </p>
              <p className="mt-1 text-[12.5px] text-[var(--color-secondary,#666666)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values & Image Grid Section */}
      <section className="max-w-[1050px] mx-auto px-6 py-16 sm:py-20">
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <h2 className="font-['Playfair_Display',serif] text-[28px] sm:text-[32px] text-[var(--color-neutral,#1a1a1a)]">
            What we believe
          </h2>
          <p className="mt-2 text-[14px] text-[var(--color-secondary,#666666)]">
            Designed to protect creators and give collectors peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-[var(--color-elevated,#ffffff)] border border-[var(--color-outline,#e5e5e5)] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <span className="w-10 h-10 rounded-full bg-[var(--color-section,#f5f4f0)] flex items-center justify-center text-[var(--color-primary,#111111)] mb-4">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[16px] font-semibold text-[var(--color-neutral,#1a1a1a)]">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-secondary,#555555)]">
                    {v.body}
                  </p>
                </div>
                <div className="h-44 w-full overflow-hidden border-t border-[var(--color-outline,#e5e5e5)]">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="border-t border-[var(--color-outline,#e5e5e5)] bg-[var(--color-section,#f5f4f0)]">
        <div className="max-w-[640px] mx-auto px-6 py-16 text-center">
          <h2 className="font-['Playfair_Display',serif] text-[26px] sm:text-[30px] text-[var(--color-neutral,#1a1a1a)]">
            Ready to explore the collection?
          </h2>
          <p className="mt-2 text-[14px] text-[var(--color-secondary,#666666)]">
            Start discovering unique, verified original artworks from independent artists across the globe.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/discover"
              className="h-11 px-8 rounded-full bg-[var(--color-primary,#111111)] text-white text-[13.5px] font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
            >
              Discover artworks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}