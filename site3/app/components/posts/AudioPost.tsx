import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "@remix-run/react";

const AudioPost = ({ post }: { post: any }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsLoaded(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className="bg-white shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-black">{post.title}</h2>
      
      {isLoaded ? (
        <audio controls className="w-full mb-4" src={post.audioUrl}>
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div className="w-full h-12 mb-4 bg-gray-200 animate-pulse flex items-center justify-center rounded">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            className="text-gray-400"
          >
            <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"></path>
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
          </svg>
        </div>
      )}
      
      <p className="text-sm text-gray-500 mb-2">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
        Read more
      </Link>
    </div>
  );
}

export default AudioPost;