import React, { useState, useMemo } from 'react';

// --- DATA STRUCTURES ---

const INITIAL_FEATURED_MASTERS = [
  {
    id: 'fm1',
    name: "Elora Vance",
    specialty: "Sculptural Stoneware & Terracotta",
    location: "Provence, FR",
    followersCount: 14200,
    artworks: "28",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    selectedWorks: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300",
    ]
  },
  {
    id: 'fm2',
    name: "Mateo Rossi",
    specialty: "Abstract Expressionist Oils",
    location: "Florence, IT",
    followersCount: 22800,
    artworks: "34",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    selectedWorks: [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&q=80&w=300",
    ]
  },
  {
    id: 'fm3',
    name: "Sylvan Zhou",
    specialty: "Architectural Wood & Bronze",
    location: "Kyoto, JP",
    followersCount: 19500,
    artworks: "16",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    selectedWorks: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=300",
    ]
  }
];

const INITIAL_GUILD_ARTISTS = [
  {
    id: 'ga1',
    name: "Clara Miró",
    medium: "OIL PAINTING",
    location: "Barcelona, Spain",
    followersCount: 8400,
    pieces: "19",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga2',
    name: "Alejandro Cruz",
    medium: "CERAMICS",
    location: "Oaxaca, Mexico",
    followersCount: 11300,
    pieces: "24",
    coverImage: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga3',
    name: "Hannah Berg",
    medium: "MARBLE & BRONZE",
    location: "Portland, USA",
    followersCount: 9700,
    pieces: "15",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga4',
    name: "Linus Aaberg",
    medium: "FINE ART PRINTS",
    location: "Copenhagen, DK",
    followersCount: 7200,
    pieces: "32",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga5',
    name: "Amina Diallo",
    medium: "TEXTILE & FIBER",
    location: "Dakar, Senegal",
    followersCount: 15100,
    pieces: "12",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga6',
    name: "Julien Moreau",
    medium: "OIL PAINTING",
    location: "Normandy, France",
    followersCount: 6800,
    pieces: "21",
    coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga7',
    name: "Mei-Ling Tan",
    medium: "CERAMICS",
    location: "Hsinchu, Taiwan",
    followersCount: 18400,
    pieces: "18",
    coverImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200",
    ]
  },
  {
    id: 'ga8',
    name: "Rowan Campbell",
    medium: "WOODCRAFT",
    location: "Edinburgh, UK",
    followersCount: 5300,
    pieces: "14",
    coverImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
    thumbnails: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=200",
    ]
  }
];

const FILTER_OPTIONS = [
  'All Disciplines',
  'Oil & Canvas',
  'Ceramics & Clay',
  'Bronze & Stone Sculptures',
  'Mixed Media',
  'Minimalist Woodcraft',
];

// --- UTILITY FUNCTIONS ---

const formatFollowers = (count) => {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();
};

// --- REUSABLE SUB-COMPONENTS ---

