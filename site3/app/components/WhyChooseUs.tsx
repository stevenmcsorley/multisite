export function WhyChooseUs() {
  return (
    <section id="services" className="py-16 bg-black text-white relative">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://via.placeholder.com/1920x1080?text=Texture')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold uppercase text-center mb-8">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Feature 1 */}
          <div>
            <svg
              className="mx-auto mb-4 h-12 w-12"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 7H7v6h6V7z M19 4h-2V2h-2v2H5V2H3v2H1v2h2v7a4 4 0 004 4h6a4 4 0 004-4V6h2V4z" />
            </svg>
            <h3 className="font-semibold text-lg mb-2">Powerful Features</h3>
            <p className="text-gray-300">
              Leverage great UI/UX, advanced functionalities, and seamless user
              experiences.
            </p>
          </div>
          {/* Feature 2 */}
          <div>
            <svg
              className="mx-auto mb-4 h-12 w-12"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 3a7 7 0 00-7 7v4l-2 2h18l-2-2v-4a7 7 0 00-7-7z" />
            </svg>
            <h3 className="font-semibold text-lg mb-2">All Included</h3>
            <p className="text-gray-300">
              From conceptualization to deployment, everything in one package.
            </p>
          </div>
          {/* Feature 3 */}
          <div>
            <svg
              className="mx-auto mb-4 h-12 w-12"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm9 10h3V7h-3v6zM5 7v6h3V7H5z" />
            </svg>
            <h3 className="font-semibold text-lg mb-2">Minimalist Design</h3>
            <p className="text-gray-300">
              Clean layouts that highlight your message, not clutter the page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
