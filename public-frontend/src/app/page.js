import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            RenewCred
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>

            <Link
              href="/about-renewcred"
              className="text-gray-600 hover:text-gray-900"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-blue-600 font-semibold mb-4">RenewCred CMS</p>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Dynamic Content Management System
          </h1>

          <p className="mt-6 text-xl leading-8 text-gray-600">
            A modern content management platform where administrators can manage
            rich structured content and publish it dynamically to the public
            website.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/about-renewcred"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Rich Content Support
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-semibold">Structured Content</h3>

              <p className="mt-3 text-gray-600">
                Manage headers, paragraphs, lists, tables and structured
                documentation through reusable content blocks.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-semibold">Mathematical Equations</h3>

              <p className="mt-3 text-gray-600">
                Display mathematical expressions using LaTeX and KaTeX
                rendering.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-semibold">Dynamic Publishing</h3>

              <p className="mt-3 text-gray-600">
                Content published from the CMS is automatically available on the
                public-facing website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500">
          © 2026 RenewCred. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
