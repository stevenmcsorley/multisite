export function BrandFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Circle Feature Graphic */}
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          {/* Placeholder circle/graphic */}
          <div className="relative flex items-center justify-center w-72 h-72 rounded-full bg-gray-100">
            <div className="absolute text-center">
              <h3 className="text-xl font-semibold">Brand New Features</h3>
              <p className="text-gray-500 mt-1">Comprehensive, Future‐Proof</p>
            </div>
            {/* Tiny circles around (just placeholders) */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-black" />
          </div>
        </div>
        {/* Laptop Image Placeholder */}
        <div className="w-full md:w-1/2">
          <img
            src="https://via.placeholder.com/600x400?text=Laptop+Mockup"
            alt="Laptop Mockup"
            className="rounded shadow"
          />
        </div>
      </div>
    </section>
  );
}
