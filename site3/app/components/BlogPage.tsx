// app/components/BlogPage.tsx

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Link } from "@remix-run/react";

export function BlogPage() {
  return (
    <>
      {/* Header / Navbar */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative w-full h-[40vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://via.placeholder.com/1920x700?text=Blog+Hero+Image')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        {/* Title content */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold uppercase">Blog</h1>
          <p className="mt-2">Home / Blog</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Post 1 */}
            <div className="bg-white shadow p-4">
              <img
                src="https://via.placeholder.com/600x400?text=Blog+Image+1"
                alt="Post with Gallery"
                className="mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">Post with Gallery</h2>
              <p className="text-sm text-gray-500 mb-2">
                Professionally leverage client‐centric systems. Interactively
                orchestrate...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 2 */}
            <div className="bg-white shadow p-4">
              <img
                src="https://via.placeholder.com/600x400?text=Blog+Image+2"
                alt="We Love Photography"
                className="mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">
                We Love Photography
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Globally provide effective experiences for perspective networks
                ...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 3 */}
            <div className="bg-white shadow p-4">
              <img
                src="https://via.placeholder.com/600x400?text=Blog+Image+3"
                alt="Woman enjoying ride"
                className="mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">
                Woman enjoying ride
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Progressively negotiate cross‐media content before emerging
                leadership...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 4: YouTube embed example */}
            <div className="bg-white shadow p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {/* Use a wrapper with aspect-ratio if you'd like to keep it responsive */}
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="The Lighthouse"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <h2 className="text-lg font-semibold mb-2">The Lighthouse</h2>
              <p className="text-sm text-gray-500 mb-2">
                Enthusiastically embrace turnkey results for user‐friendly
                interfaces...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 5: Soundcloud embed */}
            <div className="bg-white shadow p-4">
              <div className="mb-4">
                {/* Insert your SoundCloud iframe if desired */}
              </div>
              <h2 className="text-lg font-semibold mb-2">
                Soundcloud Audio Post
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Distinctively orchestrate visionary customer service without B2C
                friction...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 6: Quote */}
            <div className="bg-white shadow p-4 flex flex-col justify-center">
              <blockquote className="italic text-lg text-gray-600">
                “Good design is obvious. Great design is transparent.”
              </blockquote>
              <p className="mt-4 text-sm text-right text-gray-500">
                – Joe Sparano
              </p>
            </div>

            {/* Post 7: Another YouTube embed */}
            <div className="bg-white shadow p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <iframe
                  src="https://www.youtube.com/embed/5MgBikgcWnY"
                  title="Time lapse of the office setup"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <h2 className="text-lg font-semibold mb-2">
                Time lapse of the office setup
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Seamlessly embrace highly efficient collaborations...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 8: Plain image */}
            <div className="bg-white shadow p-4">
              <img
                src="https://via.placeholder.com/600x400?text=Coffee"
                alt="Is time to coffee"
                className="mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">Is time to coffee</h2>
              <p className="text-sm text-gray-500 mb-2">
                Holisticly maximize 24/7 infrastructures via off‐site valued
                experts...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 9: Plain image */}
            <div className="bg-white shadow p-4">
              <img
                src="https://via.placeholder.com/600x400?text=Magazines"
                alt="Magazines on a desk"
                className="mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">
                Magazines on a desk
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Intuitively synergize transparent methodologies after
                interactive meta-services...
              </p>
              <Link
                to="/blog/test-slug-for-post"
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>

            {/* Post 10: Audio */}
            <div className="bg-white shadow p-4 md:col-span-3">
              <h2 className="text-lg font-semibold mb-4">
                Audio Media Library
              </h2>
              {/* Simple placeholder audio player */}
              {/* <audio
                controls
                className="w-full mb-4"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              >
                Your browser does not support the audio element.
              </audio> */}
              <p className="text-sm text-gray-500">
                Seamlessly visualize enabled e‐commerce via stand‐alone metrics.
                Quickly repurpose ...
              </p>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Page 1 of 2
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
