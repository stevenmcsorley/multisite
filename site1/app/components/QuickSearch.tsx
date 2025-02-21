import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export const QuickSearch = () => {
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
      <h2 className="card-title text-2xl text-color-primary">
        {t("quickSearch", "Quick Search")}
      </h2>
      <form onSubmit={handleSubmit} className="mt-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            placeholder={t("search", "Search")}
            className="input input-bordered grow"
            aria-label={t("search", "Search")}
          />
          <button type="submit" className="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <span className="sr-only">{t("search", "Search")}</span>
          </button>
        </div>
      </form>
      <p className="mt-2">
        {t("orTry", "Or try a")}{" "}
        <a href="/random" className="link link-primary">
          {t("randomName", "Random Name")}
        </a>
        .
      </p>
    </div>
  );
};
