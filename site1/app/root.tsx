// app/root.tsx
import "./styles/tailwind.css";
import "./i18n"; // Import and initialize i18next

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import AdScript from "./components/AdScript";
import { I18nextProvider } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import i18n from "./i18n";

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <html lang="en" data-theme="sunset">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body
          className="bg-fixed bg-cover bg-center text-base-content min-h-screen flex flex-col"
          style={{ backgroundImage: "url('/images/babynames-bg.png')" }}
        >
          <Header />
          <main className="w-full flex-1">
            <Outlet />
          </main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
          <AdScript />
        </body>
      </html>
    </I18nextProvider>
  );
}

function Header() {
  return (
    <header className="navbar bg-base-100 shadow mb-6 w-full">
      <div className="flex w-full items-center justify-between px-4">
        <a
          href="/"
          className="btn btn-ghost normal-case text-xl flex items-center space-x-2"
        >
          <i className="devicon-react-original text-2xl"></i>
          <span>baobaonames.com</span>
        </a>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="p-4 text-center bg-base-300 mt-6">
      <p className="text-sm text-base-content/70">
        &copy; 2025 Baby Names. OHMDESIGN - Steven McSorley
      </p>
    </footer>
  );
}
