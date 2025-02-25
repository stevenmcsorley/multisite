import { useState } from "react";

// Optional: If you prefer to keep data separate, you can move this array into
// a dedicated file like app/data/features.ts and import it from there.
const featuresData = [
  {
    id: 1,
    icon: "fa-solid fa-flask", // or a path to an image
    title: "Experimental Labs",
    description: "Cutting-edge solutions for your business.",
  },
  {
    id: 2,
    icon: "fa-solid fa-headphones",
    title: "24/7 Support",
    description: "We’re always here to help.",
  },
  {
    id: 3,
    icon: "fa-solid fa-users",
    title: "Community Driven",
    description: "Engage with a global community.",
  },
  {
    id: 4,
    icon: "fa-solid fa-robot",
    title: "AI Integration",
    description: "Smart automation at your fingertips.",
  },
  {
    id: 5,
    icon: "fa-solid fa-chart-line",
    title: "Data Analytics",
    description: "Get insights that matter.",
  },
  {
    id: 6,
    icon: "fa-solid fa-cog",
    title: "Custom Solutions",
    description: "Tailored to your unique needs.",
  },
];

export function BrandFeatures() {
  // Keep track of which feature is hovered
  const [hoveredFeature, setHoveredFeature] = useState<
    (typeof featuresData)[number] | null
  >(null);

  const radius = 159; // distance of small circles from center
  const circleSize = 20; // diameter of each small circle

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Circle Feature Graphic */}
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          {/* Placeholder circle/graphic */}
          <div className="relative flex items-center justify-center w-80 h-80 rounded-full bg-transparent border-2 border-gray-200">
            <div className="relative flex items-center justify-center w-60 h-60 rounded-full bg-gray-100 ">
              <div className="absolute text-center p-4">
                <h3 className="text-xl font-semibold mt-2">
                  {hoveredFeature ? hoveredFeature.title : "Brand New Features"}
                </h3>
                <p className="text-gray-500 mt-1">
                  {hoveredFeature
                    ? hoveredFeature.description
                    : "Competently transform proactive internal or 'organic'."}
                </p>
              </div>

              {featuresData.map((feature, i) => {
                // Evenly spread angles around 360 degrees
                const angle = (360 / featuresData.length) * i;

                // We'll use a transform trick:
                // 1) rotate() by angle to place the circle
                // 2) translate() by radius to push it outward
                // 3) rotate() back by -angle so the icon remains upright
                const style = {
                  transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                };

                return (
                  <div
                    key={feature.id}
                    className="group absolute bg-black rounded-full cursor-pointer
                           hover:animate-pulse flex items-center justify-center
                           text-white"
                    style={style}
                    onMouseEnter={() => setHoveredFeature(feature)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    {/* Example: Font Awesome icon or your own image */}
                    <i className={`${feature.icon} text-sm`} />
                  </div>
                );
              })}

              {/* Tiny circles around (just placeholders) */}
              {/* <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-black" /> */}
            </div>
          </div>
        </div>
        {/* Laptop Image Placeholder */}
        <div className="w-full md:w-1/2">
          <img
            src="https://picsum.photos/1280/720"
            alt="Laptop Mockup"
            className="rounded shadow"
          />
        </div>
      </div>
    </section>
  );
}
