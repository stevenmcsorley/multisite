import type { Stats } from "~/models/stats.server";
import { useTranslation } from "react-i18next";

interface StatsCardProps {
  stats: Stats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <div className="stats bg-base-100 shadow-lg rounded-lg flex flex-col items-center p-6">
        <div className="stat">
          <div className="stat-title text-lg font-semibold text-center">
            {t("totalNames", "Total Names")}
          </div>
          <div className="stat-value text-4xl font-bold">
            {stats.total_names}
          </div>
          <div className="stat-desc text-sm">
            {t("averageLength", "Average length")}: {stats.avg_len.toFixed(2)}{" "}
            {t("chars", "chars")}
          </div>
        </div>
      </div>
      <div className="stats bg-base-100 shadow-lg rounded-lg flex flex-col items-center p-6">
        <div className="stat">
          <div className="stat-title text-lg font-semibold text-center">
            {t("distinctOrigins", "Distinct Origins")}
          </div>
          <div className="stat-value text-4xl font-bold">
            {stats.distinct_origins}
          </div>
          <div className="stat-desc text-sm">
            {t("highestCount", "Highest count")}:{" "}
            {stats.top_origins.length > 0 ? (
              <a
                href={`/browse/${stats.top_origins[0].origin}`}
                className="link link-primary"
              >
                {stats.top_origins[0].origin} ({stats.top_origins[0].count})
              </a>
            ) : (
              "n/a"
            )}
          </div>
        </div>
      </div>
      <div className="stats bg-base-100 shadow-lg rounded-lg flex flex-col items-center p-6">
        <div className="stat">
          <div className="stat-title text-lg font-semibold text-center">
            {t("withMeaning", "With Meaning")}
          </div>
          <div className="stat-value text-4xl font-bold">
            {stats.with_meaning}
          </div>
          <div className="stat-desc text-sm">
            {t("withoutMeaning", "Without meaning")}: {stats.no_meaning}
          </div>
        </div>
      </div>
    </section>
  );
}
