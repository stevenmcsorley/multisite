import { Link } from "@remix-run/react";

export function YouTubePost({ post }: { post: any }) {
  return (
    <div className="bg-white shadow p-4">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <iframe
          src={`https://www.youtube.com/embed/${post.youtubeId}`}
          title={post.title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-black">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
        Read more
      </Link>
    </div>
  );
}
