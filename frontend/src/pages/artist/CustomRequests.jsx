import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  Palette,
  ClipboardList,
  Sparkles,
  XCircle,
} from "lucide-react";
import { inputCls, btnPrimary, btnGhost } from "./shared";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const STEPS = ["Not started", "Sketching", "In progress", "Finishing"];

const INITIAL = [
  {
    id: "CR-501",
    title: "Portrait Commission",
    customer: "Priya Sharma",
    requested: "18 Sep 2026",
    budget: 45000,
    deadline: "05 Oct 2026",
    status: "New",
    quote: "",
    eta: "",
    note: "",
    progress: 0,
  },
  {
    id: "CR-497",
    title: "Family Portrait",
    customer: "Ishaan Joshi",
    requested: "10 Sep 2026",
    budget: 52000,
    deadline: "01 Oct 2026",
    status: "In Progress",
    quote: 52000,
    eta: "Ready by 20 Nov",
    note: "Sketch approved, colour layers are underway.",
    progress: 2,
  },
  {
    id: "CR-490",
    title: "Landscape Commission",
    customer: "Rohit Malhotra",
    requested: "30 Aug 2026",
    budget: 34000,
    deadline: "15 Sep 2026",
    status: "Completed",
    quote: 34000,
    eta: "Delivered 10 Sep",
    note: "",
    progress: 4,
  },
];

const TONE = {
  New: "border-[#E8D8B9] bg-[linear-gradient(135deg,#FFF7E8_0%,#F6E7D0_100%)] text-[#8A5A22]",
  "In Progress":
    "border-[#D4E0E5] bg-[linear-gradient(135deg,#F1F5F7_0%,#DFE9ED_100%)] text-[#4E6873]",
  Completed:
    "border-[#D6E2CC] bg-[linear-gradient(135deg,#F1F6EC_0%,#E2EBDD_100%)] text-[#4C6B3F]",
  Declined:
    "border-[#EBCFC9] bg-[linear-gradient(135deg,#FFF0ED_0%,#F6DFDA_100%)] text-[#9B3B2E]",
};

const STATUS_ICON = {
  New: Clock3,
  "In Progress": Palette,
  Completed: CheckCircle2,
  Declined: XCircle,
};

const softEase = [0.22, 1, 0.36, 1];

const fieldLabel =
  "mb-2 block text-[12px] font-semibold tracking-[0.025em] text-[#796456]";

function StatusBadge({ status }) {
  const Icon = STATUS_ICON[status] || Clock3;

  return (
    <motion.span
      layout
      className={`
        inline-flex shrink-0 items-center gap-1.5 rounded-full
        border px-3 py-1.5 text-[11.5px] font-semibold
        shadow-[0_2px_6px_rgba(65,43,31,0.04)]
        sm:text-[12px]
        ${TONE[status] || TONE.New}
      `}
    >
      <Icon size={13} strokeWidth={2} />
      {status}
    </motion.span>
  );
}

