function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault(); // prevent instant jump
  const targetId = e.currentTarget.getAttribute("href")?.replace("#", "");
  if (!targetId) return;

  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">Half a Giraf</div>
        {/* Nav Links */}
        <nav className="hidden space-x-6 md:flex">
          <a
            href="#home"
            onClick={handleSmoothScroll}
            className="hover:text-gray-900"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={handleSmoothScroll}
            className="hover:text-gray-900"
          >
            About
          </a>
          <a
            href="#services"
            onClick={handleSmoothScroll}
            className="hover:text-gray-900"
          >
            Services
          </a>
          <a
            href="#work"
            onClick={handleSmoothScroll}
            className="hover:text-gray-900"
          >
            Work
          </a>
          <a
            href="#clients"
            onClick={handleSmoothScroll}
            className="hover:text-gray-900"
          >
            Clients
          </a>
          <a href="#contact" className="hover:text-gray-900">
            Contacts
          </a>
          <a href="/blog" className="hover:text-gray-900">
            Blog
          </a>
        </nav>
        {/* Call to Action Button */}
        {/* <button className="hidden md:inline-block bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800">
          Buy Half a Giraf
        </button> */}
        {/* Mobile Menu Toggle (icon only; needs JS to expand/collapse if desired) */}
        <button className="md:hidden focus:outline-none">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M4 5h16M4 12h16M4 19h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
