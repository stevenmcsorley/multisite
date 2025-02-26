import { Link } from "@remix-run/react";

export function SoundcloudPost({ post }: { post: any }) {
  return (
    <div className="bg-white shadow p-4">
      <div className="mb-4">
        {post.soundcloudUrl && (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={post.soundcloudUrl}
          ></iframe>
        )}
        
      </div>
      <h2 className="text-lg font-semibold mb-2 text-black">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
        Read more
      </Link>
    </div>
  );
}
