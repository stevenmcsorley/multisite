export function Header() {
  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">HAZEL</div>
        {/* Nav Links */}
        <nav className="hidden space-x-6 md:flex">
          <a href="#home" className="hover:text-gray-900">
            Home
          </a>
          <a href="#about" className="hover:text-gray-900">
            About
          </a>
          <a href="#services" className="hover:text-gray-900">
            Services
          </a>
          <a href="#work" className="hover:text-gray-900">
            Work
          </a>
          <a href="#clients" className="hover:text-gray-900">
            Clients
          </a>
          <a href="#contact" className="hover:text-gray-900">
            Contacts
          </a>
          <a href="#blog" className="hover:text-gray-900">
            Blog
          </a>
        </nav>
        {/* Call to Action Button */}
        <button className="hidden md:inline-block bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800">
          Buy Hazel
        </button>
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
