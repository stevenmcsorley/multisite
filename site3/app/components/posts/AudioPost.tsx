import { Link } from "@remix-run/react";

export function AudioPost({ post }: { post: any }) {
  return (
    <div className="bg-white shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-black">{post.title}</h2>
      <audio controls className="w-full mb-4" src={post.audioUrl}>
        Your browser does not support the audio element.
      </audio>
      <p className="text-sm text-gray-500 mb-2">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
        Read more
      </Link>
    </div>
  );
}
