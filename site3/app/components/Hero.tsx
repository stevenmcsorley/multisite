type HeroProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string;
};

export function Hero({ id, ...props }: HeroProps) {
  return (
    <section
      id={id}
      {...props}
      className="pt-20 relative h-screen flex items-center justify-center hero-background"
      /* 
        Example hero background: 
        You can store an actual image in /public and reference it as: 
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      */
      //   style={{
      //     backgroundImage: "url('/halfagiraf-gb.png')",
      //     backgroundPosition: "center",
      //     backgroundSize: "cover",
      //     backgroundRepeat: "no-repeat",
      //   }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase">
          Innovative Web Design & <br />
          Development in Scotland <br />
        </h1>
        <p className="text-lg md:text-xl mb-6">
          At HalfaGiraf, we craft modern, user-friendly websites that help
          businesses stand out, grow, and succeed.
        </p>
        {/* “Play” Button or CTA */}
        <button
          className="flex items-center mx-auto bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200 transition"
          onClick={() =>
            alert("Get a Free Consultation or Let’s Build Your Website")
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
