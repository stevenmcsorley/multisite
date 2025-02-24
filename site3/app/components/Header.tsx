// app/components/Header.tsx

import * as React from "react";

import { Link, useLocation } from "@remix-run/react";

function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  isHomePage: boolean
) {
  // If we're NOT on the homepage, do nothing special:
  // just let the Link navigate to "/#someSection".
  if (!isHomePage) return;

  // Otherwise prevent default so we can scroll smoothly
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute("href")?.replace("#", "");
  if (!targetId) return;
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">Half a Giraf</div>

        {/* Nav Links */}
        <nav className="hidden space-x-6 md:flex">
          {/* 
            If we're on homepage, link is "#home"; if off-homepage,
            link is "/#home". Either way, we attach our smoothScroll handler
          */}
          <Link
            to={isHomePage ? "#home" : "/#home"}
            onClick={(e) => handleSmoothScroll(e, isHomePage)}
            className="hover:text-gray-900"
          >
            Home
          </Link>

          <Link
            to={isHomePage ? "#about" : "/#about"}
            onClick={(e) => handleSmoothScroll(e, isHomePage)}
            className="hover:text-gray-900"
          >
            About
          </Link>

          <Link
            to={isHomePage ? "#services" : "/#services"}
            onClick={(e) => handleSmoothScroll(e, isHomePage)}
            className="hover:text-gray-900"
          >
            Services
          </Link>

          <Link
            to={isHomePage ? "#work" : "/#work"}
            onClick={(e) => handleSmoothScroll(e, isHomePage)}
            className="hover:text-gray-900"
          >
            Work
          </Link>

          <Link
            to={isHomePage ? "#clients" : "/#clients"}
            onClick={(e) => handleSmoothScroll(e, isHomePage)}
            className="hover:text-gray-900"
          >
            Clients
          </Link>

          <Link
            to={isHomePage ? "#contact" : "/#contact"}
            onClick={(e) => handleSmoothScroll(e, isHomePage)}
            className="hover:text-gray-900"
          >
            Contacts
          </Link>

          {/* Blog link goes straight to /blog, not an anchor. */}
          <Link to="/blog" className="hover:text-gray-900">
            Blog
          </Link>
        </nav>

        {/* Mobile Menu Toggle (if needed) */}
        <button className="md:hidden focus:outline-none">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M4 5h16M4 12h16M4 19h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
