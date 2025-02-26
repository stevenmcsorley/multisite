import { Link } from "@remix-run/react";
import { useState } from "react";

export function SingleSoundcloudPost({ post }: { post: any }) {
  // Local state to toggle the reply form
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-800 py-16 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 uppercase">
          {post.title}
        </h1>
        <p className="mt-2">
          <Link to="/" className="hover:underline text-white">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/blog" className="hover:underline text-white">
            Blog
          </Link>{" "}
          / <span className="text-gray-300">{post.title}</span>
        </p>
      </section>

      {/* Main Content */}
      <main className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* SoundCloud Embed */}
          <div className="mb-8">
            {post.soundcloudUrl && (
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={post.soundcloudUrl}
              />
            )}
          </div>

          {/* Post Body */}
          <article className="prose max-w-none text-gray-600">
            {post.paragraphs?.map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </article>

          {/* Share This */}
          <div className="mt-8 flex flex-col items-center">
            <p className="uppercase text-sm mb-4 text-gray-500 tracking-widest">
              Share This
            </p>
            <div className="flex space-x-4">
              {/* Example share icons (replace with your own) */}
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
              {/* Repeat for other networks as needed */}
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

          {/* Reply Section */}
          <div className="mt-12">
            {!showReplyForm ? (
              <button
                onClick={() => setShowReplyForm(true)}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Leave a Reply
              </button>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Leave a Reply</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Your email address will not be published. Required fields are marked *
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
                  <div className="flex items-center space-x-2">
                    <input
                      id="save-info"
                      type="checkbox"
                      className="h-4 w-4 border border-gray-300 rounded"
                    />
                    <label htmlFor="save-info" className="text-gray-600 text-sm">
                      Save my name, email, and website in this browser for the next time I comment.
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                  >
                    Post Comment
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
