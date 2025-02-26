export function SingleQuotePost({ post }: { post: any }) {
    return (
      <>
        {/* Full-Width Quote Section */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <blockquote className="text-4xl italic text-gray-700">
              “{post.quote}”
            </blockquote>
            {post.author && (
              <p className="mt-4 text-lg text-gray-500">– {post.author}</p>
            )}
          </div>
        </section>
        
        {/* Optional Additional Content */}
        {post.paragraphs && (
          <main className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <article className="prose max-w-none text-gray-600">
                {post.paragraphs.map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </article>
            </div>
          </main>
        )}
      </>
    );
  }
  