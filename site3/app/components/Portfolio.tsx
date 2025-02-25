type PortfolioProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string;
};

export function Portfolio({ id, ...props }: PortfolioProps) {
  return (
    <section id={id} {...props} className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold uppercase text-black">Our Portfolio</h2>
          <p className="text-gray-500 mt-2">We build some stuff</p>
        </div>
        {/* Filters (optional) */}
        <div className="flex space-x-4 justify-center mb-10 flex-wrap">
          <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            All
          </button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">
            Website
          </button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">
            Video
          </button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">
            Logo
          </button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">
            Brand
          </button>
        </div>
        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* 1 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Closer+Device+Display"
              alt="Close Device Display"
            />
            <p className="mt-2 font-semibold">Close Device Display</p>
          </div>
          {/* 2 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Clean+Watch+Video"
              alt="Clean Watch Video"
            />
            <p className="mt-2 font-semibold">Clean Watch Video</p>
          </div>
          {/* 3 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Apple+Iwatch"
              alt="Apple Iwatch"
            />
            <p className="mt-2 font-semibold">Apple Iwatch</p>
          </div>
          {/* 4 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Office+Interior"
              alt="Office Interior"
            />
            <p className="mt-2 font-semibold">Office Interior</p>
          </div>
          {/* 5 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Espacial+Coffee+Cup"
              alt="Espacial Coffee Cup"
            />
            <p className="mt-2 font-semibold">Espacial Coffee Cup</p>
          </div>
          {/* 6 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Lighting+Upgrade"
              alt="Lighting Upgrade"
            />
            <p className="mt-2 font-semibold">Lighting Upgrade</p>
          </div>
          {/* 7 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Apple+Bike"
              alt="Apple Bike"
            />
            <p className="mt-2 font-semibold">Apple Bike</p>
          </div>
          {/* 8 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Radio+Desk"
              alt="Radio Desk"
            />
            <p className="mt-2 font-semibold">Radio Desk</p>
          </div>
          {/* 9 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=NikePro+Images"
              alt="NikePro Images"
            />
            <p className="mt-2 font-semibold">NikePro Images</p>
          </div>
          {/* 10 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Black+IPhone"
              alt="Black iPhone"
            />
            <p className="mt-2 font-semibold">Black iPhone</p>
          </div>
          {/* 11 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Personal+Reform+Videos"
              alt="Personal Reform Videos"
            />
            <p className="mt-2 font-semibold">Personal Reform Videos</p>
          </div>
          {/* 12 */}
          <div className="bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/300x200?text=Hand+Sketchbook"
              alt="Hand Sketchbook"
            />
            <p className="mt-2 font-semibold">Hand Sketchbook</p>
          </div>
        </div>
      </div>
    </section>
  );
}
