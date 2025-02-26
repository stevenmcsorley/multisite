import { Link } from "@remix-run/react";

export function SingleAudioPost({ post }: { post: any }) {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-[50vh] flex items-center justify-center"
        style={{
          backgroundImage: `url('${post.heroImageUrl}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 uppercase">
            {post.title}
          </h1>
          <p className="mt-2">
            <Link to="/" className="hover:underline">Home</Link>{" "}
            /{" "}
            <Link to="/blog" className="hover:underline">Blog</Link>{" "}
            / <span className="text-gray-200">{post.title}</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Audio Player */}
          <div className="mb-8">
            <audio controls className="w-full">
              <source src={post.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          {/* Post Body */}
          <article className="prose max-w-none text-gray-600">
            {post.paragraphs?.map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        </div>
      </main>
    </>
  );
}
