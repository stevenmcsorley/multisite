import { Link } from "@remix-run/react";

const ImagePost = ({ post }: { post: any }) => {
  return (
    <div className="bg-white shadow p-4">
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="mb-4 w-full h-auto"
          loading="lazy" // Native browser lazy loading
        />
      )}
      <h2 className="text-lg font-semibold mb-2 text-black">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
        Read more
      </Link>
    </div>
  );
}

export default ImagePost;