import { useMemo, useState } from "react";
import { Search, ChevronDown, Plus, Eye, Pencil, ShieldCheck, Ban, CircleCheck, X } from "lucide-react";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const INITIAL = [
  { id: "A-103", name: "Kabir Verma", specialty: "Sculpture", location: "Udaipur, IN", artworks: 21, sales: 741000, rating: 4.9, verified: true, status: "Active" },
  { id: "A-101", name: "Aarav Mehta", specialty: "Paintings", location: "Jaipur, IN", artworks: 42, sales: 612000, rating: 4.9, verified: true, status: "Active" },
  { id: "A-102", name: "Riya Sharma", specialty: "Digital Art", location: "Bengaluru, IN", artworks: 35, sales: 498000, rating: 4.8, verified: true, status: "Active" },
  { id: "A-104", name: "Ananya Kapoor", specialty: "Abstract Art", location: "Delhi, IN", artworks: 29, sales: 356000, rating: 4.7, verified: true, status: "Active" },
  { id: "A-105", name: "Meera Iyer", specialty: "Photography", location: "Kochi, IN", artworks: 18, sales: 214000, rating: 4.6, verified: false, status: "Active" },
  { id: "A-106", name: "Devika Rao", specialty: "Paintings", location: "Pune, IN", artworks: 9, sales: 96500, rating: 4.4, verified: false, status: "Under review" },
  { id: "A-107", name: "Farhan Ali", specialty: "Sculpture", location: "Lucknow, IN", artworks: 6, sales: 58200, rating: 4.2, verified: false, status: "Suspended" },
];

const TONE = {
  Active: "bg-[#E7EEDD] text-[#4C6B3F]",
  "Under review": "bg-[#F6E7D0] text-[#8A5A22]",
  Suspended: "bg-[#F6DFDA] text-[#9B3B2E]",
};

const SORTS = {
  "Sort: Sales (high to low)": (a, b) => b.sales - a.sales,
  "Sort: Sales (low to high)": (a, b) => a.sales - b.sales,
  "Sort: Rating": (a, b) => b.rating - a.rating,
  "Sort: Artworks": (a, b) => b.artworks - a.artworks,
  "Sort: Name (A-Z)": (a, b) => a.name.localeCompare(b.name),
};

const selectCls =
  "appearance-none h-11 pl-4 pr-10 rounded-full border border-[#E8E1DB] bg-white text-[14px] text-[#362F26] focus:outline-none focus:border-[#9F5639] cursor-pointer";

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
    </div>
  );
}

