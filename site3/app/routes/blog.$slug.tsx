import { Link, useLoaderData } from "@remix-run/react";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

// Import your existing Header and Footer

// A fake “post” object for demonstration only
const fakePost = {
  title: "Magazines on a Desk",
  heroImageUrl: "https://via.placeholder.com/1920x800?text=Featured+Hero+Image",
  featuredImage:
    "https://via.placeholder.com/1000x600?text=Magazines+on+a+Desk",
  paragraphs: [
    "Holistically streamline transparent methodologies after team building growth strategies. Interactively productize bleeding‐edge schemas for efficient architectures.",
    "Globally promote vertical portals whereas time‐synchronized. Appropriately strategize 24/7 productized information for frictionless end users. Continually envision best‐in‐class schemas via tactical market‐driven metrics.",
    "Dramatically maintain enabled markets for synergy. Quickly incubate progressive web‐readiness. Credibly reintermediate seamless core competencies via cross‐media e‐services.",
  ],
};

// Loader: if slug is “test-slug-for-post”, return our fake data. Otherwise 404.
export const loader: LoaderFunction = async ({ params }) => {
  if (params.slug !== "test-slug-for-post") {
    throw new Response("Not Found", { status: 404 });
  }
  // Return our “fake” post data
  return json(fakePost);
};

export default function BlogPost() {
  // The loader returns our “fakePost” object
  const post = useLoaderData<typeof fakePost>();

  return (
    <>
      <Header />

      {/* Hero / Banner with Title */}
      <section
        className="relative w-full h-[50vh] flex items-center justify-center"
        style={{
          backgroundImage: `url('${post.heroImageUrl}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        {/* Title & Breadcrumb */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 uppercase">
            {post.title}
          </h1>
          <p className="mt-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/blog" className="hover:underline">
              Blog
            </Link>{" "}
            / <span className="text-gray-200">{post.title}</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Featured Image inside content */}
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>

          {/* Post Body Text */}
          <article className="prose max-w-none text-gray-600">
            {post.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>

          {/* Share This */}
          <div className="mt-8 flex flex-col items-center">
            <p className="uppercase text-sm mb-4 text-gray-500 tracking-widest">
              Share This
            </p>
            <div className="flex space-x-4">
              {/* Replace with your actual social icons/links */}
              <a
                href="#facebook"
                className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full hover:bg-gray-300"
                title="Facebook"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 10-11.63 9.88v-6.99H7.07v-2.9h3.3V9.55c0-3.26 1.94-5.06 4.9-5.06 1.42 0 2.92.25 2.92.25v3.19h-1.65c-1.63 0-2.13 1.01-2.13 2.05v2.41h3.62l-.58 2.9h-3.04v6.99A10 10 0 0022 12z" />
                </svg>
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full hover:bg-gray-300"
                title="Twitter"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.46 8.92c.01.13.01.27.01.41 0 4.21-3.2 9.07-9.07 9.07a9.03 9.03 0 01-4.88-1.43 6.28 6.28 0 004.65-1.3 3.2 3.2 0 01-2.98-2.22c.5.08.95.08 1.47-.06A3.19 3.19 0 014.7 9.52v-.04c.43.24.92.38 1.45.4a3.19 3.19 0 01-.99-4.27 9.06 9.06 0 006.57 3.33 3.22 3.22 0 015.45-2.93 6.32 6.32 0 002.03-.77 3.2 3.2 0 01-1.4 1.76 6.35 6.35 0 001.84-.5 6.73 6.73 0 01-1.61 1.66z" />
                </svg>
              </a>
              {/* repeat for other networks ... */}
            </div>
          </div>

          {/* Prev / Next Post Links */}
          <div className="mt-12 flex items-center justify-between text-sm">
            <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300">
              &larr; Previous Post
            </button>
            <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300">
              Next Post &rarr;
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Leave a Reply</h2>
            <p className="text-sm text-gray-500 mb-4">
              Your email address will not be published. Required fields are
              marked *
            </p>
            <form className="space-y-6">
              <div>
                <label htmlFor="comment" className="block mb-2 font-semibold">
                  Comment *
                </label>
                <textarea
                  id="comment"
                  rows={5}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  required
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 font-semibold">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                    required
                  />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                    required
                  />
                </div>
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block mb-2 font-semibold">
                    Website
                  </label>
                  <input
                    id="website"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>
              {/* Save info checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  id="save-info"
                  type="checkbox"
                  className="h-4 w-4 border border-gray-300 rounded"
                />
                <label htmlFor="save-info" className="text-gray-600 text-sm">
                  Save my name, email, and website in this browser for the next
                  time I comment.
                </label>
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
