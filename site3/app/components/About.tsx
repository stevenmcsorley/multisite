export function About() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase">We are Half a Giraf</h2>
          <p className="text-gray-500 mt-2">About Us</p>
        </div>
        <div className="max-w-3xl mx-auto text-center text-gray-600">
          <p className="mb-4">
            A succinctly framed intro about who you are, what you do, and why
            you stand out. With a minimal aesthetic and bold use of whitespace,
            convey your brands ethos compellingly.
          </p>
        </div>
        {/* Team Image (placeholder) */}
        <div className="mt-10 flex justify-center">
          <img
            src="https://via.placeholder.com/1000x300?text=Our+Team"
            alt="Our Team"
            className="w-full max-w-4xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
