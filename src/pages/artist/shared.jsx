export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const PAGE = "mx-auto max-w-[1400px] space-y-6 p-6";
export const inputCls =
  "h-11 w-full rounded-xl border border-[#E8E1DB] bg-white px-3 text-[14px] text-[#362F26] outline-none placeholder:text-[#A28F7D] focus:border-[#9F5639]";
export const btnPrimary =
  "rounded-full bg-[#9F5639] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#8A4A30] disabled:opacity-50";
export const btnGhost =
  "rounded-full border border-[#E8E1DB] bg-white px-5 py-2.5 text-[14px] text-[#362F26] transition-colors hover:bg-[#F9F8F6]";

const TONES = {
  amber: "bg-[#F6E7D0] text-[#8A5A22]",
  green: "bg-[#E7EEDD] text-[#4C6B3F]",
  red: "bg-[#F6DFDA] text-[#9B3B2E]",
  gray: "bg-[#EFE9E1] text-[#736153]",
};
const MAP = {
  New: "amber", "In Progress": "amber", Processing: "amber", Pending: "amber", Shipped: "amber",
  Completed: "green", Delivered: "green", Paid: "green", Published: "green",
  Declined: "red", Cancelled: "red",
  Draft: "gray", Sold: "gray",
};

export function Badge({ status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium ${TONES[MAP[status] || "gray"]}`}>
      {status}
    </span>
  );
}

export function Card({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#E8E1DB] bg-white p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] text-[#362F26]">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const ARTWORKS = [
  { id: 1, title: "Golden Silence", category: "Painting", medium: "Oil on canvas", size: "24 x 30 in", price: 18500, status: "Published", description: "Warm ochre layers with a quiet central glow." },
  { id: 2, title: "Monsoon Reverie", category: "Painting", medium: "Acrylic on canvas", size: "30 x 40 in", price: 32400, status: "Published", description: "Rain-soaked streets in deep blues and greys." },
  { id: 3, title: "City in Ochre", category: "Abstract", medium: "Mixed media", size: "36 x 36 in", price: 21800, status: "Published", description: "Abstract skyline built from textured ochre blocks." },
  { id: 4, title: "Still Water Study", category: "Painting", medium: "Watercolour", size: "18 x 24 in", price: 15600, status: "Draft", description: "A calm study of light on still water." },
  { id: 5, title: "Ink and Rust", category: "Drawing", medium: "Ink on paper", size: "12 x 16 in", price: 12400, status: "Draft", description: "Ink lines with rust-toned washes." },
  { id: 6, title: "Walnut Relief", category: "Sculpture", medium: "Carved wood", size: "14 x 10 in", price: 23500, status: "Sold", description: "Hand-carved walnut relief panel." },
];