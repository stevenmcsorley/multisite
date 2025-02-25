import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

// Simple SVG icons data
const featuresData = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 3h15M12 3v18M4.5 12h15M4.5 16.5h15M4.5 21h15M16.5 3l-1.5 6 1.5 6-1.5 6"></path>
      </svg>
    ),
    title: "Experimental Labs",
    description: "Cutting-edge solutions for your business.",
  },
  {
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
      </svg>
    ),
    title: "24/7 Support",
    description: "We're always here to help.",
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    title: "Community Driven",
    description: "Engage with a global community.",
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8" y2="16"></line>
        <line x1="16" y1="16" x2="16" y2="16"></line>
      </svg>
    ),
    title: "AI Integration",
    description: "Smart automation at your fingertips.",
  },
  {
    id: 5,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    title: "Data Analytics",
    description: "Get insights that matter.",
  },
  {
    id: 6,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
      </svg>
    ),
    title: "Custom Solutions",
    description: "Tailored to your unique needs.",
  },
];

export function BrandFeatures() {
  // Track when the component comes into view
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 1, // When 30% of the component is visible
  });
  
  // Animation state
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Track active feature (either hovered or default selection)
  const [hoveredFeature, setHoveredFeature] = useState<
    (typeof featuresData)[number] | null
  >(null);

  // Add state for the currently active feature (default to first item)
  const [activeFeature, setActiveFeature] = useState(featuresData[0]);

  // Start animation when component comes into view
  useEffect(() => {
    if (inView && !animationStarted) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView, animationStarted]);

  // Get the currently displayed feature (either hovered or active)
  const currentFeature = hoveredFeature || activeFeature;

  const radius = 159; // distance of small circles from center
  const circleSize = 40; // Size for feature circles
  const innerCircleRadius = 30; // The radius to hide behind (smaller than inner circle)

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Circle Feature Graphic */}
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          {/* Placeholder circle/graphic */}
          <div className="relative flex items-center justify-center w-80 h-80 rounded-full bg-transparent border-2 border-gray-200">
            <div className="relative flex items-center justify-center w-60 h-60 rounded-full bg-gray-100 z-10">
              <div className="absolute text-center p-4">
                <h3 className="text-xl font-semibold mt-2 text-gray-800">
                  {currentFeature.title}
                </h3>
                <p className="text-gray-500 mt-1">
                  {currentFeature.description}
                </p>
              </div>
            </div>

            {/* Feature dots container - positioned below inner circle in z-index */}
            <div className="absolute inset-0 flex items-center justify-center">
              {featuresData.map((feature, i) => {
                // Evenly spread angles around 360 degrees
                const angle = (360 / featuresData.length) * i;
                
                // Calculate the transition styles based on animation state
                const transformValue = animationStarted 
                  ? `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` 
                  : `rotate(${angle}deg) translate(${innerCircleRadius}px) rotate(-${angle}deg)`;
                
                // Check if this feature is the active one (either hovered or selected)
                const isHovered = hoveredFeature?.id === feature.id;
                const isActive = activeFeature.id === feature.id && !hoveredFeature;
                
                // Create a single style object with all transition properties together
                const featureStyle = {
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  transform: transformValue,
                  opacity: animationStarted ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s, opacity 0.5s ease ${i * 0.1}s`,
                  zIndex: animationStarted ? 20 : 5,
                };

                return (
                  <div
                    key={feature.id}
                    className={`absolute bg-black rounded-full cursor-pointer
                             flex items-center justify-center text-white
                             ${isHovered || isActive ? 'animate-pulse bg-opacity-70' : 'hover:bg-opacity-70'}`}
                    style={featureStyle}
                    onMouseEnter={() => setActiveFeature(feature)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    // onClick={() => setActiveFeature(feature)}
                  >
                    {/* Inline SVG Icon */}
                    {feature.icon}
                  </div>
                );
              })}
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