function StatCard({ label, value, Icon, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: softEase,
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="
        group relative overflow-hidden rounded-2xl
        border border-[#E9DED6]
        bg-[linear-gradient(145deg,#FFFFFF_0%,#FFFCF9_100%)]
        p-4 shadow-[0_4px_14px_rgba(65,43,31,0.035)]
        transition-[border-color,box-shadow] duration-300
        hover:border-[#DCC4B5]
        hover:shadow-[0_12px_26px_rgba(65,43,31,0.075)]
        sm:p-5
      "
    >
      <div
        className={`absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-40 blur-2xl ${accent}`}
      />

      <div className="relative flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium leading-5 text-[#8E796B] sm:text-[13px]">
          {label}
        </span>

        <span
          className="
            grid h-10 w-10 shrink-0 place-items-center rounded-xl
            border border-[#EAE0D7] bg-[#FAF3ED]
            text-[#9F5639]
            transition-transform duration-300
            group-hover:scale-105
          "
        >
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>

      <p className="relative mt-3 font-serif text-[29px] leading-none tracking-[-0.03em] text-[#362F26] sm:text-[32px]">
        {value}
      </p>
    </motion.div>
  );
}

export default function CustomRequests() {
  const [requests, setRequests] = useState(INITIAL);

  const update = (id, patch) =>
    setRequests((rs) =>
      rs.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );

  const stats = [
    {
      label: "Total requests",
      value: requests.length,
      Icon: Palette,
      accent: "bg-[#EBD4C5]",
    },
    {
      label: "Awaiting response",
      value: requests.filter((r) => r.status === "New").length,
      Icon: Clock3,
      accent: "bg-[#F2DEB9]",
    },
    {
      label: "In progress",
      value: requests.filter((r) => r.status === "In Progress").length,
      Icon: ClipboardList,
      accent: "bg-[#DCE8EB]",
    },
    {
      label: "Completed",
      value: requests.filter((r) => r.status === "Completed").length,
      Icon: CheckCircle2,
      accent: "bg-[#DEE8D5]",
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="
        min-h-full
        bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF6F1_46%,#FFFFFF_100%)]
      ">
        <div className="mx-auto max-w-[1400px] space-y-7 p-4 sm:space-y-8 sm:p-6 lg:p-7">

          {/* Page heading */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: softEase }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >

            <div className="
              inline-flex w-fit items-center gap-2 rounded-xl
              border border-[#E9DED6] bg-white/80
              px-3.5 py-2.5 text-[12px] text-[#796456]
              shadow-[0_3px_10px_rgba(65,43,31,0.035)]
            ">
              <CircleDollarSign size={16} className="text-[#9F5639]" />
              <span>
                <strong className="font-semibold text-[#4B382E]">
                  {requests.filter((r) => r.status === "New").length}
                </strong>{" "}
                new requests to review
              </span>
            </div>
          </motion.header>

          {/* Summary cards */}
          <section
            aria-label="Request summary"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
          >
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                {...stat}
                index={index}
              />
            ))}
          </section>

          {/* Section heading */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              <h2 className="font-serif text-[21px] tracking-[-0.02em] text-[#362F26] sm:text-[23px]">
                Your commissions
              </h2>
              <p className="mt-1 text-[12px] text-[#9A8678] sm:text-[13px]">
                Review each request and keep its progress up to date.
              </p>
            </div>

            <span className="
              shrink-0 rounded-full border border-[#E8DDD5]
              bg-white px-3 py-1.5 text-[11px] font-medium
              text-[#806B5D] shadow-[0_2px_6px_rgba(65,43,31,0.035)]
            ">
              {requests.length} total
            </span>
          </div>

          {/* Request cards */}
          <motion.div layout className="space-y-5 sm:space-y-6">
            {requests.map((r, index) => (
              <motion.article
                layout
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  layout: { duration: 0.3, ease: softEase },
                  opacity: {
                    duration: 0.4,
                    delay: index * 0.08,
                  },
                  y: {
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: softEase,
                  },
                }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="
                  group relative overflow-hidden rounded-[20px]
                  border border-[#E8DDD5]
                  bg-[linear-gradient(145deg,#FFFFFF_0%,#FFFCFA_62%,#FBF4EE_100%)]
                  shadow-[0_5px_18px_rgba(65,43,31,0.04)]
                  transition-[border-color,box-shadow] duration-300
                  hover:border-[#D9C2B3]
                  hover:shadow-[0_14px_32px_rgba(65,43,31,0.085)]
                "
              >
                {/* Subtle card accent */}
                <div className="
                  absolute inset-x-0 top-0 h-[3px]
                  origin-left scale-x-0
                  bg-[linear-gradient(90deg,#9F5639_0%,#D1A486_55%,#EAD8C7_100%)]
                  transition-transform duration-500 ease-out
                  group-hover:scale-x-100
                " />

                <div className="p-4 sm:p-6 lg:p-7">

                  {/* Card heading */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="
                        grid h-11 w-11 shrink-0 place-items-center
                        rounded-[14px] border border-[#E9D9CC]
                        bg-[linear-gradient(145deg,#FBF1E8_0%,#F1E0D3_100%)]
                        text-[#9F5639]
                        shadow-[0_3px_8px_rgba(65,43,31,0.035)]
                        transition-transform duration-300
                        group-hover:scale-105
                      ">
                        <Palette size={20} strokeWidth={1.7} />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A28F7D]">
                            {r.id}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-[#D5C2B4]" />
                          <span className="text-[11px] text-[#9A8678]">
                            Requested {r.requested}
                          </span>
                        </div>

                        <h3 className="
                          break-words font-serif text-[19px]
                          leading-snug tracking-[-0.015em]
                          text-[#362F26] sm:text-[21px]
                        ">
                          {r.title}
                        </h3>

                        <p className="mt-1.5 text-[12px] text-[#897668] sm:text-[13px]">
                          Requested by{" "}
                          <span className="font-semibold text-[#5D493D]">
                            {r.customer}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:pt-1 sm:pl-3">
                      <StatusBadge status={r.status} />
                    </div>
                  </div>

                  {/* Request details */}
                  <div className="
                    mt-6 grid grid-cols-1 gap-3
                    sm:grid-cols-2 lg:grid-cols-3
                  ">
                    <div className="
                      flex min-w-0 items-center gap-3 rounded-xl
                      border border-[#EAE1DA] bg-white/75 p-3.5
                      transition-colors duration-200
                      hover:border-[#DCC5B6] hover:bg-white
                    ">
                      <span className="
                        grid h-9 w-9 shrink-0 place-items-center
                        rounded-lg bg-[#F8EFE7] text-[#9F5639]
                      ">
                        <CircleDollarSign size={17} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A28F7D]">
                          Buyer budget
                        </p>
                        <p className="mt-1 truncate text-[14px] font-semibold text-[#40352D]">
                          {inr(r.budget)}
                        </p>
                      </div>
                    </div>

                    <div className="
                      flex min-w-0 items-center gap-3 rounded-xl
                      border border-[#EAE1DA] bg-white/75 p-3.5
                      transition-colors duration-200
                      hover:border-[#DCC5B6] hover:bg-white
                    ">
                      <span className="
                        grid h-9 w-9 shrink-0 place-items-center
                        rounded-lg bg-[#F8EFE7] text-[#9F5639]
                      ">
                        <CalendarDays size={17} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A28F7D]">
                          Requested deadline
                        </p>
                        <p className="mt-1 truncate text-[14px] font-semibold text-[#40352D]">
                          {r.deadline}
                        </p>
                      </div>
                    </div>

                    {r.status !== "New" && r.quote !== "" && (
                      <div className="
                        flex min-w-0 items-center gap-3 rounded-xl
                        border border-[#EAE1DA] bg-white/75 p-3.5
                        transition-colors duration-200
                        hover:border-[#DCC5B6] hover:bg-white
                      ">
                        <span className="
                          grid h-9 w-9 shrink-0 place-items-center
                          rounded-lg bg-[#F8EFE7] text-[#9F5639]
                        ">
                          <CheckCircle2 size={17} />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A28F7D]">
                            Your quote
                          </p>
                          <p className="mt-1 truncate text-[14px] font-semibold text-[#40352D]">
                            {inr(r.quote)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status-dependent content */}
                  <div className="mt-6 border-t border-[#EAE1DA] pt-5">

                    {/* New request */}
                    {r.status === "New" && (
                      <div className="
                        rounded-2xl border border-[#EAE0D7]
                        bg-[linear-gradient(145deg,#FFFCF9_0%,#F9F2EC_100%)]
                        p-4 sm:p-5
                      ">
                        <div className="mb-5 flex items-start gap-3">
                          <span className="
                            grid h-9 w-9 shrink-0 place-items-center
                            rounded-xl border border-[#E7D5C7]
                            bg-white text-[#9F5639]
                          ">
                            <ClipboardList size={17} strokeWidth={1.8}/>
                          </span>

                          <div>
                            <h4 className="text-[14px] font-semibold text-[#49372D]">
                              Review this commission
                            </h4>
                            <p className="mt-1 text-[12px] leading-5 text-[#927D6E]">
                              Set your price and expected timeline before
                              accepting the request.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block min-w-0">
                            <span className={fieldLabel}>
                              Your quote (₹)
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={r.quote}
                              onChange={(e) =>
                                update(r.id, { quote: e.target.value })
                              }
                              placeholder="Enter your price"
                              aria-label="Your quote"
                              className={`
                                ${inputCls}
                                transition-[border-color,box-shadow,background-color]
                                duration-200 hover:border-[#D5B5A3]
                                focus:shadow-[0_0_0_3px_rgba(159,86,57,0.08)]
                              `}
                            />
                          </label>

                          <label className="block min-w-0">
                            <span className={fieldLabel}>
                              Start date / ETA
                            </span>
                            <input
                              value={r.eta}
                              onChange={(e) =>
                                update(r.id, { eta: e.target.value })
                              }
                              placeholder="e.g. Starts 12 Oct"
                              aria-label="Start date or ETA"
                              className={`
                                ${inputCls}
                                transition-[border-color,box-shadow,background-color]
                                duration-200 hover:border-[#D5B5A3]
                                focus:shadow-[0_0_0_3px_rgba(159,86,57,0.08)]
                              `}
                            />
                          </label>

                          <label className="block sm:col-span-2">
                            <span className={fieldLabel}>
                              Message to buyer
                            </span>
                            <input
                              value={r.note}
                              onChange={(e) =>
                                update(r.id, { note: e.target.value })
                              }
                              placeholder="Write a message or explain why you are declining"
                              aria-label="Message to buyer"
                              className={`
                                ${inputCls}
                                transition-[border-color,box-shadow,background-color]
                                duration-200 hover:border-[#D5B5A3]
                                focus:shadow-[0_0_0_3px_rgba(159,86,57,0.08)]
                              `}
                            />
                          </label>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 border-t border-[#E9DED5] pt-4 sm:flex-row sm:items-center">
                          <motion.button
                            type="button"
                            disabled={!r.quote || !r.eta}
                            onClick={() =>
                              update(r.id, {
                                status: "In Progress",
                                progress: 0,
                              })
                            }
                            whileHover={
                              r.quote && r.eta
                                ? { y: -2, scale: 1.025 }
                                : undefined
                            }
                            whileTap={
                              r.quote && r.eta
                                ? { scale: 0.97 }
                                : undefined
                            }
                            transition={{ duration: 0.2 }}
                            className={`
                              ${btnPrimary}
                              inline-flex h-11 items-center justify-center
                              gap-2 shadow-[0_4px_10px_rgba(159,86,57,0.12)]
                              transition-all duration-200
                              hover:shadow-[0_9px_18px_rgba(159,86,57,0.2)]
                              disabled:cursor-not-allowed
                              disabled:opacity-45
                              sm:min-w-[142px]
                            `}
                          >
                            <Check size={16} />
                            Accept request
                            <ArrowRight size={15} />
                          </motion.button>

                          <motion.button
                            type="button"
                            onClick={() =>
                              update(r.id, { status: "Declined" })
                            }
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className={`
                              ${btnGhost}
                              inline-flex h-11 items-center justify-center
                              gap-2 transition-all duration-200
                              hover:border-[#E5B8AF]
                              hover:bg-[#FFF0ED]
                              hover:text-[#9B3B2E]
                              sm:min-w-[120px]
                            `}
                          >
                            <XCircle size={16} />
                            Decline
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* In-progress request */}
                    {r.status === "In Progress" && (
                      <div className="
                        rounded-2xl border border-[#E1E5E3]
                        bg-[linear-gradient(145deg,#FFFFFF_0%,#F7F9F7_100%)]
                        p-4 sm:p-5
                      ">
                        <div className="mb-5 flex items-start gap-3">
                          <span className="
                            grid h-9 w-9 shrink-0 place-items-center
                            rounded-xl border border-[#D6E2D9]
                            bg-[#EFF5F0] text-[#52745A]
                          ">
                            <Palette size={17} />
                          </span>

                          <div>
                            <h4 className="text-[14px] font-semibold text-[#403D32]">
                              Commission progress
                            </h4>
                            <p className="mt-1 text-[12px] leading-5 text-[#8A877B]">
                              Select the current stage to keep the buyer
                              informed of your work.
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div
                          className="mb-4 flex gap-1.5"
                          aria-label={`Progress stage ${r.progress + 1} of ${STEPS.length}`}
                        >
                          {STEPS.map((step, i) => (
                            <motion.div
                              key={step}
                              className={`h-1.5 flex-1 rounded-full ${
                                i <= r.progress
                                  ? "bg-[#9F5639]"
                                  : "bg-[#EAE1DA]"
                              }`}
                              animate={{
                                opacity: i <= r.progress ? 1 : 0.65,
                              }}
                              transition={{ duration: 0.25 }}
                            />
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {STEPS.map((s, i) => {
                            const selected = r.progress === i;

                            return (
                              <motion.button
                                key={s}
                                type="button"
                                aria-pressed={selected}
                                onClick={() =>
                                  update(r.id, { progress: i })
                                }
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.18 }}
                                className={`
                                  inline-flex min-h-10 items-center gap-2
                                  rounded-full border px-3.5 py-2
                                  text-[12px] font-medium
                                  transition-[background-color,border-color,color,box-shadow]
                                  duration-200 sm:px-4 sm:text-[13px]
                                  ${
                                    selected
                                      ? "border-[#9F5639] bg-[#9F5639] text-white shadow-[0_4px_10px_rgba(159,86,57,0.15)]"
                                      : "border-[#E8DDD5] bg-white text-[#79685C] hover:border-[#D5B5A3] hover:bg-[#FBF2EB] hover:text-[#9F5639]"
                                  }
                                `}
                              >
                                {selected && <Check size={14} />}
                                {s}
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="mt-5 grid gap-4 border-t border-[#E7EAE6] pt-5 sm:grid-cols-2">
                          <label className="block min-w-0">
                            <span className={fieldLabel}>
                              Expected completion
                            </span>
                            <input
                              value={r.eta}
                              onChange={(e) =>
                                update(r.id, { eta: e.target.value })
                              }
                              placeholder="e.g. Ready by 20 Nov"
                              aria-label="Start date or ETA"
                              className={`
                                ${inputCls}
                                transition-[border-color,box-shadow]
                                duration-200 hover:border-[#D5B5A3]
                                focus:shadow-[0_0_0_3px_rgba(159,86,57,0.08)]
                              `}
                            />
                          </label>

                          <label className="block min-w-0">
                            <span className={fieldLabel}>
                              Progress update for buyer
                            </span>
                            <input
                              value={r.note}
                              onChange={(e) =>
                                update(r.id, { note: e.target.value })
                              }
                              placeholder="Write a short work update"
                              aria-label="Update for buyer"
                              className={`
                                ${inputCls}
                                transition-[border-color,box-shadow]
                                duration-200 hover:border-[#D5B5A3]
                                focus:shadow-[0_0_0_3px_rgba(159,86,57,0.08)]
                              `}
                            />
                          </label>
                        </div>

                        <div className="mt-5 border-t border-[#E7EAE6] pt-4">
                          <motion.button
                            type="button"
                            onClick={() =>
                              update(r.id, {
                                status: "Completed",
                                progress: 4,
                              })
                            }
                            whileHover={{ y: -2, scale: 1.025 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className={`
                              ${btnPrimary}
                              inline-flex h-11 items-center justify-center
                              gap-2 shadow-[0_4px_10px_rgba(159,86,57,0.12)]
                              transition-all duration-200
                              hover:shadow-[0_9px_18px_rgba(159,86,57,0.2)]
                            `}
                          >
                            <CheckCircle2 size={16} />
                            Mark completed
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Completed request */}
                    {r.status === "Completed" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="
                          flex items-start gap-3 rounded-2xl
                          border border-[#D9E4D2]
                          bg-[linear-gradient(135deg,#F4F8F0_0%,#E8F0E3_100%)]
                          p-4 sm:p-5
                        "
                      >
                        <CheckCircle2
                          size={21}
                          className="mt-0.5 shrink-0 text-[#58754B]"
                        />
                        <div>
                          <h4 className="text-[13px] font-semibold text-[#4C6B3F]">
                            Commission completed
                          </h4>
                          <p className="mt-1 text-[12px] leading-5 text-[#718267]">
                            This request has been marked as complete.
                            Your commission details remain available here.
                          </p>
                          {r.eta && (
                            <p className="mt-2 text-[12px] font-medium text-[#58754B]">
                              {r.eta}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Declined request */}
                    {r.status === "Declined" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="
                          flex items-start gap-3 rounded-2xl
                          border border-[#EBCFC9]
                          bg-[linear-gradient(135deg,#FFF6F3_0%,#F9E7E2_100%)]
                          p-4 sm:p-5
                        "
                      >
                        <XCircle
                          size={21}
                          className="mt-0.5 shrink-0 text-[#9B3B2E]"
                        />
                        <div>
                          <h4 className="text-[13px] font-semibold text-[#9B3B2E]">
                            Request declined
                          </h4>
                          <p className="mt-1 text-[12px] leading-5 text-[#9A6B61]">
                            This commission has been declined and is no
                            longer awaiting your response.
                          </p>
                          {r.note && (
                            <p className="mt-2 break-words text-[12px] leading-5 text-[#895B51]">
                              Message: {r.note}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Empty state */}
          {requests.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                rounded-[20px] border border-dashed border-[#DCC9BC]
                bg-white/75 px-5 py-14 text-center
              "
            >
              <span className="
                mx-auto grid h-14 w-14 place-items-center
                rounded-2xl border border-[#E8D8CC]
                bg-[#FAF0E8] text-[#9F5639]
              ">
                <Palette size={25} />
              </span>
              <h3 className="mt-4 font-serif text-[20px] text-[#362F26]">
                No custom requests yet
              </h3>
              <p className="mx-auto mt-2 max-w-[360px] text-[13px] leading-6 text-[#958073]">
                New commissions will appear here when buyers request
                artwork from you.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}