import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Image, IndianRupee, MessageCircle,
  Palette,
  Plus,ShoppingBag, Star } from "lucide-react";
import { ARTWORKS, Badge, Card, PAGE, inr } from "./shared";

const MONTHS = [["Apr", 42], ["May", 58], ["Jun", 51], ["Jul", 73], ["Aug", 66], ["Sep", 89]];
const RECENT = [
  { id: "ORD-10245", item: "Golden Silence", buyer: "Priya Sharma", amount: 18500, status: "Delivered" },
  { id: "ORD-10244", item: "Monsoon Reverie", buyer: "Rahul Kapoor", amount: 32400, status: "Processing" },
  { id: "ORD-10243", item: "Bronze Whisper", buyer: "Sneha Iyer", amount: 64200, status: "Shipped" },
];

function StatCard({ label, value, note, icon: Icon, index }) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.25,
  });

  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasEntered(true);
    }
  }, [isInView]);

  const accents = [
    {
      icon: "bg-[linear-gradient(135deg,#f9eee6_0%,#f1ddd1_100%)]",
      glow: "group-hover:shadow-[0_0_28px_rgba(159,86,57,0.13)]",
    },
    {
      icon: "bg-[linear-gradient(135deg,#f4efe7_0%,#ebe2d5_100%)]",
      glow: "group-hover:shadow-[0_0_28px_rgba(192,138,62,0.12)]",
    },
    {
      icon: "bg-[linear-gradient(135deg,#f8ece5_0%,#ecd9ce_100%)]",
      glow: "group-hover:shadow-[0_0_28px_rgba(159,86,57,0.13)]",
    },
    {
      icon: "bg-[linear-gradient(135deg,#f4efe7_0%,#e7e9dc_100%)]",
      glow: "group-hover:shadow-[0_0_28px_rgba(76,107,63,0.10)]",
    },
  ];

  const accent = accents[index % accents.length];

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={
        hasEntered
          ? {
            opacity: 1,
            y: 0,
          }
          : {
            opacity: 0,
            y: 30,
          }
      }
      transition={
        hasEntered
          ? {
            duration: 0.6,
            delay: index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }
          : {
            duration: 0,
          }
      }
      className="
        group
        relative
        overflow-hidden
        rounded-[18px]
        border
        border-[#E8E1DB]
        bg-[linear-gradient(145deg,#ffffff_0%,#fffaf6_52%,#f8eee7_100%)]
        p-5
        shadow-[0_6px_18px_rgba(65,43,31,0.04)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1.5
        hover:border-[#D8C1B4]
        hover:shadow-[0_14px_30px_rgba(65,43,31,0.09)]
        sm:p-6
      "
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-[#f0d6c7]/30
          blur-2xl
          transition-transform
          duration-500
          ease-out
          group-hover:scale-125
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-4">

        {/* Label */}
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-[#A28F7D] sm:text-[13px]">
            {label}
          </p>

          <p className="mt-4 font-serif text-[30px] leading-none tracking-[-0.3px] text-[#362F26] sm:text-[33px]">
            {value}
          </p>

          <p
            className={`mt-3 text-[11.5px] sm:text-[12px] ${index === 0
              ? "font-medium text-[#4C6B3F]"
              : "text-[#A28F7D]"
              }`}
          >
            {index === 0 && "↑ "}
            {note}
          </p>
        </div>

        {/* Icon */}
        <span
          className={`
            grid
            h-11
            w-11
            shrink-0
            place-items-center
            rounded-[14px]
            text-[#9F5639]
            transition-all
            duration-300
            ease-out
            group-hover:scale-105
            ${accent.icon}
            ${accent.glow}
          `}
        >
          <Icon
            size={19}
            strokeWidth={1.9}
          />
        </span>
      </div>

      {/* Bottom accent line */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          bottom-0
          h-[2px]
          origin-left
          scale-x-0
          bg-[linear-gradient(90deg,#9F5639,#C08A3E)]
          transition-transform
          duration-500
          ease-out
          group-hover:scale-x-100
        "
      />
    </motion.div>
  );
}

export default function Dashboard() {
  const published = ARTWORKS.filter((a) => a.status === "Published").length;
  const max = Math.max(...MONTHS.map(([, v]) => v));
  const stats = [
  {
    label: "Total sales",
    value: inr(612000),
    note: "+12% this month",
    icon: IndianRupee,
  },
  {
    label: "Published artworks",
    value: published,
    note: `${ARTWORKS.length} in total`,
    icon: Image,
  },
  {
    label: "Open orders",
    value: 2,
    note: "Need your attention",
    icon: ShoppingBag,
  },
  {
    label: "Average rating",
    value: "4.9",
    note: "From 128 reviews",
    icon: Star,
  },
  {
    label: "Total reviews",
    value: 128,
    note: "Across all artworks",
    icon: Star,
  },
  {
    label: "Order success",
    value: "96%",
    note: "Successful orders",
    icon: CheckCircle2,
  },
];

  return (
    <div className={PAGE}>
      <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-5">
        <Card
          title="Sales overview"
          className="
    w-full
    bg-[linear-gradient(315deg,#fffdfb_0%,#fff8f2_48%,#f8eee6_100%)]
  "
          action={
            <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1px] text-[#4C6B3F]">
              <ArrowUpRight size={14} strokeWidth={2} />
              +12% this month
            </div>
          }
        >
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-[12px] font-medium tracking-[0.1px] text-[#9B8877]">
                Total sales · last 6 months
              </p>

              <p className="mt-1 font-serif text-[28px] leading-none text-[#362F26] sm:text-[31px]">
                {inr(MONTHS.reduce((sum, [, value]) => sum + value, 0) * 1000)}
              </p>
            </div>

            <p className="text-[12px] font-medium tracking-[0.1px] text-[#A28F7D]">
              Monthly performance
            </p>
          </div>

          <div className="flex h-56 items-end gap-2 sm:gap-4">
            {MONTHS.map(([month, value], index) => (
  <div
    key={month}
    className="
      group
      flex
      h-full
      flex-1
      flex-col
      items-center
      justify-end
    "
  >
    {/* Value */}
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.2 + index * 0.03,
        ease: "easeOut",
      }}
      className="
        mb-3
        rounded-full
        border
        border-[#E7D8CE]
        bg-[#FFF9F5]
        px-2.5
        py-1
        text-[10px]
        font-semibold
        tracking-[0.2px]
        text-[#7F4632]
        shadow-[0_4px_10px_rgba(70,45,32,0.08)]
        transition-all
        duration-300
        group-hover:-translate-y-1
        group-hover:border-[#D8B8A7]
        group-hover:bg-white
        group-hover:shadow-[0_7px_16px_rgba(70,45,32,0.12)]
        sm:text-[11px]
      "
    >
      ₹{value}k
    </motion.span>

    {/* Bar */}
    <motion.div
  className="
    relative
    w-full
    max-w-[32px] sm:max-w-[38px] md:max-w-[44px] xl:max-w-[54px]
    rounded-t-[10px]
    bg-[linear-gradient(135deg,#D9A184_0%,#C17A58_22%,#9F5639_65%,#783B2B_100%)]
    shadow-[inset_3px_0_0_rgba(255,255,255,0.20),0_10px_22px_rgba(159,86,57,0.18),0_0_20px_rgba(201,140,105,0.16)]
    transform-gpu
  "
  initial={{ height: 0 }}
  animate={{ height: `${(value / max) * 72}%` }}
  transition={{
    duration: 0.5,
    delay: index * 0.03,
    ease: "easeOut",
  }}
  whileHover={{
    y: -5,
    scaleX: 1.05,
    boxShadow:
      "inset 3px 0 0 rgba(255,255,255,0.28), 0 14px 28px rgba(159,86,57,0.25), 0 0 28px rgba(201,140,105,0.32)",
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  }}
>
  {/* glow */}
  <span
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      -inset-2
      -z-10
      rounded-[14px]
      bg-[#C98C69]/15
      blur-xl
      transition-all
      duration-300
      group-hover:bg-[#C98C69]/30
      group-hover:blur-2xl
    "
  />

  {/* highlight */}
  <span
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      inset-y-1
      left-1
      w-[2px]
      rounded-full
      bg-white/20
      blur-[1px]
      transition-colors
      duration-300
      group-hover:bg-white/35
    "
  />
</motion.div>

    {/* Month */}
    <span
  className="
    mt-3
    text-[11.5px]
    font-medium
    tracking-[0.1px]
    text-[#4A4037]
    transition-all
    duration-300
    group-hover:translate-y-0.5
    group-hover:text-[#9F5639]
    sm:text-[12px]
  "
>
  {month}
</span>
  </div>
))}
          </div>
        </Card>

        <motion.div
  initial={{ opacity: 0, y: 28 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: 0.65,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="w-full"
>
  <Card
    title={
  <span className="font-serif text-[19px] font-medium tracking-[-0.2px] text-[#362F26] sm:text-[20px]">
    Recent orders
  </span>
}
    className="
  h-full
  bg-[linear-gradient(145deg,#fffefc_0%,#fcf8f4_55%,#f9f1eb_100%)]
"
    action={
      <Link
  to="/artist/orders"
  className="
    group
    inline-flex
    items-center
    gap-1.5
    text-[12px]
    font-medium
    tracking-[0.1px]
    text-[#9F5639]
    transition-all
    duration-300
    hover:gap-2
    hover:text-[#7F402C]
    sm:text-[13px]
  "
>
  <span>View all</span>

  <ArrowUpRight
    size={14}
    strokeWidth={1.9}
    className="
      transition-transform
      duration-300
      ease-out
      group-hover:translate-x-0.5
      group-hover:-translate-y-0.5
    "
  />
</Link>
    }
  >
    <div className="space-y-2.5 sm:space-y-3">
      {RECENT.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.45,
            delay: 0.12 + index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="
  group
  relative
  overflow-hidden
  rounded-[14px]
  border
  border-[#E9DFD8]
  bg-[linear-gradient(135deg,#ffffff_0%,#fffdfb_100%)]
  px-3.5
  py-3.5
  cursor-pointer
  shadow-[0_2px_8px_rgba(65,43,31,0.04)]
  transition-all
  duration-300
  ease-out
  hover:-translate-y-1
  hover:border-[#DCC2B3]
  hover:bg-[linear-gradient(135deg,#FFF9F4_0%,#FCEDE3_100%)]
  hover:shadow-[0_10px_24px_rgba(65,43,31,0.11)]
  sm:px-4
  sm:py-4
"
        >
          {/* Hover accent */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-2
              left-0
              w-[3px]
              origin-center
              scale-y-0
              rounded-full
              bg-[linear-gradient(to_bottom,#C98C69,#9F5639)]
              transition-transform
              duration-300
              ease-out
              group-hover:scale-y-100
            "
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Order information */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className="
  truncate
  font-serif
  text-[14px]
  font-medium
  leading-snug
  tracking-[-0.1px]
  text-[#362F26]
  transition-colors
  duration-200
  group-hover:text-[#9F5639]
  sm:text-[15px]
"
                >
                  {order.item}
                </p>
              </div>

              <p className="mt-1 truncate text-[11.5px] font-medium leading-relaxed text-[#927F72] sm:text-[12px]">
                {order.buyer}
                <span className="mx-1.5 text-[#D2C3B8]">·</span>
                {inr(order.amount)}
              </p>

              <p className="mt-1 text-[10px] font-medium tracking-[0.35px] text-[#AD9C90]">
                {order.id}
              </p>
            </div>

            {/* Status */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-3
                sm:justify-end
              "
            >
              <Badge status={order.status} />

            </div>
          </div>

          {/* Bottom hover glow */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-6
              bottom-0
              h-px
              origin-left
              scale-x-0
              bg-[linear-gradient(90deg,transparent,#D7B09B,transparent)]
              transition-transform
              duration-500
              ease-out
              group-hover:scale-x-100
            "
          />
        </motion.div>
      ))}
    </div>
  </Card>
</motion.div>
      </div>
    </div>
  );
}