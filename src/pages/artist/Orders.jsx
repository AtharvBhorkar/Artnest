import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { AlertTriangle, MessageSquare, Check, Eye, Printer, X } from "lucide-react";
import { Badge, PAGE, inr } from "./shared";

const INITIAL = [
  { id: "ORD-10245", buyer: "Priya Sharma", item: "Golden Silence", amount: 18500, date: "18 Sep 2026", status: "Delivered" },
  { id: "ORD-10244", buyer: "Rahul Kapoor", item: "Monsoon Reverie", amount: 32400, date: "18 Sep 2026", status: "Processing" },
  { id: "ART-2041", buyer: "Sneha Iyer", item: "Bronze Whisper", amount: 64200, date: "17 Sep 2026", status: "Shipped" },
  { id: "ORD-10242", buyer: "Vikram Nair", item: "City in Ochre", amount: 21800, date: "17 Sep 2026", status: "Delivered" },
  { id: "ORD-10241", buyer: "Ishaan Joshi", item: "Still Water Study", amount: 15600, date: "16 Sep 2026", status: "Cancelled" },
];

const TABS = ["All", "New", "Confirmed", "Packed", "Cancelled"];

const ACTIONS = {
  New: [
    ["Confirm order", "Confirmed", "primary"],
    ["Cancel order", "Cancelled", "danger"],
  ],

  Confirmed: [
    ["Mark as packed", "Packed", "primary"],
    ["Cancel order", "Cancelled", "danger"],
  ],

  Packed: [
    ["Cancel order", "Cancelled", "danger"],
  ],

  Cancelled: [],
};

