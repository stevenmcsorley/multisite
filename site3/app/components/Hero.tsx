import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type HeroProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string;
};

export function Hero({ id, ...props }: HeroProps) {
  // Track when the component comes into view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Animation states
  const [animateHeading, setAnimateHeading] = useState(false);
  const [animateParagraph, setAnimateParagraph] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);

  // Trigger animations with staggered timing when component comes into view
  useEffect(() => {
    if (inView) {
      // Start animations after a delay
      const headingTimer = setTimeout(() => {
        setAnimateHeading(true);
      }, 200); // Heading starts after 200ms
      
      const paragraphTimer = setTimeout(() => {
        setAnimateParagraph(true);
      }, 600); // Paragraph starts after 600ms
      
      const buttonTimer = setTimeout(() => {
        setAnimateButton(true);
      }, 1000); // Button starts after 1000ms
      
      return () => {
        clearTimeout(headingTimer);
        clearTimeout(paragraphTimer);
        clearTimeout(buttonTimer);
      };
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      id={id}
      {...props}
      className="pt-20 relative h-screen flex items-center justify-center hero-bg-zoom"
      style={{
        backgroundImage: "url('/halfagiraf-gb.png')",
        backgroundPosition: "center",
        backgroundSize: "120%",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 overflow-hidden">
        <h1 
          className={`text-4xl md:text-6xl font-bold mb-4 uppercase transform transition-all duration-1000 ease-out
            ${animateHeading ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}
        >
          Innovative Web Design & <br />
          Development in Scotland <br />
        </h1>
        
        <p 
          className={`text-lg md:text-xl mb-6 transform transition-all duration-1000 ease-out
            ${animateParagraph ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
        >
          At HalfaGiraf, we craft modern, user-friendly websites that help
          businesses stand out, grow, and succeed.
        </p>
        
        {/* "Play" Button or CTA */}
        <button
          className={`flex items-center mx-auto bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200 transition-all duration-500 ease-out
            ${animateButton ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          onClick={() =>
            alert("Get a Free Consultation or Let's Build Your Website")
          }
        >
          <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4l12 6-12 6z" />
          </svg>
          Get a Free Consultation
        </button>
      </div>
    </section>
  );
}