import { Link } from "@remix-run/react";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Import reusable post components for grid previews
import { ImagePost } from "./posts/ImagePost";
import { YouTubePost } from "./posts/YouTubePost";
import { QuotePost } from "./posts/QuotePost";
import { SoundcloudPost } from "./posts/SoundcloudPost";
import { AudioPost } from "./posts/AudioPost";

// Import the real curated posts
import {posts} from "../data/blogPosts"; // Make sure this JSON is saved as blogPosts.ts or blogPosts.json

export function BlogPage() {
  return (
    <>
      {/* Header / Navbar */}
      <Header />

      {/* Hero Section */}
      <section
        className="relative w-full h-[40vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('https://loremflickr.com/1280/720')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold uppercase">Blog</h1>
          <p className="mt-2">Home / Blog</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => {
              // Render the correct preview component based on post type
              switch (post.type) {
                case "image":
                  return <ImagePost key={post.id} post={post} />;
                case "youtube":
                  return <YouTubePost key={post.id} post={post} />;
                case "soundcloud":
                  return <SoundcloudPost key={post.id} post={post} />;
                case "quote":
                  return <QuotePost key={post.id} post={post} />;
                case "audio":
                  return <AudioPost key={post.id} post={post} />;
                default:
                  return null;
              }
            })}
          </div>

          {/* Pagination (if needed in the future) */}
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
