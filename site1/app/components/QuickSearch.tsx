// app/components/QuickSearch.tsx

import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

interface QuickSearchProps {
  origins: string[];
}

export const QuickSearch = ({ origins }: QuickSearchProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = formData.get("q")?.toString().trim();
    if (q) {
      navigate(`/search/${encodeURIComponent(q)}`);
    }
  }

  return (
    <div className="card-body">
      <h1 className="text-4xl font-bold">
        {t("discoverUniqueNames", "Discover Unique Baby Names")}
      </h1>
      <h2 className="card-title text-2xl">
        {t("quickSearch", "Quick Search")}
      </h2>
      <form onSubmit={handleSubmit} className="mt-2">
        <label
          className="input input-bordered flex items-center gap-2"
          aria-label={t("search", "Search")}
        >
          <input
            type="text"
            name="q"
            placeholder={t("search", "Search")}
            className="grow"
          />
          {/* SVG remains unchanged */}
        </label>
      </form>
      <p className="mt-2">
        {t("orTry", "Or try a")}{" "}
        <a href="/random" className="link link-primary">
          {t("randomName", "Random Name")}
        </a>
        .
      </p>
      <hr className="my-4" />
      <h2 className="card-title text-2xl">
        {t("browseByOrigin", "Browse by Origin")}
      </h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {origins.map((origin) => (
          <a
            key={origin}
            href={`/browse/${origin}`}
            className="badge badge-secondary badge-outline"
          >
            {origin}
          </a>
        ))}
      </div>
    </div>
  );
};
