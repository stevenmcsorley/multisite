// app/components/StatsCard.tsx

import type { Stats } from "~/models/stats.server";
import { useTranslation } from "react-i18next";

interface StatsCardProps {
  stats: Stats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const { t } = useTranslation();

  return (
    <div className="stats stats-vertical shadow bg-base-100 w-full">
      {/* 1) Total Names */}
      <div className="stat">
        <div className="stat-title">{t("totalNames", "Total Names")}</div>
        <div className="stat-value">{stats.total_names}</div>
        <div className="stat-desc">
          {t("averageLength", "Average length")}: {stats.avg_len.toFixed(2)}{" "}
          {t("chars", "chars")}
        </div>
      </div>

      {/* 2) Distinct Origins */}
      <div className="stat">
        <div className="stat-title">
          {t("distinctOrigins", "Distinct Origins")}
        </div>
        <div className="stat-value">{stats.distinct_origins}</div>
        <div className="stat-desc">
          {t("highestCount", "Highest count")}:{" "}
          {stats.top_origins.length > 0 ? (
            <a
              href={`/browse/${stats.top_origins[0].origin}`}
              className="link link-primary"
            >
              {stats.top_origins[0].origin} (
              <span className="badge badge-info">
                {stats.top_origins[0].count}
              </span>
              )
            </a>
          ) : (
            "n/a"
          )}
        </div>
      </div>

      {/* 3) With / Without Meaning */}
      <div className="stat">
        <div className="stat-title">{t("withMeaning", "With Meaning")}</div>
        <div className="stat-value">{stats.with_meaning}</div>
        <div className="stat-desc">
          {t("withoutMeaning", "Without meaning")}: {stats.no_meaning}
        </div>
      </div>

      {/* 4) Famous / Historic / Facts */}
      <div className="stat">
        <div className="stat-title">
          {t("famousHistoric", "Famous People / Historic Figures")}
        </div>
        <div className="stat-value">
          {stats.with_famous} / {stats.with_historic}
        </div>
        <div className="stat-desc">
          {t("interestingFacts", "Interesting Facts")}: {stats.with_facts}
        </div>
      </div>

      {/* Enriched Records */}
      <div className="stat place-items-start w-full mt-4">
        <div className="stat-title text-lg font-semibold">
          {t("enrichedRecords", "Enriched Records")}
        </div>
        <div className="stat-value">{stats.enriched_count}</div>
        <div className="stat-desc">
          {stats.last_enriched_names.length > 0 ? (
            <ul className="list-inside list-disc ml-4 mt-1 text-base">
              {stats.last_enriched_names.map((name) => (
                <li key={name}>
                  <a
                    href={`/name/${encodeURIComponent(name)}`}
                    className="link link-primary"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            t("noEnrichedRecords", "No enriched records")
          )}
        </div>
      </div>

      {/* Top 10 Origins */}
      <div className="stat place-items-start w-full mt-4">
        <div className="stat-title text-lg font-semibold">
          {t("top10Origins", "Top 10 Origins")}
        </div>
        <ul className="list-inside list-disc ml-4 mt-1">
          {stats.top_origins.map(({ origin, count }) => (
            <li key={origin}>
              <a href={`/browse/${origin}`} className="link link-primary">
                {origin}
              </a>
              : <span className="badge badge-info">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Longest Names (top 3) */}
      <div className="stat place-items-start w-full mt-2">
        <div className="stat-title text-lg font-semibold">
          {t("longestNames", "Longest Names (top 3)")}
        </div>
        <ul className="list-inside list-disc ml-4 mt-1">
          {stats.longest_names.map(({ name, length }) => (
            <li key={name}>
              <a
                href={`/name/${encodeURIComponent(name)}`}
                className="link link-primary"
              >
                {name}
              </a>{" "}
              (<span className="badge badge-success">{length}</span>{" "}
              {t("chars", "chars")})
            </li>
          ))}
        </ul>
      </div>

      {/* Shortest Names (top 3) */}
      <div className="stat place-items-start w-full mt-2">
        <div className="stat-title text-lg font-semibold">
          {t("shortestNames", "Shortest Names (top 3)")}
        </div>
        <ul className="list-inside list-disc ml-4 mt-1">
          {stats.shortest_names.map(({ name, length }) => (
            <li key={name}>
              <a
                href={`/name/${encodeURIComponent(name)}`}
                className="link link-primary"
              >
                {name}
              </a>{" "}
              (<span className="badge badge-warning">{length}</span>{" "}
              {t("chars", "chars")})
            </li>
          ))}
        </ul>
      </div>

      {/* Top 10 Words in Meanings */}
      <div className="stat place-items-start w-full mt-2">
        <div className="stat-title text-lg font-semibold">
          {t("top10WordsInMeanings", "Top 10 Words in Meanings")}
        </div>
        <ul className="list-inside list-disc ml-4 mt-1">
          {stats.common_words.map(({ word, freq }) => (
            <li key={word}>
              <a
                href={`/search/${encodeURIComponent(word)}`}
                className="link link-primary"
              >
                {word}
              </a>
              : <span className="badge badge-error">{freq}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