const STAGE_KEY = "artnest_order_stage";
const STATUS_OF = ["New", "Confirmed", "Packed", "Cancelled"];
const readStages = () => {
  try {
    return JSON.parse(localStorage.getItem(STAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const BTN = {
  primary: `
    border border-[#9F5639]
    bg-[#9F5639] text-white
    shadow-[0_5px_12px_rgba(159,86,57,0.12)]
    transition-all duration-200 ease-out
    hover:-translate-y-0.5
    hover:bg-[#8A4A30]
    hover:border-[#8A4A30]
    hover:shadow-[0_9px_20px_rgba(159,86,57,0.20)]
    active:translate-y-0
    active:scale-[0.96]
  `,
  ghost: `
    border border-[#E8E1DB]
    bg-white text-[#362F26]
    transition-all duration-200 ease-out
    hover:-translate-y-0.5
    hover:bg-[#F9F8F6]
    hover:border-[#D9C5B8]
    active:translate-y-0
    active:scale-[0.96]
  `,
  danger: `
    border border-[#F0CFC8]
    bg-white text-[#9B3B2E]
    transition-all duration-200 ease-out
    hover:-translate-y-0.5
    hover:bg-[#F6DFDA]
    hover:border-[#E5B8AF]
    active:translate-y-0
    active:scale-[0.96]
  `,
};

const ALL_ACTIONS = [
  ["Confirm order", "Confirmed", "primary"],
  ["Mark as packed", "Packed", "primary"],
  ["Cancel order", "Cancelled", "danger"],
];

const DETAILS = {
  "ORD-10245": { phone: "+91 98200 11223", payment: "UPI", address: "12 MG Road, Bengaluru, Karnataka 560001" },
  "ORD-10244": { phone: "+91 98110 44556", payment: "Card", address: "45 Connaught Place, New Delhi 110001" },
  "ART-2041": { phone: "+91 97650 77889", payment: "Net banking", address: "8 Marine Drive, Mumbai, Maharashtra 400020" },
  "ORD-10242": { phone: "+91 98450 22334", payment: "UPI", address: "21 Anna Salai, Chennai, Tamil Nadu 600002" },
  "ORD-10241": { phone: "+91 99300 55667", payment: "UPI", address: "5 Park Street, Kolkata, West Bengal 700016" },
};
const FALLBACK = { phone: "—", payment: "—", address: "Address not provided" };
const STEPS = ["Placed", "Confirmed", "Packed"];
const STEP_INDEX = { Confirmed: 1, Packed: 2 };

export default function Orders() {
  const [orders, setOrders] = useState(() => {
    const stages = readStages();
    let placed = [];
    try {
      placed = (JSON.parse(localStorage.getItem("artnest_orders")) || [])
        .filter((o) => o?.items?.length)
        .map((o) => ({
          id: o.id,
          buyer: o.address?.name || "Buyer",
          item: o.items.length > 1 ? `${o.items[0].title} + ${o.items.length - 1} more` : o.items[0].title,
          amount: o.total,
          date: new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          phone: o.address?.phone,
          payment: o.payment,
          address: o.address
            ? [o.address.line, o.address.city, [o.address.state, o.address.pin].filter(Boolean).join(" ")].filter(Boolean).join(", ")
            : undefined,
        }));
    } catch {
    }
    return [...placed, ...INITIAL].map((o) => ({ ...o, status: STATUS_OF[stages[o.id] ?? 0] }));
  });
  const [tab, setTab] = useState("All");
  const [viewId, setViewId] = useState(null);
  const current = orders.find((o) => o.id === viewId);

  const [cancelTarget, setCancelTarget] = useState(null);

  const shown = orders.filter((o) => tab === "All" || o.status === tab);
  const count = (t) => (t === "All" ? orders.length : orders.filter((o) => o.status === t).length);
  const advance = (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      const stages = readStages();
      stages[id] = STATUS_OF.indexOf(status);
      localStorage.setItem(STAGE_KEY, JSON.stringify(stages));
    } catch {
    }
  };

  const change = (o, next) => {
    if (next === "Cancelled") {
      setCancelTarget(o);
      return;
    }

    advance(o.id, next);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;

    advance(cancelTarget.id, "Cancelled");
    setCancelTarget(null);
  };

  return (
    <div
      className="
    min-h-screen
    bg-[linear-gradient(180deg,#ffffff_0%,#f7ece6_50%,#ffffff_100%)]
  "
    >
      <div className={PAGE}>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t, index) => (
            <motion.button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -2,
                scale: 1.03,
                transition: {
                  duration: 0.18,
                  ease: "easeOut",
                },
              }}
              whileTap={{
                scale: 0.95,
                y: 0,
                transition: {
                  duration: 0.1,
                },
              }}
              className={`
      group inline-flex cursor-pointer items-center
      rounded-full border px-4 py-2
      text-[13.5px] font-medium
      transition-all duration-200 ease-out

      ${tab === t
                  ? `
            border-[#9F5639]
            bg-[#9F5639]
            text-white
            shadow-[0_5px_14px_rgba(159,86,57,0.16)]
          `
                  : `
            border-[#E4DAD2]
            bg-white
            text-[#4A3A31]
            shadow-[0_2px_7px_rgba(65,43,31,0.04)]
            hover:border-[#D6B8A8]
            hover:bg-[#FFF9F5]
            hover:text-[#9F5639]
            hover:shadow-[0_8px_18px_rgba(159,86,57,0.10)]
          `
                }
    `}
            >
              <span>{t}</span>

              <span
                className={`
        ml-2 min-w-[20px] text-center text-[11.5px] font-semibold
        ${tab === t
                    ? "text-white/80"
                    : "text-[#8C7465] transition-colors duration-200 group-hover:text-[#9F5639]"
                  }
      `}
              >
                {count(t)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* =========================================================
    DESKTOP TABLE
========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.18,
          }}
          className="
    hidden
    overflow-hidden
    rounded-[20px]
    border border-[#E7DDD6]
    bg-[linear-gradient(145deg,#ffffff_0%,#fffdfb_100%)]
    shadow-[0_5px_16px_rgba(65,43,31,0.045)]
    lg:block
  "
        >
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[130px]" />
              <col className="w-[200px]" />
              <col />
              <col className="w-[120px]" />
              <col className="w-[130px]" />
              <col className="w-[130px]" />
              <col className="w-[140px]" />
            </colgroup>

            <thead>
              <tr
                className="
          border-b border-[#E7DDD6]
          bg-[linear-gradient(180deg,#FCF8F4_0%,#F8F1EB_100%)]
          text-[12px] uppercase tracking-[0.08em]
          text-[#5F4A3E]
        "
              >
                {["Order", "Buyer", "Artwork", "Amount", "Date", "Status", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 font-semibold ${h === "Action" ? "text-right" : ""
                        }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {shown.map((o, index) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.28 + index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
            h-[72px]
            border-b border-[#EAE1DB]
            bg-white
            transition-colors duration-200 ease-out
            last:border-b-0
            hover:bg-[#FFFCFA]
          "
                >
                  {/* ORDER ID */}
                  <td
                    className="
              px-6
              text-[13px]
              font-semibold
              tracking-[0.03em]
              text-[#715344]
            "
                  >
                    {o.id}
                  </td>

                  {/* BUYER */}
                  <td className="px-6">
                    <div className="flex items-center gap-3">
                      <span
                        className="
                  grid h-9 w-9 shrink-0 place-items-center
                  rounded-full
                  border border-[#E6D4C8]
                  bg-[linear-gradient(135deg,#F7EADF_0%,#EBD4C5_100%)]
                  text-[11px] font-semibold
                  text-[#3E3028]
                  shadow-[0_3px_8px_rgba(65,43,31,0.08)]
                "
                      >
                        {o.buyer
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>

                      <span
                        className="
                  truncate
                  text-[14.5px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#3E3028]
                "
                      >
                        {o.buyer}
                      </span>
                    </div>
                  </td>

                  {/* ARTWORK */}
                  <td
                    className="
              truncate px-6
              text-[14.5px]
              font-medium
              tracking-[-0.01em]
              text-[#44342B]
            "
                  >
                    {o.item}
                  </td>

                  {/* AMOUNT */}
                  <td
                    className="
              px-6
              text-[14px]
              font-semibold
              tabular-nums
              text-[#362F26]
            "
                  >
                    {inr(o.amount)}
                  </td>

                  {/* DATE */}
                  <td
                    className="
              whitespace-nowrap
              px-6
              text-[13.5px]
              text-[#806D60]
            "
                  >
                    {o.date}
                  </td>

                  {/* STATUS */}
                  <td className="px-6">
                    <Badge status={o.status} />

                    {o.byBuyer && (
                      <span className="mt-1 block text-[11px] text-[#4C6B3F]">
                        Buyer confirmed
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-6">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setViewId(o.id)}
                        className="
                  group
                  inline-flex h-9 cursor-pointer
                  items-center gap-2
                  rounded-full
                  border border-[#E5DCD5]
                  bg-white px-4
                  text-[13px] font-medium
                  text-[#362F26]
                  shadow-[0_2px_7px_rgba(65,43,31,0.04)]
                  transition-all duration-200 ease-out
                  hover:-translate-y-0.5
                  hover:border-[#D5B4A3]
                  hover:bg-[#F9EFE9]
                  hover:text-[#9F5639]
                  hover:shadow-[0_7px_16px_rgba(159,86,57,0.12)]
                  active:translate-y-0
                  active:scale-[0.96]
                "
                      >
                        <Eye
                          size={16}
                          className="
                    text-[#A28F7D]
                    transition-colors duration-200
                    group-hover:text-[#9F5639]
                  "
                        />
                        View
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {!shown.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="
              px-6 py-10
              text-center
              text-[14px]
              text-[#A28F7D]
            "
                  >
                    No orders here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>


        {/* =========================================================
    MOBILE ORDER CARDS
========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="space-y-4 lg:hidden"
        >
          {shown.map((o, index) => (
            <motion.article
              key={o.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.28 + index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
        overflow-hidden
        rounded-[20px]
        border border-[#E7DDD6]
        bg-[linear-gradient(145deg,#ffffff_0%,#fffdfb_100%)]
        p-4
        shadow-[0_5px_16px_rgba(65,43,31,0.045)]
        transition-all duration-200 ease-out
        hover:-translate-y-1
        hover:shadow-[0_10px_24px_rgba(65,43,31,0.08)]
      "
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="
              grid h-10 w-10 shrink-0 place-items-center
              rounded-full
              border border-[#E6D4C8]
              bg-[linear-gradient(135deg,#F7EADF_0%,#EBD4C5_100%)]
              text-[11px] font-semibold
              text-[#3E3028]
            "
                  >
                    {o.buyer
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-semibold text-[#3E3028]">
                      {o.buyer}
                    </p>

                    <p className="mt-0.5 truncate text-[12px] text-[#806D60]">
                      {o.id}
                    </p>
                  </div>
                </div>

                <Badge status={o.status} />
              </div>

              {/* ARTWORK */}
              <div className="mt-4 rounded-xl bg-[#FBF7F3] p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[#A28F7D]">
                  Artwork
                </p>

                <p className="mt-1 text-[14px] font-medium text-[#44342B]">
                  {o.item}
                </p>
              </div>

              {/* DETAILS */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-[#A28F7D]">
                    Amount
                  </p>

                  <p className="mt-0.5 text-[14px] font-semibold text-[#362F26]">
                    {inr(o.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[#A28F7D]">
                    Order date
                  </p>

                  <p className="mt-0.5 text-[13px] text-[#806D60]">
                    {o.date}
                  </p>
                </div>
              </div>

              {/* ACTION */}
              <div className="mt-4 border-t border-[#EAE1DB] pt-4">
                <button
                  type="button"
                  onClick={() => setViewId(o.id)}
                  className="
            group
            flex h-10 w-full cursor-pointer
            items-center justify-center gap-2
            rounded-full
            border border-[#E5DCD5]
            bg-white
            text-[13px] font-medium text-[#362F26]
            transition-all duration-200 ease-out
            hover:-translate-y-0.5
            hover:border-[#D5B4A3]
            hover:bg-[#F9EFE9]
            hover:text-[#9F5639]
            hover:shadow-[0_7px_16px_rgba(159,86,57,0.10)]
            active:scale-[0.97]
          "
                >
                  <Eye
                    size={16}
                    className="
              text-[#A28F7D]
              transition-colors duration-200
              group-hover:text-[#9F5639]
            "
                  />
                  View order
                </button>
              </div>
            </motion.article>
          ))}

          {!shown.length && (
            <div
              className="
        rounded-[20px]
        border border-[#E7DDD6]
        bg-white
        px-6 py-10
        text-center
        text-[14px]
        text-[#A28F7D]
      "
            >
              No orders here.
            </div>
          )}
        </motion.div>

        {current && (() => {
          const d = DETAILS[current.id] || {
            phone: current.phone || FALLBACK.phone,
            payment: current.payment || FALLBACK.payment,
            address: current.address || FALLBACK.address,
          };
          const step = STEP_INDEX[current.status] ?? 0;
          const cancelled = current.status === "Cancelled";

          return createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#2B211B]/45 backdrop-blur-[4px]"
                onClick={() => setViewId(null)}
              />

              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
      relative z-10 flex w-full max-w-[560px]
      max-h-[calc(100dvh-32px)] sm:max-h-[calc(100dvh-48px)]
      flex-col overflow-hidden
      rounded-[22px]
      border border-[#E7DDD6]
      bg-[linear-gradient(145deg,#ffffff_0%,#fffaf6_58%,#f8eee7_100%)]
      shadow-[0_24px_65px_rgba(43,33,27,0.20)]
    "
              >
                <div
                  className="
    relative z-20 flex shrink-0 items-center justify-between gap-4
    border-b border-[#E7DDD6]
    bg-[linear-gradient(145deg,#ffffff_0%,#fffaf6_58%,#f8eee7_100%)]
    px-5 py-4 pr-16
    sm:px-6 sm:py-5 sm:pr-16
  "
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-[19px] text-[#362F26] sm:text-[21px]">
                        {current.id}
                      </h3>

                      <Badge status={current.status} />
                    </div>

                    <p className="mt-1.5 text-[12px] text-[#958073] sm:text-[13px]">
                      Order details · {current.buyer}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewId(null)}
                    aria-label="Close order details"
                    className="
      group absolute right-4 top-4
      grid h-9 w-9 shrink-0 cursor-pointer place-items-center
      rounded-full border border-[#E5D8CF]
      bg-[#F8F1EB] text-[#6F5B4E]
      shadow-[0_4px_12px_rgba(65,43,31,0.08)]
      transition-colors duration-200 ease-out
      hover:border-[#9F5639]
      hover:bg-[#9F5639]
      hover:text-white
      sm:right-5 sm:top-5
    "
                  >
                    <X
                      size={17}
                      strokeWidth={1.9}
                      className="transition-transform duration-200 ease-out group-hover:rotate-90"
                    />
                  </button>
                </div>

                <div className="min-h-0 flex-1
    space-y-5 overflow-y-auto
    px-5 py-5
    sm:space-y-6 sm:px-6 sm:py-6">
                  {cancelled ? (
                    <div
                      className="
      rounded-2xl border border-[#EBCFC9]
      bg-[linear-gradient(135deg,#FFF0ED_0%,#F6DFDA_100%)]
      px-4 py-3.5
      text-[13px] leading-relaxed text-[#9B3B2E]
      shadow-[0_3px_10px_rgba(155,59,46,0.04)]
    "
                    >
                      This order has been cancelled and is no longer active.
                    </div>
                  ) : (
                    <div
                      className="
      rounded-2xl border border-[#E7DDD6]
      bg-white/75 p-4
      shadow-[0_4px_14px_rgba(65,43,31,0.035)]
      sm:p-5
    "
                    >
                      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A6B5A]">
                        Order progress
                      </p>

                      <div className="flex items-start">
                        {STEPS.map((s, i) => (
                          <div
                            key={s}
                            className="flex min-w-0 flex-1 flex-col items-center"
                          >
                            <div className="flex w-full items-center">
                              <div
                                className={`h-0.5 flex-1 ${i === 0
                                    ? "bg-transparent"
                                    : i <= step
                                      ? "bg-[#9F5639]"
                                      : "bg-[#E8DDD6]"
                                  }`}
                              />

                              <div
                                className={`
                grid h-8 w-8 shrink-0 place-items-center
                rounded-full border-2
                transition-all duration-200
                ${i <= step
                                    ? "border-[#9F5639] bg-[#9F5639] text-white shadow-[0_3px_9px_rgba(159,86,57,0.18)]"
                                    : "border-[#E8DDD6] bg-white text-transparent"
                                  }
              `}
                              >
                                <Check size={14} />
                              </div>

                              <div
                                className={`h-0.5 flex-1 ${i === STEPS.length - 1
                                    ? "bg-transparent"
                                    : i < step
                                      ? "bg-[#9F5639]"
                                      : "bg-[#E8DDD6]"
                                  }`}
                              />
                            </div>

                            <span
                              className={`
              mt-2 text-center text-[11px] font-medium sm:text-[12px]
              ${i <= step
                                  ? "text-[#5F4030]"
                                  : "text-[#A28F7D]"
                                }
            `}
                            >
                              {s}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <dl className="grid grid-cols-1 gap-3 text-[14px] sm:grid-cols-2 sm:gap-4">
                    {[
                      ["Buyer", current.buyer],
                      ["Phone", d.phone],
                      ["Artwork", current.item],
                      ["Amount", inr(current.amount)],
                      ["Order date", current.date],
                      ["Payment", d.payment],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="
    min-w-0 rounded-xl
    border border-[#EAE1DB]
    bg-white/70 p-3.5
    transition-colors duration-200
    hover:border-[#DCC8BA]
    hover:bg-[#FFFCFA]
  "
                      >
                        <dt className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#8E796B]">
                          {k}
                        </dt>

                        <dd className="mt-1 break-words text-[13.5px] font-medium leading-relaxed text-[#40352D]">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div
                    className="
    rounded-2xl border border-[#E7DDD6]
    bg-[linear-gradient(135deg,#FFFFFF_0%,#FBF5F0_100%)]
    p-4 shadow-[0_4px_14px_rgba(65,43,31,0.035)]
    sm:p-5
  "
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A6B5A]">
                      Shipping address
                    </p>

                    <p className="mt-2 break-words text-[13.5px] leading-[1.7] text-[#40352D]">
                      {d.address}
                    </p>
                  </div>

                  <div
                    className="
    rounded-2xl border border-[#E7DDD6]
    bg-white/75 p-4
    shadow-[0_4px_14px_rgba(65,43,31,0.035)]
    sm:p-5
  "
                  >
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A6B5A]">
                      Update status
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {ALL_ACTIONS.map(([label, next, tone]) => {
                        const allowed = ACTIONS[current.status].some(([, n]) => n === next);
                        return (
                          <button
                            key={label}
                            type="button"
                            disabled={!allowed}
                            onClick={() => change(current, next)}
                            className={`
  inline-flex h-11 items-center justify-center
  rounded-full px-4
  text-[12.5px] font-medium sm:text-[13px]
  transition-all duration-200 ease-out
  ${allowed
                                ? BTN[tone]
                                : "cursor-not-allowed border border-[#E8E1DB] bg-[#FAF7F4] text-[#A28F7D] opacity-50"
                              }
`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    {current.status === "Packed" && (
                      <p className="mt-2 text-[12.5px] text-[#4C6B3F]">Order packed. Buyer ko update mil gaya.</p>
                    )}
                  </div>
                </div>

                <div
                  className="
    flex shrink-0 flex-wrap items-center justify-between gap-3
    border-t border-[#E7DDD6]
    bg-[linear-gradient(180deg,#FFFCFA_0%,#F8EEE7_100%)]
    px-5 py-4 sm:px-6
  "
                >
                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="
  inline-flex h-10 cursor-pointer items-center gap-2
  rounded-full border border-[#E5D8CF]
  bg-white/90 px-4
  text-[12.5px] font-medium text-[#6F5B4E]
  shadow-[0_3px_9px_rgba(65,43,31,0.04)]
  transition-all duration-200 ease-out
  hover:-translate-y-0.5
  hover:border-[#D5B4A3]
  hover:bg-[#F9EFE9]
  hover:text-[#9F5639]
  hover:shadow-[0_7px_16px_rgba(159,86,57,0.10)]
  active:scale-[0.96]
"
                    >
                      <Printer size={15} /> Invoice
                    </button>
                  </div>

                </div>
              </motion.div>
             </div>,
  document.body
);
        })()}
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Blurred overlay */}
          <button
            type="button"
            aria-label="Close cancellation confirmation"
            onClick={() => setCancelTarget(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-[#2B211B]/45 backdrop-blur-[4px]"
          />

          {/* Confirmation card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="
        relative z-10 w-full max-w-[420px]
        overflow-hidden rounded-[22px]
        border border-[#E7DDD6]
        bg-[linear-gradient(145deg,#ffffff_0%,#fffaf6_58%,#f8eee7_100%)]
        p-6
        shadow-[0_24px_65px_rgba(43,33,27,0.20)]
        sm:p-7
      "
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setCancelTarget(null)}
              aria-label="Close"
              className="
          group absolute right-4 top-4
          grid h-9 w-9 cursor-pointer place-items-center
          rounded-full border border-[#E5D8CF]
          bg-[#F8F1EB] text-[#6F5B4E]
          transition-colors duration-200 ease-out
          hover:border-[#9F5639]
          hover:bg-[#9F5639]
          hover:text-white
        "
            >
              <X
                size={17}
                strokeWidth={1.9}
                className="transition-transform duration-200 ease-out group-hover:rotate-90"
              />
            </button>

            {/* Warning icon */}
            <div className="
        mb-5 grid h-12 w-12 place-items-center
        rounded-full border border-[#EBCFC9]
        bg-[linear-gradient(135deg,#FFF0ED_0%,#F6DFDA_100%)]
        text-[#9B3B2E]
      ">
              <AlertTriangle size={22} strokeWidth={1.7} />
            </div>

            <h3
              id="cancel-order-title"
              className="font-serif text-[22px] text-[#362F26]"
            >
              Cancel this order?
            </h3>

            <p className="mt-3 text-[13.5px] leading-[1.8] text-[#79685C]">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold text-[#715344]">
                {cancelTarget.id}
              </span>
              {" "}for{" "}
              <span className="font-semibold text-[#40352D]">
                {cancelTarget.buyer}
              </span>
              ? This order will be marked as cancelled and will no longer be active.
            </p>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="
            h-10 cursor-pointer rounded-full
            border border-[#E5D8CF] bg-white px-5
            text-[13px] font-medium text-[#6F5B4E]
            transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:bg-[#F9EFE9]
            hover:border-[#D5B4A3]
            active:scale-[0.96]
          "
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={confirmCancel}
                className="
            h-10 cursor-pointer rounded-full
            border border-[#9B3B2E]
            bg-[#9B3B2E] px-5
            text-[13px] font-medium text-white
            shadow-[0_5px_12px_rgba(155,59,46,0.12)]
            transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:scale-[1.03]
            hover:bg-[#852F24]
            hover:shadow-[0_9px_20px_rgba(155,59,46,0.20)]
            active:translate-y-0 active:scale-[0.96]
          "
              >
                Cancel Order
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}