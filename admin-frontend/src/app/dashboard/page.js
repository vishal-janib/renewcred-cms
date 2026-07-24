"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import api from "../../store/services/api";
import { logout } from "../../store/slices/authSlice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const response = await api.get("/content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPages(response.data.pages);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }

    fetchPages();
  }, [isAuthenticated, token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this page?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPages((currentPages) =>
        currentPages.filter((page) => page._id !== id),
      );
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">RenewCred CMS</h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Pages</h2>

            <p className="text-gray-600 mt-2">Manage your website content.</p>
          </div>

          <Link
            href="/dashboard/create"
            className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700"
          >
            Create Page
          </Link>
        </div>

        {/* Empty State */}
        {pages.length === 0 && (
          <div className="bg-white rounded-lg p-10 text-center">
            <p className="text-gray-500">No pages found.</p>

            <Link
              href="/dashboard/create"
              className="text-blue-600 mt-4 inline-block"
            >
              Create your first page
            </Link>
          </div>
        )}

        {/* Pages */}
        {pages.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">Title</th>

                    <th className="px-6 py-4 text-left">Slug</th>

                    <th className="px-6 py-4 text-left">Status</th>

                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pages.map((page) => (
                    <tr key={page._id} className="border-t">
                      <td className="px-6 py-4 font-medium">{page.title}</td>

                      <td className="px-6 py-4 text-gray-600">{page.slug}</td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            page.status === "published"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {page.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/dashboard/edit/${page._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(page._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
