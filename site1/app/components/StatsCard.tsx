import { FaBook, FaChartLine, FaGlobe } from "react-icons/fa";

import type { Stats } from "~/models/stats.server";
import { useTranslation } from "react-i18next";

interface StatsCardProps {
  stats: Stats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const { t } = useTranslation();

  const statItems = [
    {
      title: t("totalNames", "Total Names"),
      value: stats.total_names,
      desc: `${t("averageLength", "Average length")}: ${stats.avg_len.toFixed(
        2
      )} ${t("chars", "chars")}`,
      icon: <FaChartLine className="text-blue-500 text-4xl" />,
    },
    {
      title: t("distinctOrigins", "Distinct Origins"),
      value: stats.distinct_origins,
      desc:
        stats.top_origins.length > 0 ? (
          <a
            href={`/browse/${stats.top_origins[0].origin}`}
            className="text-blue-500 font-semibold"
          >
            {stats.top_origins[0].origin} ({stats.top_origins[0].count})
          </a>
        ) : (
          "n/a"
        ),
      icon: <FaGlobe className="text-green-500 text-4xl" />,
    },
    {
      title: t("withMeaning", "With Meaning"),
      value: stats.with_meaning,
      desc: `${t("withoutMeaning", "Without meaning")}: ${stats.no_meaning}`,
      icon: <FaBook className="text-purple-500 text-4xl" />,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-xl"
        >
          {item.icon}
          <div className="stat-title text-lg font-semibold mt-3">
            {item.title}
          </div>
          <div className="stat-value text-4xl font-bold text-gray-800">
            {item.value}
          </div>
          <div className="stat-desc text-sm text-gray-600 mt-1">
            {item.desc}
          </div>
        </div>
      ))}
    </section>
  );
}