function ArtistModal({ mode, artist, onClose, onSave }) {
  const [form, setForm] = useState(
    artist || { name: "", specialty: "", location: "" }
  );
  const readOnly = mode === "view";
  const title = mode === "add" ? "Add artist" : mode === "edit" ? "Edit artist" : "Artist details";
  const valid = form.name.trim() && form.specialty.trim() && form.location.trim();

  const field = (label, key) => (
    <label className="block">
      <span className="mb-1 block text-[12.5px] text-[#A28F7D]">{label}</span>
      <input
        value={form[key]}
        disabled={readOnly}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="h-11 w-full rounded-xl border border-[#E8E1DB] bg-white px-3 text-[14px] text-[#362F26] outline-none focus:border-[#9F5639] disabled:bg-[#F9F8F6]"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E8E1DB] px-6 py-4">
          <h3 className="text-[18px] text-[#362F26]">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          {field("Name", "name")}
          {field("Specialty", "specialty")}
          {field("Location", "location")}
          {readOnly && artist && (
            <dl className="grid grid-cols-2 gap-3 pt-2 text-[13.5px]">
              <div><dt className="text-[#A28F7D]">Artworks</dt><dd>{artist.artworks}</dd></div>
              <div><dt className="text-[#A28F7D]">Sales</dt><dd>{inr(artist.sales)}</dd></div>
              <div><dt className="text-[#A28F7D]">Rating</dt><dd>{artist.rating ? artist.rating.toFixed(1) : "—"}</dd></div>
              <div><dt className="text-[#A28F7D]">Status</dt><dd>{artist.status}</dd></div>
            </dl>
          )}
        </div>
        {!readOnly && (
          <div className="flex justify-end gap-2 border-t border-[#E8E1DB] px-6 py-4">
            <button type="button" onClick={onClose} className="rounded-full border border-[#E8E1DB] px-5 py-2.5 text-[14px] text-[#362F26] hover:bg-[#F9F8F6]">
              Cancel
            </button>
            <button
              type="button"
              disabled={!valid}
              onClick={() => onSave(form)}
              className="rounded-full bg-[#9F5639] px-5 py-2.5 text-[14px] text-white hover:bg-[#8A4A30] disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Artists() {
  const [artists, setArtists] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [verif, setVerif] = useState("All artists");
  const [sort, setSort] = useState(Object.keys(SORTS)[0]);
  const [modal, setModal] = useState(null); // { mode, artist }

  const specialties = useMemo(
    () => ["All specialties", ...new Set(artists.map((a) => a.specialty))],
    [artists]
  );

  const shown = useMemo(() => {
    const q = search.toLowerCase();
    return artists
      .filter((a) => specialty === "All specialties" || a.specialty === specialty)
      .filter((a) => verif === "All artists" || (verif === "Verified") === a.verified)
      .filter((a) => a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q))
      .sort(SORTS[sort]);
  }, [artists, search, specialty, verif, sort]);

  const patch = (id, changes) =>
    setArtists((as) => as.map((a) => (a.id === id ? { ...a, ...changes } : a)));

  const verify = (a) => patch(a.id, { verified: true, status: a.status === "Suspended" ? a.status : "Active" });
  const toggleBlock = (a) => patch(a.id, { status: a.status === "Suspended" ? "Active" : "Suspended" });

  const save = (form) => {
    if (modal.mode === "add") {
      setArtists((as) => [
        ...as,
        { ...form, id: "A-" + (100 + as.length + 1), artworks: 0, sales: 0, rating: 0, verified: false, status: "Under review" },
      ]);
    } else {
      patch(modal.artist.id, { name: form.name, specialty: form.specialty, location: form.location });
    }
    setModal(null);
  };

  const iconBtn = "grid h-8 w-8 place-items-center rounded-full text-[#A28F7D] transition-colors hover:bg-[#F3ECE5] hover:text-[#362F26]";

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[280px] flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28F7D]" />
          <input
            type="text"
            placeholder="Search artists…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-full border border-[#E8E1DB] bg-white pl-11 pr-4 text-[14px] text-[#362F26] placeholder:text-[#A28F7D] focus:border-[#9F5639] focus:outline-none"
          />
        </div>
        <Select value={specialty} onChange={setSpecialty} options={specialties} />
        <Select value={verif} onChange={setVerif} options={["All artists", "Verified", "Unverified"]} />
        <Select value={sort} onChange={setSort} options={Object.keys(SORTS)} />
        <button
          type="button"
          onClick={() => setModal({ mode: "add" })}
          className="flex h-11 items-center gap-2 rounded-full bg-[#9F5639] px-5 text-[14px] text-white transition-colors hover:bg-[#8A4A30]"
        >
          <Plus size={16} /> Add artist
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E8E1DB] bg-white">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E8E1DB] text-[11px] uppercase tracking-[0.08em] text-[#A28F7D]">
              {["Artist", "Location", "Artworks", "Sales", "Rating", "Verification", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.id} className="border-b border-[#E8E1DB] last:border-b-0 hover:bg-[#F9F8F6]">
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[#362F26]">{a.name}</p>
                  <p className="text-[13px] text-[#A28F7D]">{a.specialty}</p>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#362F26]">{a.location}</td>
                <td className="px-6 py-4 text-[14px] text-[#362F26]">{a.artworks}</td>
                <td className="px-6 py-4 text-[14px] text-[#362F26]">{inr(a.sales)}</td>
                <td className="px-6 py-4 text-[14px] text-[#362F26]">{a.rating ? a.rating.toFixed(1) : "—"}</td>
                <td className="px-6 py-4">
                  {a.verified ? (
                    <span className="flex items-center gap-1.5 text-[13px] text-[#362F26]">
                      <CircleCheck size={16} className="text-[#4C6B3F]" /> Verified
                    </span>
                  ) : (
                    <span className="text-[13px] text-[#A28F7D]">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium ${TONE[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button type="button" title="View" className={iconBtn} onClick={() => setModal({ mode: "view", artist: a })}>
                      <Eye size={17} />
                    </button>
                    <button type="button" title="Edit" className={iconBtn} onClick={() => setModal({ mode: "edit", artist: a })}>
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      title={a.verified ? "Already verified" : "Verify artist"}
                      disabled={a.verified}
                      className={`${iconBtn} disabled:cursor-not-allowed disabled:opacity-40`}
                      onClick={() => verify(a)}
                    >
                      <ShieldCheck size={17} />
                    </button>
                    <button
                      type="button"
                      title={a.status === "Suspended" ? "Unblock artist" : "Block artist"}
                      className={`${iconBtn} hover:!text-[#9B3B2E]`}
                      onClick={() => toggleBlock(a)}
                    >
                      <Ban size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-[14px] text-[#A28F7D]">
                  No artists match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ArtistModal
          key={modal.artist?.id || "new"}
          mode={modal.mode}
          artist={modal.artist}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  );
}