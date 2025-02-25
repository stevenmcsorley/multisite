type AboutProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string;
};

export function About({ id, ...props }: AboutProps) {
  return (
    <section id={id} {...props} className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase text-black">We are HalfaGiraf</h2>
          <p className="text-gray-500 mt-2">About Us</p>
        </div>
        <div className="max-w-3xl mx-auto text-center text-gray-600">
          <p className="mb-4">
          For over 15 years, Half a Giraf has specialized in delivering impactful web design, development, and digital solutions across Scotland. Our team is fueled by creativity and dedicated to helping you connect with your audience in the most authentic way possible.
          </p>
        </div>
        {/* Team Image (placeholder) */}
        {/* <div className="mt-10 flex justify-center">
          <img
            src="https://via.placeholder.com/1000x300"
            alt="Our Team"
            className="w-full max-w-4xl object-cover"
          />
        </div> */}
      </div>
    </section>
  );
}
