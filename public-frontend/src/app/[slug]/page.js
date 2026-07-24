import api from "../../services/api";
import BlockRenderer from "../../components/BlockRenderer";

export default async function DynamicPage({ params }) {
  const { slug } = await params;

  try {
    const response = await api.get(`/content/public/${slug}`);

    const page = response.data.page;

    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-12">
            {page.title}
          </h1>

          <BlockRenderer blocks={page.blocks} />
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Page Not Found</h1>

          <p className="text-gray-500 mt-4">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </main>
    );
  }
}
