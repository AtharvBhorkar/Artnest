import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  IndianRupee,
  Palette,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { Badge, Card, PAGE, inr } from "./shared";

const SALES = [
  {
    artwork: "Golden Silence",
    buyer: "Priya Sharma",
    amount: 18500,
    orders: 2,
    status: "Delivered",
  },
  {
    artwork: "Monsoon Reverie",
    buyer: "Rahul Kapoor",
    amount: 32400,
    orders: 1,
    status: "Processing",
  },
  {
    artwork: "Bronze Whisper",
    buyer: "Sneha Iyer",
    amount: 64200,
    orders: 1,
    status: "Shipped",
  },
  {
    artwork: "City in Ochre",
    buyer: "Vikram Nair",
    amount: 28500,
    orders: 1,
    status: "Delivered",
  },
  {
    artwork: "Still Water Study",
    buyer: "Ishaan Joshi",
    amount: 21000,
    orders: 1,
    status: "Delivered",
  },
];

const MONTHS = [
  ["Apr", 24000],
  ["May", 36000],
  ["Jun", 28000],
  ["Jul", 32000],
  ["Aug", 30000],
  ["Sep", 14600],
];

const CATEGORIES = [
  {
    name: "Paintings",
    sales: 92500,
    percentage: 80,
  },
  {
    name: "Illustrations",
    sales: 42100,
    percentage: 62,
  },
  {
    name: "Mixed Media",
    sales: 30200,
    percentage: 46,
  },
];

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="
        group relative overflow-hidden
        rounded-[18px]
        border border-[#E8E1DB]
        bg-[linear-gradient(145deg,#ffffff_0%,#fffaf6_52%,#f8eee7_100%)]
        p-5 sm:p-6
        shadow-[0_6px_18px_rgba(65,43,31,0.04)]
        transition-all duration-300 ease-out
        hover:border-[#D8C1B4]
        hover:shadow-[0_14px_30px_rgba(65,43,31,0.09)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute -right-8 -top-8
          h-24 w-24 rounded-full
          bg-[#D9A184]/10
          blur-2xl
          transition-transform duration-500
          group-hover:scale-125
        "
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#A28F7D]">
            {label}
          </p>

          <p className="mt-2 font-serif text-[30px] leading-[33px] tracking-[-0.025em] text-[#362F26]">
            {value}
          </p>

          <p className="mt-1.5 text-[11.5px] leading-4 text-[#9B8979]">
            {note}
          </p>
        </div>

        <div
          className="
            grid h-11 w-11 shrink-0 place-items-center
            rounded-[14px]
            border border-[#E6D4C8]
            bg-[linear-gradient(135deg,#F7EADF_0%,#EBD4C5_100%)]
            text-[#9F5639]
            shadow-[0_4px_12px_rgba(65,43,31,0.07)]
          "
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      <div
        className="
          absolute inset-x-8 bottom-0 h-px
          scale-x-0
          bg-[linear-gradient(90deg,transparent,#C98C69,transparent)]
          transition-transform duration-300
          group-hover:scale-x-100
        "
      />
    </motion.div>
  );
}

function PerformanceRow({
  artwork,
  buyer,
  amount,
  orders,
  status,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: "easeOut",
      }}
      className="
        group relative overflow-hidden
        rounded-[14px]
        border border-[#E9DFD8]
        bg-[linear-gradient(135deg,#ffffff_0%,#fffdfb_100%)]
        px-3.5 py-3.5
        shadow-[0_2px_8px_rgba(65,43,31,0.04)]
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:border-[#DCC2B3]
        hover:bg-[linear-gradient(135deg,#FFF9F4_0%,#FCEDE3_100%)]
        hover:shadow-[0_10px_24px_rgba(65,43,31,0.11)]
        sm:px-4 sm:py-4
      "
    >
      <div
        className="
          absolute inset-y-2 left-0 w-[3px]
          origin-center scale-y-0
          rounded-r-full
          bg-[linear-gradient(180deg,#C98C69,#9F5639)]
          transition-transform duration-300
          group-hover:scale-y-100
        "
      />

      <div className="flex items-center gap-3">
        <div
          className="
            grid h-10 w-10 shrink-0 place-items-center
            rounded-[12px]
            border border-[#E6D4C8]
            bg-[linear-gradient(135deg,#F7EADF_0%,#EBD4C5_100%)]
            text-[#9F5639]
            shadow-[0_3px_8px_rgba(65,43,31,0.07)]
          "
        >
          <Palette size={17} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              font-serif text-[14.5px]
              tracking-[-0.01em]
              text-[#3E3028]
              transition-colors duration-200
              group-hover:text-[#9F5639]
            "
          >
            {artwork}
          </p>

          <p className="mt-0.5 truncate text-[12px] text-[#8F7D6E]">
            {buyer}
          </p>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-[14px] font-semibold text-[#3E3028]">
            {inr(amount)}
          </p>

          <p className="mt-0.5 text-[11px] text-[#9B8979]">
            {orders} {orders === 1 ? "sale" : "sales"}
          </p>
        </div>

        <Badge status={status} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#EEE5DF] pt-3 sm:hidden">
        <span className="text-[11px] text-[#9B8979]">
          {orders} {orders === 1 ? "sale" : "sales"}
        </span>

        <span className="text-[13px] font-semibold text-[#3E3028]">
          {inr(amount)}
        </span>
      </div>

      <div
        className="
          absolute inset-x-6 bottom-0 h-px
          scale-x-0
          bg-[linear-gradient(90deg,transparent,#D7B09B,transparent)]
          transition-transform duration-300
          group-hover:scale-x-100
        "
      />
    </motion.div>
  );
}

export default function Earnings() {
  const totalSales = useMemo(
    () =>
      SALES.reduce(
        (sum, item) => sum + item.amount,
        0
      ),
    []
  );

  const artworksSold = useMemo(
    () =>
      SALES.reduce(
        (sum, item) => sum + item.orders,
        0
      ),
    []
  );

  const averageSale = artworksSold
    ? Math.round(totalSales / artworksSold)
    : 0;

  const monthlyTotal = useMemo(
    () =>
      MONTHS.reduce(
        (sum, [, value]) => sum + value,
        0
      ),
    []
  );

  const maxMonthlySales = Math.max(
    ...MONTHS.map(([, value]) => value)
  );

  return (
    <div className={PAGE}>
        

      {/* Financial stats */}
      <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5">
        <StatCard
          icon={IndianRupee}
          label="Total sales"
          value={inr(totalSales)}
          note="Value of recorded artwork sales"
        />

        <StatCard
          icon={ShoppingBag}
          label="Artworks sold"
          value={artworksSold}
          note="Recorded artwork sales"
        />

        <StatCard
          icon={BarChart3}
          label="Average sale value"
          value={inr(averageSale)}
          note="Average value per artwork sale"
        />
      </div>

      {/* Monthly sales */}
      <Card
        title={
          <span className="font-serif text-[19px] font-medium tracking-[-0.2px] text-[#362F26] sm:text-[20px]">
            Monthly sales
          </span>
        }
        action={
          <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1px] text-[#4C6B3F]">
            <ArrowUpRight size={14} strokeWidth={2} />
            <span>Sales trend</span>
          </div>
        }
        className="
          w-full
          bg-[linear-gradient(315deg,#fffdfb_0%,#fff8f2_48%,#f8eee6_100%)]
        "
      >
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-[12px] font-medium tracking-[0.1px] text-[#9B8877]">
              Total sales · last 6 months
            </p>

            <p className="mt-1 font-serif text-[28px] leading-none text-[#362F26] sm:text-[31px]">
              {inr(monthlyTotal)}
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
                flex h-full flex-1
                flex-col items-center justify-end
              "
            >
              {/* Value */}
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: 0.2 + index * 0.03,
                  ease: "easeOut",
                }}
                className="
                  mb-3
                  rounded-full
                  border border-[#E7D8CE]
                  bg-[#FFF9F5]
                  px-2.5 py-1
                  text-[10px]
                  font-semibold
                  tracking-[0.2px]
                  text-[#7F4632]
                  shadow-[0_4px_10px_rgba(70,45,32,0.08)]
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:border-[#D8B8A7]
                  group-hover:bg-white
                  group-hover:shadow-[0_7px_16px_rgba(70,45,32,0.12)]
                  sm:text-[11px]
                "
              >
                ₹
                {value >= 100000
                  ? `${(value / 100000).toFixed(1)}L`
                  : `${Math.round(value / 1000)}k`}
              </motion.span>

              {/* Bar */}
              <motion.div
                className="
                  relative
                  w-full
                  max-w-[32px]
                  rounded-t-[10px]
                  bg-[linear-gradient(135deg,#D9A184_0%,#C17A58_22%,#9F5639_65%,#783B2B_100%)]
                  shadow-[inset_3px_0_0_rgba(255,255,255,0.20),0_10px_22px_rgba(159,86,57,0.18),0_0_20px_rgba(201,140,105,0.16)]
                  transform-gpu
                  sm:max-w-[38px]
                  md:max-w-[44px]
                  xl:max-w-[54px]
                "
                initial={{ height: 0 }}
                whileInView={{
                  height: `${(value / maxMonthlySales) * 72}%`,
                }}
                viewport={{ once: true }}
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
                    transition-all duration-300
                    group-hover:bg-[#C98C69]/30
                    group-hover:blur-2xl
                  "
                />

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
                    transition-colors duration-300
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
                  transition-all duration-300
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

      {/* Sales breakdown */}
      <Card
        title={
          <span className="font-serif text-[19px] font-medium tracking-[-0.2px] text-[#362F26] sm:text-[20px]">
            Sales Breakdown
          </span>
        }
        action={
          <span className="text-[12px] text-[#9B8979]">
            By category
          </span>
        }
        className="
          bg-[linear-gradient(145deg,#fffefc_0%,#fcf8f4_55%,#f9f1eb_100%)]
        "
      >
        <div className="space-y-5">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: index * 0.07,
                ease: "easeOut",
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#51453C]">
                  {category.name}
                </span>

                <span className="text-[13px] font-semibold text-[#3E3028]">
                  {inr(category.sales)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#EDE4DE]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${category.percentage}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 + index * 0.08,
                    ease: "easeOut",
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-[linear-gradient(90deg,#C98C69,#9F5639)]
                  "
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Top performing artworks */}
      <Card
        title={
          <span className="font-serif text-[19px] font-medium tracking-[-0.2px] text-[#362F26] sm:text-[20px]">
            Top Performing Artworks
          </span>
        }
        action={
          <Link
            to="/artist/artworks"
            className="
              group
              inline-flex
              cursor-pointer
              items-center
              gap-1
              text-[12px]
              font-medium
              text-[#9F5639]
              transition-all
              duration-200
              hover:gap-1.5
              hover:text-[#7F432C]
            "
          >
            View artworks
            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </Link>
        }
        className="
          bg-[linear-gradient(145deg,#fffefc_0%,#fcf8f4_55%,#f9f1eb_100%)]
        "
      >
        <div className="grid gap-3">
          {SALES.map((item, index) => (
            <PerformanceRow
              key={item.artwork}
              artwork={item.artwork}
              buyer={item.buyer}
              amount={item.amount}
              orders={item.orders}
              status={item.status}
              index={index}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}