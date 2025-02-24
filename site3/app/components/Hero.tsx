type HeroProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string;
};

export function Hero({ id, ...props }: HeroProps) {
  return (
    <section
      id={id}
      {...props}
      className="pt-20 relative h-screen flex items-center justify-center"
      /* 
        Example hero background: 
        You can store an actual image in /public and reference it as: 
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      */
      style={{
        backgroundImage: "url('/halfagiraf-gb.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase">
          The Agency
        </h1>
        <p className="text-lg md:text-xl mb-6">
          We have been building picture-perfect websites since 2010
        </p>
        {/* “Play” Button or CTA */}
        <button
          className="flex items-center mx-auto bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200 transition"
          onClick={() => alert("Play video or show modal here!")}
        >
          <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4l12 6-12 6z" />
          </svg>
          Watch Video
        </button>
      </div>
    </section>
  );
}
