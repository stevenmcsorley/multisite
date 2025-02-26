import { Link } from "@remix-run/react";

export function QuotePost({ post }: { post: any }) {
    return (
      <div className="bg-white shadow p-4 flex flex-col justify-center">
        <blockquote className="italic text-lg text-gray-600">{post.quote}</blockquote>
        {post.author && (
          <p className="mt-4 text-sm text-right text-gray-500">– {post.author}</p>
        )}
    <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
        Read more
      </Link>
      </div>
    );
  }
  