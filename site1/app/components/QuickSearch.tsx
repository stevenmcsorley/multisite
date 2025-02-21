import { useRef, useState } from "react";

import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export const QuickSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State for the search query and suggestions list.
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions from the API.
  const fetchSuggestions = async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/search-suggestions?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  // Debounce the API call on input changes.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle form submission.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search/${encodeURIComponent(trimmed)}`);
    }
  };

  // Navigate on suggestion click.
  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/search/${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="card-body">
      <h2 className="card-title text-2xl text-color-primary">
        {t("quickSearch", "Quick Search")}
      </h2>
      <form onSubmit={handleSubmit} className="mt-2 relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            placeholder={t("search", "Search")}
            className="input input-bordered grow text-white"
            aria-label={t("search", "Search")}
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
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
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-base-100 border border-base-300 rounded mt-1 w-full max-h-60 overflow-y-auto text-white">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSuggestionClick(suggestion);
                  }
                }}
                className="p-2 text-white hover:bg-base-200 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
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
