export function Contact() {
  return (
    <section id="contact" className="relative py-16 bg-black text-white">
      {/* background coffee cup or any other image */}
      <div
        className="absolute inset-0"
        style={{
          background: `url('https://via.placeholder.com/1920x1080?text=Coffee+Background') center/cover no-repeat`,
          opacity: 0.2,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-center text-3xl font-bold uppercase mb-8">
          Get in Touch with Us
        </h2>
        <div className="max-w-3xl mx-auto">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name*"
                className="w-full px-4 py-3 text-gray-800 rounded focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email*"
                className="w-full px-4 py-3 text-gray-800 rounded focus:outline-none"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject*"
              className="w-full px-4 py-3 text-gray-800 rounded focus:outline-none"
              required
            />
            <textarea
              placeholder="Message*"
              rows={5}
              className="w-full px-4 py-3 text-gray-800 rounded focus:outline-none"
              required
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
