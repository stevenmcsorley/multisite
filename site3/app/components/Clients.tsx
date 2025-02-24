export function Clients() {
  return (
    <section id="clients" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold uppercase mb-8">
          Our Clients Feedback
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-around space-y-6 md:space-y-0">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/100x50?text=Logo+1"
              alt="Client Logo"
              className="mx-auto mb-2"
            />
            <p className="text-gray-600">ReamHatchery</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/100x50?text=Logo+2"
              alt="Client Logo"
              className="mx-auto mb-2"
            />
            <p className="text-gray-600">Paradigma</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/100x50?text=Logo+3"
              alt="Client Logo"
              className="mx-auto mb-2"
            />
            <p className="text-gray-600">A-Listen</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/100x50?text=Logo+4"
              alt="Client Logo"
              className="mx-auto mb-2"
            />
            <p className="text-gray-600">Mortella</p>
          </div>
        </div>
      </div>
    </section>
  );
}