const FeaturedMasterCard = ({ master, onViewProfile }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100/90 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
    <div>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-neutral-100 group">
        <img
          src={master.profileImage}
          alt={master.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <span className="inline-block text-[10px] font-bold text-[#A86146] uppercase tracking-wider mb-1">
        Featured Master
      </span>
      
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-xl font-serif font-semibold text-neutral-900 leading-snug">
          {master.name}
        </h3>
        <div className="flex items-center gap-1 bg-[#FAF0E6] text-[#7C3F28] px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{master.location}</span>
        </div>
      </div>

      <p className="text-xs text-neutral-500 mb-4 font-medium">
        {master.specialty}
      </p>

      {/* Stats Bar */}
      <div className="bg-[#FAF0E6]/60 rounded-xl p-3 flex justify-around items-center text-center mb-5 border border-[#F3E7DB]/60">
        <div>
          <div className="text-sm font-semibold text-neutral-900">{formatFollowers(master.followersCount)}</div>
          <div className="text-[9px] text-neutral-400 font-semibold tracking-wider uppercase">Followers</div>
        </div>
        <div className="h-6 w-[1px] bg-neutral-200/80"></div>
        <div>
          <div className="text-sm font-semibold text-neutral-900">{master.artworks}</div>
          <div className="text-[9px] text-neutral-400 font-semibold tracking-wider uppercase">Artworks</div>
        </div>
      </div>

      {/* Selected Works Grid */}
      <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block mb-2">
        Selected Works
      </span>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {master.selectedWorks.map((workImg, imgIdx) => (
          <div key={imgIdx} className="h-20 rounded-lg overflow-hidden bg-neutral-100 group/thumb">
            <img
              src={workImg}
              alt={`Selected artwork ${imgIdx + 1} by ${master.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
            />
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      onClick={() => onViewProfile(master.name)}
      className="w-full bg-[#7C3F28] hover:bg-[#66321F] active:bg-[#522718] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors text-center shadow-xs cursor-pointer"
    >
      View Profile
    </button>
  </div>
);

const GuildArtistCard = ({ artist, onViewProfile }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
    <div>
      <div className="h-44 w-full rounded-lg overflow-hidden mb-3 bg-neutral-100 group">
        <img
          src={artist.coverImage}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between gap-1 mb-1">
        <h3 className="text-sm font-serif font-semibold text-neutral-900 truncate">
          {artist.name}
        </h3>
        <span className="bg-[#FAF0E6] text-[#A86146] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
          {artist.medium}
        </span>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-3">
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{artist.location}</span>
      </div>

      <div className="bg-[#FAF0E6]/60 rounded-md p-2 flex justify-around items-center text-center mb-3 text-[10px] border border-[#F3E7DB]/40">
        <div>
          <div className="font-semibold text-neutral-800 leading-tight">{formatFollowers(artist.followersCount)}</div>
          <div className="text-[8px] text-neutral-400 uppercase tracking-wider font-medium">FOLLOWERS</div>
        </div>
        <div className="h-4 w-[1px] bg-neutral-200"></div>
        <div>
          <div className="font-semibold text-neutral-800 leading-tight">{artist.pieces}</div>
          <div className="text-[8px] text-neutral-400 uppercase tracking-wider font-medium">PIECES</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {artist.thumbnails.map((thumb, tIdx) => (
          <div key={tIdx} className="h-12 rounded overflow-hidden bg-neutral-100">
            <img
              src={thumb}
              alt={`Artwork detail ${tIdx + 1} by ${artist.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      onClick={() => onViewProfile(artist.name)}
      className="w-full bg-[#FAF0E6] hover:bg-[#F2E3D5] text-neutral-800 text-[11px] font-medium py-2 rounded-md transition-colors text-center cursor-pointer"
    >
      View Profile
    </button>
  </div>
);

// --- MAIN COMPONENT ---

export default function MeetTheArtistsHeader() {
  const [selectedFilter, setSelectedFilter] = useState('All Disciplines');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Followed');
  const [visibleGuildArtistsCount, setVisibleGuildArtistsCount] = useState(8);

  // Actions
  const handleViewProfile = (artistName) => {
    alert(`Navigating to ${artistName}'s atelier profile.`);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
  };

  const handleSubmitDossier = () => {
    alert('Thank you for your interest! Opening the Atelier Dossier submission form.');
  };

  const handleLoadMore = () => {
    setVisibleGuildArtistsCount((prev) => Math.min(prev + 4, INITIAL_GUILD_ARTISTS.length));
  };

  // Filtered Featured Masters
  const filteredFeaturedMasters = useMemo(() => {
    return INITIAL_FEATURED_MASTERS.filter((master) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        master.name.toLowerCase().includes(query) ||
        master.specialty.toLowerCase().includes(query) ||
        master.location.toLowerCase().includes(query);

      let matchesFilter = true;
      if (selectedFilter === 'Oil & Canvas') matchesFilter = master.specialty.toLowerCase().includes('oil');
      else if (selectedFilter === 'Ceramics & Clay') matchesFilter = master.specialty.toLowerCase().includes('stoneware') || master.specialty.toLowerCase().includes('terracotta');
      else if (selectedFilter === 'Bronze & Stone Sculptures') matchesFilter = master.specialty.toLowerCase().includes('bronze');
      else if (selectedFilter === 'Minimalist Woodcraft') matchesFilter = master.specialty.toLowerCase().includes('wood');

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  // Filtered and Sorted Guild Artists
  const filteredGuildArtists = useMemo(() => {
    return INITIAL_GUILD_ARTISTS
      .filter((artist) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          artist.name.toLowerCase().includes(query) ||
          artist.medium.toLowerCase().includes(query) ||
          artist.location.toLowerCase().includes(query);

        let matchesFilter = true;
        if (selectedFilter === 'Oil & Canvas') matchesFilter = artist.medium === 'OIL PAINTING';
        else if (selectedFilter === 'Ceramics & Clay') matchesFilter = artist.medium === 'CERAMICS';
        else if (selectedFilter === 'Bronze & Stone Sculptures') matchesFilter = artist.medium === 'MARBLE & BRONZE';
        else if (selectedFilter === 'Minimalist Woodcraft') matchesFilter = artist.medium === 'WOODCRAFT';

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'Most Followed') return b.followersCount - a.followersCount;
        if (sortBy === 'Catalogue Depth') return parseInt(b.pieces) - parseInt(a.pieces);
        return 0;
      });
  }, [searchQuery, selectedFilter, sortBy]);

  return (
    <div className="bg-[#FAF4ED] font-sans text-neutral-800 antialiased selection:bg-[#7C3F28] selection:text-white">
      
      {/* 1. HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-12 border-b border-neutral-200/50">
        {/* Video Background Layer */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-artist-painting-a-canvas-5178/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Tint Overlay for Legibility */}
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto w-full z-10">
          
          {/* Main Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 mb-4">
              <span className="w-2 h-2 bg-[#EACEC0] rounded-full animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-[#FAF0E6] uppercase">
                Curated Atelier Guild
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif leading-tight text-white mb-6 font-normal tracking-tight drop-shadow-md">
              Meet the Masters & Artisans
            </h1>

            <p className="text-neutral-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
              Discover master painters, sculptors, and ceramists from ateliers across the globe, each hand-selected and accredited through physical gallery provenance.
            </p>
          </div>

          {/* Search & Filter Controls Container */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/20 border border-white/80 flex flex-col gap-4"
          >
            {/* Top Inputs Group */}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artists by name, style, or location..."
                  className="w-full bg-[#FAF0E6]/70 text-neutral-800 placeholder-neutral-400 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#7C3F28]/20 focus:border-[#7C3F28] transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF0E6]/70 text-neutral-700 text-sm font-medium rounded-xl pl-10 pr-10 py-3.5 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#7C3F28]/20 focus:border-[#7C3F28] cursor-pointer transition-all"
                >
                  <option value="Most Followed">Most Followed</option>
                  <option value="Newest Ateliers">Newest Ateliers</option>
                  <option value="Catalogue Depth">Catalogue Depth</option>
                </select>
                
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="bg-[#7C3F28] hover:bg-[#66321F] active:bg-[#522718] text-white text-sm font-medium px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#7C3F28]/10 cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Filter Pills Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
              <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase mr-2">
                Filter:
              </span>

              {FILTER_OPTIONS.map((filter) => {
                const isActive = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`text-xs px-4 py-2 rounded-full transition-all font-medium cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-[#FAF0E6]/80 text-neutral-700 hover:bg-[#F2E3D5]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </form>

        </div>
      </section>

      {/* 2. FEATURED MASTERS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-2 border-b border-neutral-200/60 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#7C3F28] uppercase block mb-1">
                Curatorial Selection
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900">
                Featured Masters
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Recognized by the International Fine Arts Jury
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredFeaturedMasters.map((master) => (
              <FeaturedMasterCard 
                key={master.id} 
                master={master} 
                onViewProfile={handleViewProfile} 
              />
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="bg-[#F2E3D5]/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#E6D4C5]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-white/60">
                <svg className="w-6 h-6 text-[#7C3F28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-neutral-900 leading-snug">
                  Atelier Guild Integrity Guarantee
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                  Every creator is studio-inspected. Physical certificates sealed with wax accompany each dispatched piece.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 shrink-0 border-t md:border-t-0 border-neutral-300/60 pt-4 md:pt-0 w-full md:w-auto justify-end">
              <div className="text-right">
                <div className="text-2xl font-serif font-medium text-neutral-900 leading-none">148</div>
                <div className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mt-1">Verified Masters</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-serif font-medium text-neutral-900 leading-none">32</div>
                <div className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase mt-1">Global Guilds</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ALL GUILD ARTISTS REGISTRY */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 border-t border-neutral-200/50">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-1">
                Registry Index
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 font-medium">
                All Guild Artists
              </h2>
            </div>
            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900 font-semibold">{Math.min(visibleGuildArtistsCount, filteredGuildArtists.length)} of {filteredGuildArtists.length}</strong> accredited practitioners
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredGuildArtists.slice(0, visibleGuildArtistsCount).map((artist) => (
              <GuildArtistCard 
                key={artist.id} 
                artist={artist} 
                onViewProfile={handleViewProfile} 
              />
            ))}
          </div>

          {visibleGuildArtistsCount < filteredGuildArtists.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="bg-white hover:bg-[#FAF0E6] text-neutral-800 border border-neutral-200/80 text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                Load More Artists
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <p className="text-center text-[10px] sm:text-xs font-bold tracking-widest text-neutral-400 uppercase mb-8">
            Curated Weekly Additions From Independent Workshops
          </p>

          <div className="bg-[#FFF4E8] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-sm border border-[#F3E2D3]">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold tracking-wider text-[#A6613F] uppercase block mb-2">
                For Master Artisans
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-neutral-900 leading-tight mb-3">
                Are you an independent artist or sculptor?
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Join the ArtNest Guild. We offer museum-level curatorial support, worldwide collector distribution, and wax-sealed physical provenance documentation.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleSubmitDossier}
                className="w-full md:w-auto bg-[#823A21] hover:bg-[#6D301B] active:bg-[#582614] text-white text-sm font-semibold py-4 px-8 rounded-xl transition-all shadow-md shadow-[#823A21]/10 cursor-pointer"
              >
                Submit Atelier Dossier
              </button>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}