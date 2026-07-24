"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import api from "../../../../../services/api";
import PageEditor from "../../../../../components/PageEditor";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);

  const [page, setPage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  // Fetch page
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.get("/content", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const foundPage = response.data.pages.find(
          (item) => item._id === params.id,
        );

        if (!foundPage) {
          setError("Page not found");
          return;
        }

        setPage(foundPage);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load page");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && params.id) {
      fetchPage();
    }
  }, [token, params.id]);

  // Update page
  const handleSubmit = async (pageData) => {
    try {
      setIsSaving(true);
      setError("");

      await api.put(`/content/${params.id}`, pageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update page");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading page...</p>
      </main>
    );
  }

  if (error && !page) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Page</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {page && (
          <PageEditor
            initialData={page}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        )}
      </div>
    </main>
  );
}
