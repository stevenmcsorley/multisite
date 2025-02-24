export function Footer() {
  return (
    <footer id="blog" className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Footer Col 1 */}
          <div>
            <h3 className="font-bold mb-4">About Half a Giraf</h3>
            <p className="text-gray-600 mb-4">
              Clean minimal layout. A perfect setup to highlight all the
              important points about your company or brand.
            </p>
            <p className="text-gray-600">&copy; Half a Giraf 2025</p>
          </div>
          {/* Footer Col 2 */}
          <div>
            <h3 className="font-bold mb-4">Latest from Blog</h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <button className="hover:underline text-left">
                  New Mockup Gallery
                </button>
              </li>
              <li>
                <button className="hover:underline text-left">
                  Latest Photographies
                </button>
              </li>
              <li>
                <button className="hover:underline text-left">
                  Brand Workshop 101
                </button>
              </li>
            </ul>
          </div>
          {/* Footer Col 3 */}
          <div>
            <h3 className="font-bold mb-4">We Curate</h3>
            <div className="flex flex-wrap space-x-2">
              <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Minimal
              </span>
              <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Design
              </span>
              <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Themes
              </span>
              <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Branding
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
