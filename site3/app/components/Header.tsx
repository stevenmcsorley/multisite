import * as React from "react";

import { Link, useLocation } from "@remix-run/react";

function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  targetId: string
) {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    window.history.pushState(null, "", `#${targetId}`);
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* SITE LOGO / NAME */}
        <div className="text-xl font-bold text-black">Half a Giraf</div>

        {/* DESKTOP NAV: hidden on mobile */}
        <nav className="hidden md:flex space-x-6 text-black">
          <Link
            to={isHomePage ? "#home" : "/#home"}
            onClick={(e) => isHomePage && handleSmoothScroll(e, "home")}
            className="hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            to={isHomePage ? "#about" : "/#about"}
            onClick={(e) => isHomePage && handleSmoothScroll(e, "about")}
            className="hover:text-gray-900"
          >
            About
          </Link>
          <Link
            to={isHomePage ? "#services" : "/#services"}
            onClick={(e) => isHomePage && handleSmoothScroll(e, "services")}
            className="hover:text-gray-900"
          >
            Services
          </Link>
          <Link
            to={isHomePage ? "#work" : "/#work"}
            onClick={(e) => isHomePage && handleSmoothScroll(e, "work")}
            className="hover:text-gray-900"
          >
            Work
          </Link>
          <Link
            to={isHomePage ? "#clients" : "/#clients"}
            onClick={(e) => isHomePage && handleSmoothScroll(e, "clients")}
            className="hover:text-gray-900"
          >
            Clients
          </Link>
          <Link
            to={isHomePage ? "#contact" : "/#contact"}
            onClick={(e) => isHomePage && handleSmoothScroll(e, "contact")}
            className="hover:text-gray-900"
          >
            Contacts
          </Link>
          <Link to="/blog" className="hover:text-gray-900">
            Blog
          </Link>
        </nav>

        {/* HAMBURGER BUTTON: shown on mobile only */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className={`hamburger ${mobileOpen ? "open" : ""}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg text-black">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to={isHomePage ? "#home" : "/#home"}
              onClick={(e) => {
                setMobileOpen(false);
                if (isHomePage) handleSmoothScroll(e, "home");
              }}
              className="hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              to={isHomePage ? "#about" : "/#about"}
              onClick={(e) => {
                setMobileOpen(false);
                if (isHomePage) handleSmoothScroll(e, "about");
              }}
              className="hover:text-gray-900"
            >
              About
            </Link>
            <Link
              to={isHomePage ? "#services" : "/#services"}
              onClick={(e) => {
                setMobileOpen(false);
                if (isHomePage) handleSmoothScroll(e, "services");
              }}
              className="hover:text-gray-900"
            >
              Services
            </Link>
            <Link
              to={isHomePage ? "#work" : "/#work"}
              onClick={(e) => {
                setMobileOpen(false);
                if (isHomePage) handleSmoothScroll(e, "work");
              }}
              className="hover:text-gray-900"
            >
              Work
            </Link>
            <Link
              to={isHomePage ? "#clients" : "/#clients"}
              onClick={(e) => {
                setMobileOpen(false);
                if (isHomePage) handleSmoothScroll(e, "clients");
              }}
              className="hover:text-gray-900"
            >
              Clients
            </Link>
            <Link
              to={isHomePage ? "#contact" : "/#contact"}
              onClick={(e) => {
                setMobileOpen(false);
                if (isHomePage) handleSmoothScroll(e, "contact");
              }}
              className="hover:text-gray-900"
            >
              Contacts
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className="hover:text-gray-900"
            >
              Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
