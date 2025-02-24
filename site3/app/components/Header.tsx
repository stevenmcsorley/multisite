import * as React from "react";

import { Link, useLocation } from "@remix-run/react";

function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  targetId: string
) {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    // Update the URL’s hash
    window.history.pushState(null, "", `#${targetId}`);
    // Smoothly scroll to the element
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Half a Giraf</div>
        <nav className="hidden space-x-6 md:flex">
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
          {/* Blog always navigates to a different route */}
          <Link to="/blog" className="hover:text-gray-900">
            Blog
          </Link>
        </nav>
        <button className="md:hidden focus:outline-none">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M4 5h16M4 12h16M4 19h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
