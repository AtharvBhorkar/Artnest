import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Image,
  Palette,
  ShoppingBag,
  Star,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ARTWORKS, Card, PAGE, inr } from "./shared";


// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

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
      icon:
        "bg-[linear-gradient(135deg,#f9eee6_0%,#f1ddd1_100%)]",
      glow:
        "group-hover:shadow-[0_0_28px_rgba(159,86,57,0.13)]",
    },
    {
      icon:
        "bg-[linear-gradient(135deg,#f4efe7_0%,#ebe2d5_100%)]",
      glow:
        "group-hover:shadow-[0_0_28px_rgba(192,138,62,0.12)]",
    },
    {
      icon:
        "bg-[linear-gradient(135deg,#f8ece5_0%,#ecd9ce_100%)]",
      glow:
        "group-hover:shadow-[0_0_28px_rgba(159,86,57,0.13)]",
    },
    {
      icon:
        "bg-[linear-gradient(135deg,#f4efe7_0%,#e7e9dc_100%)]",
      glow:
        "group-hover:shadow-[0_0_28px_rgba(76,107,63,0.10)]",
    },
  ];

  const accent = accents[index % accents.length];

//   const mediumCounts = ARTWORKS.reduce((acc, artwork) => {
//   const medium = artwork.medium || "Other";
//   acc[medium] = (acc[medium] || 0) + 1;
//   return acc;
// }, {});

// const totalArtworks = ARTWORKS.length;

// const mediumData = Object.entries(mediumCounts).map(
//   ([name, count], index) => {
//     const fills = ["#9F5639", "#B8955A", "#6F8F7A", "#8B7465", "#A88B76"];

