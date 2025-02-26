import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "@remix-run/react";

const SoundcloudPost = ({ post }: { post: any }) => {
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
    <div className="bg-white shadow p-4">
      <div ref={ref} className="mb-4 h-[166px]">
        {isLoaded && post.soundcloudUrl ? (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={post.soundcloudUrl}
          ></iframe>
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              className="text-gray-400"
            >
              <path d="M18 18V7.91M15 18V10.91M12 18V10.91M9 18V10.91M6 18V13.91M3 18V13.91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
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

export default SoundcloudPost;