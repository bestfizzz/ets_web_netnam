"use client"

export default function EventPageWithAds() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Left Sticky Ad */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen w-48 p-4 bg-white shadow-md z-20">
        <div className="sticky top-4">
          <div className="bg-indigo-500 text-white p-4 rounded-lg text-center">
            Left Ad Banner
          </div>
        </div>
      </div>

      {/* Right Sticky Ad */}
      <div className="hidden lg:flex fixed top-0 right-0 h-screen w-48 p-4 bg-white shadow-md z-20">
        <div className="sticky top-4">
          <div className="bg-indigo-500 text-white p-4 rounded-lg text-center">
            Right Ad Banner
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:ml-56 lg:mr-56">
        <h1 className="text-4xl font-bold text-center py-12">
          Main Event Content
        </h1>

        <div className="space-y-8">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            vitae justo a sapien laoreet sollicitudin. Aliquam erat volutpat.
          </p>
          <p>
            Scroll down to see the sticky ads remain in place while content
            scrolls.
          </p>

          {/* Long Content to Enable Scrolling */}
          <div className="h-[2000px] bg-gray-100 rounded-lg p-4">
            <p>Content goes here...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