//     return {
//       name,
//       value: Math.round((count / totalArtworks) * 100),
//       fill: fills[index % fills.length],
//     };
//   }
// );

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

        {/* Label + Value */}
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-[#A28F7D] sm:text-[13px]">
            {label}
          </p>

          <p className="mt-4 font-serif text-[30px] leading-none tracking-[-0.3px] text-[#362F26] sm:text-[33px]">
            {value}
          </p>

          <p className="mt-3 text-[11.5px] text-[#A28F7D] sm:text-[12px]">
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


function ThreeDPieChart({ data }) {
  const cx = 250;
  const cy = 165;
  const radius = 145;
  const yScale = 0.72;
  const depth = 32;

  const polar = (angle, r = radius) => {
    const rad = (angle * Math.PI) / 180;

    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad) * yScale,
    };
  };

  const getTopPath = (startAngle, endAngle) => {
    const start = polar(startAngle);
    const end = polar(endAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${cx} ${cy}
      L ${start.x} ${start.y}
      A ${radius} ${radius * yScale} 0 ${largeArc} 1 ${end.x} ${end.y}
      Z
    `;
  };

  const getSidePath = (startAngle, endAngle) => {
    const startTop = polar(startAngle);
    const endTop = polar(endAngle);

    const startBottom = {
      x: startTop.x,
      y: startTop.y + depth,
    };

    const endBottom = {
      x: endTop.x,
      y: endTop.y + depth,
    };

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${startTop.x} ${startTop.y}
      A ${radius} ${radius * yScale} 0 ${largeArc} 1 ${endTop.x} ${endTop.y}
      L ${endBottom.x} ${endBottom.y}
      A ${radius} ${radius * yScale} 0 ${largeArc} 0 ${startBottom.x} ${startBottom.y}
      Z
    `;
  };

  const slices = [];
  let currentAngle = -90;

  data.forEach((item) => {
    const angle = (item.value / 100) * 360;

    slices.push({
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    });

    currentAngle += angle;
  });

  return (
    <div className="mx-auto w-full max-w-[620px]">
      <svg
        viewBox="0 0 500 410"
        className="h-auto w-full overflow-visible"
      >
        {/* 3D SIDE / EXTRUSION */}
        {slices.map((slice, index) => {
          const start = Math.max(slice.startAngle, 0);
          const end = Math.min(slice.endAngle, 180);

          if (start >= end) return null;

          return (
            <path
              key={`side-${index}`}
              d={getSidePath(start, end)}
              fill={slice.darkFill}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Additional bottom edge for stronger depth */}
        {slices.map((slice, index) => {
          const start = Math.max(slice.startAngle, 0);
          const end = Math.min(slice.endAngle, 180);

          if (start >= end) return null;

          const startPoint = polar(start);
          const endPoint = polar(end);

          return (
            <path
              key={`bottom-${index}`}
              d={`
                M ${startPoint.x} ${startPoint.y + depth}
                A ${radius} ${radius * yScale}
                0 ${end - start > 180 ? 1 : 0} 1
                ${endPoint.x} ${endPoint.y + depth}
              `}
              fill="none"
              stroke={slice.darkFill}
              strokeWidth="3"
            />
          );
        })}

        {/* TOP SURFACE */}
        {slices.map((slice, index) => (
          <path
            key={`slice-${index}`}
            d={getTopPath(slice.startAngle, slice.endAngle)}
            fill={slice.fill}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ))}

        {/* LABELS */}
        {slices.map((slice, index) => {
          const middleAngle =
            (slice.startAngle + slice.endAngle) / 2;

          const labelRadius = radius * 0.58;

          const point = polar(middleAngle, labelRadius);

          return (
            <g key={`label-${index}`}>
              <text
                x={point.x}
                y={point.y - 7}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="600"
                style={{
                  paintOrder: "stroke",
                  stroke: "rgba(0,0,0,0.22)",
                  strokeWidth: "3px",
                  strokeLinejoin: "round",
                }}
              >
                {slice.name}
              </text>

              <text
                x={point.x}
                y={point.y + 11}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="700"
                style={{
                  paintOrder: "stroke",
                  stroke: "rgba(0,0,0,0.22)",
                  strokeWidth: "3px",
                  strokeLinejoin: "round",
                }}
              >
                {slice.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

export default function Dashboard() {
  // ─────────────────────────────────────────────
  // Artwork calculations
  // ─────────────────────────────────────────────

  const published = ARTWORKS.filter(
    (artwork) => artwork.status === "Published"
  ).length;

  const draft = ARTWORKS.filter(
    (artwork) => artwork.status === "Draft"
  ).length;

  const sold = ARTWORKS.filter(
    (artwork) => artwork.status === "Sold"
  ).length;

  const totalArtworks = ARTWORKS.length;

  // Average artwork price
  const averagePrice =
    totalArtworks > 0
      ? ARTWORKS.reduce(
        (sum, artwork) => sum + Number(artwork.price || 0),
        0
      ) / totalArtworks
      : 0;

  // Published percentage
  const publishedRate =
    totalArtworks > 0
      ? Math.round((published / totalArtworks) * 100)
      : 0;

  // Category / medium count
  const categoryCounts = ARTWORKS.reduce((acc, artwork) => {
    const category = artwork.medium || "Other";

    acc[category] = (acc[category] || 0) + 1;

    return acc;
  }, {});

  const mediumData = Object.entries(categoryCounts).map(
  ([name, count], index) => {
    const colors = [
      { fill: "#B8955A", darkFill: "#76572C" },
      { fill: "#A95738", darkFill: "#69301F" },
      { fill: "#71917F", darkFill: "#405B4C" },
      { fill: "#927B6B", darkFill: "#5E4A3E" },
      { fill: "#AA8E78", darkFill: "#695443" },
    ];

    const color = colors[index % colors.length];

    return {
      name,
      value: Math.round((count / totalArtworks) * 100),
      fill: color.fill,
      darkFill: color.darkFill,
    };
  }
);


  // ─────────────────────────────────────────────
  // Dashboard stats
  // ─────────────────────────────────────────────

  const stats = [
    {
      label: "Published artworks",
      value: published,
      note: `${totalArtworks} in total`,
      icon: Image,
    },
    {
      label: "Open orders",
      value: 2,
      note: "Need your attention",
      icon: ShoppingBag,
    },
    {
      label: "Open requests",
      value: 3,
      note: "Custom requests",
      icon: Palette,
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


  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className={PAGE}>

      {/* ═══════════════════════════════════════════
          QUICK STATS
      ═══════════════════════════════════════════ */}

      <div
        className="
          grid
          gap-y-4
          gap-x-6
          sm:grid-cols-2
          lg:grid-cols-3
          lg:gap-x-8
          lg:gap-y-5
        "
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            index={index}
          />
        ))}
      </div>


      {/* ═══════════════════════════════════════════
          ARTWORK STATUS
      ═══════════════════════════════════════════ */}

      <Card
        title="Artwork Status"
        className="
          bg-[linear-gradient(315deg,#fffdfb_0%,#fff8f2_48%,#f8eee6_100%)]
        "
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              label: "Published",
              value: published,
            },
            {
              label: "Draft",
              value: draft,
            },
            {
              label: "Sold",
              value: sold,
            },
            {
              label: "Total artworks",
              value: totalArtworks,
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                rounded-[16px]
                border
                border-[#E8E1DB]
                bg-white/70
                p-4
                shadow-[0_4px_14px_rgba(65,43,31,0.04)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D8C1B4]
                hover:shadow-[0_10px_24px_rgba(65,43,31,0.08)]
              "
            >
              <p className="text-[12px] font-medium text-[#A28F7D]">
                {item.label}
              </p>

              <p className="mt-2 font-serif text-[28px] leading-none text-[#362F26]">
                {item.value}
              </p>
            </motion.div>
          ))}

        </div>
      </Card>


      {/* Artist Insights */}
<motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.15 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
>
  <Card className="overflow-hidden">
    <div className="mb-1">
      <h2 className="text-[18px] font-semibold text-[#362F26]">
        Artist Insights
      </h2>

      <p className="mt-1 text-[13px] text-[#8A796B]">
        Your artwork distribution by medium
      </p>
    </div>

    <div className="flex justify-center px-2 pt-2">
      <svg
        viewBox="0 0 560 450"
        className="h-auto w-full max-w-[650px]"
      >
        {/* Ground shadow */}
        <ellipse
          cx="280"
          cy="382"
          rx="150"
          ry="24"
          fill="rgba(54,47,38,0.12)"
        />

        {/* 3D EXTRUSION */}
        <g>
          {mediumData.map((item, index) => {
            const startAngle =
              -90 +
              mediumData
                .slice(0, index)
                .reduce(
                  (sum, current) =>
                    sum + (current.value / 100) * 360,
                  0
                );

            const endAngle =
              startAngle + (item.value / 100) * 360;

            const startRad =
              (startAngle * Math.PI) / 180;

            const endRad =
              (endAngle * Math.PI) / 180;

            const largeArc =
              endAngle - startAngle > 180 ? 1 : 0;

            const cx = 280;
            const cy = 170;
            const rx = 165;
            const ry = 92;
            const depth = 48;

            const startX = cx + rx * Math.cos(startRad);
            const startY = cy + ry * Math.sin(startRad);

            const endX = cx + rx * Math.cos(endRad);
            const endY = cy + ry * Math.sin(endRad);

            const bottomStartY = startY + depth;
            const bottomEndY = endY + depth;

            return (
              <path
                key={`side-${index}`}
                d={`
                  M ${startX} ${startY}

                  A ${rx} ${ry}
                  0 ${largeArc} 1
                  ${endX} ${endY}

                  L ${endX} ${bottomEndY}

                  A ${rx} ${ry}
                  0 ${largeArc} 0
                  ${startX} ${bottomStartY}

                  Z
                `}
                fill={item.darkFill}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* TOP SURFACE */}
        <g>
          {mediumData.map((item, index) => {
            const startAngle =
              -90 +
              mediumData
                .slice(0, index)
                .reduce(
                  (sum, current) =>
                    sum + (current.value / 100) * 360,
                  0
                );

            const endAngle =
              startAngle + (item.value / 100) * 360;

            const startRad =
              (startAngle * Math.PI) / 180;

            const endRad =
              (endAngle * Math.PI) / 180;

            const largeArc =
              endAngle - startAngle > 180 ? 1 : 0;

            const cx = 280;
            const cy = 170;
            const rx = 165;
            const ry = 92;

            const startX = cx + rx * Math.cos(startRad);
            const startY = cy + ry * Math.sin(startRad);

            const endX = cx + rx * Math.cos(endRad);
            const endY = cy + ry * Math.sin(endRad);

            return (
              <path
                key={`top-${index}`}
                d={`
                  M ${cx} ${cy}

                  L ${startX} ${startY}

                  A ${rx} ${ry}
                  0 ${largeArc} 1
                  ${endX} ${endY}

                  Z
                `}
                fill={item.fill}
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* LABELS */}
        <g>
          {mediumData.map((item, index) => {
            const startAngle =
              -90 +
              mediumData
                .slice(0, index)
                .reduce(
                  (sum, current) =>
                    sum + (current.value / 100) * 360,
                  0
                );

            const endAngle =
              startAngle + (item.value / 100) * 360;

            const middleAngle =
              (startAngle + endAngle) / 2;

            const middleRad =
              (middleAngle * Math.PI) / 180;

            const labelRadius = 92;

            const x =
              280 +
              labelRadius * Math.cos(middleRad);

            const y =
              170 +
              55 * Math.sin(middleRad);

            return (
              <g key={`label-${index}`}>
                <text
                  x={x}
                  y={y - 7}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="600"
                  style={{
                    paintOrder: "stroke",
                    stroke: "rgba(0,0,0,0.28)",
                    strokeWidth: "3px",
                  }}
                >
                  {item.name}
                </text>

                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="700"
                  style={{
                    paintOrder: "stroke",
                    stroke: "rgba(0,0,0,0.28)",
                    strokeWidth: "3px",
                  }}
                >
                  {item.value}%
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  </Card>
</motion.div>

    </div>
  );
}