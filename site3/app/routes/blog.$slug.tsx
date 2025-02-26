import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Import your single post components
import { SingleImagePost } from "../components/singlePosts/SingleImagePost";
import { SingleYouTubePost } from "../components/singlePosts/SingleYouTubePost";
import { SingleQuotePost } from "../components/singlePosts/SingleQuotePost";
import { SingleSoundcloudPost } from "../components/singlePosts/SingleSoundcloudPost";
import { SingleAudioPost } from "../components/singlePosts/SingleAudioPost";

// The same array from your blog listing.
// You may add paragraphs, heroImageUrl, etc. if your Single* components expect them.
import {postsData} from "../data/blogPosts";

// Loader: find the single post by slug
export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const post = postsData.find((p) => p.slug === slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(post);
};

// This route is for /blog/:slug
export default function BlogSinglePost() {
  // The loader returns one post object
  const post = useLoaderData<typeof postsData[0]>();

  // Decide which single post component to use
  let PostComponent;
  switch (post.type) {
    case "image":
      PostComponent = SingleImagePost;
      break;
    case "youtube":
      PostComponent = SingleYouTubePost;
      break;
    case "quote":
      PostComponent = SingleQuotePost;
      break;
    case "soundcloud":
      PostComponent = SingleSoundcloudPost;
      break;
    case "audio":
      PostComponent = SingleAudioPost;
      break;
    default:
      PostComponent = () => <p>Unsupported post type</p>;
  }

  return (
    <>
      <Header />
      <PostComponent post={post} />
      <Footer />
    </>
  );
}
