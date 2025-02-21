import { useTranslation } from "react-i18next";

interface OriginsListProps {
  origins: string[];
}

export default function OriginsList({ origins }: OriginsListProps) {
  const { t } = useTranslation();

  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {t("browseByOrigin", "Browse by Origin")}
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {origins.map((origin) => (
          <a
            key={origin}
            href={`/browse/${origin}`}
            className="badge badge-secondary badge-outline text-lg p-2 hover:bg-secondary hover:text-white transition"
          >
            {origin}
          </a>
        ))}
      </div>
    </div>
  );
}
