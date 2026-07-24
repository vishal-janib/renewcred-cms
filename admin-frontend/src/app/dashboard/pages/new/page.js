"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import api from "../../../../services/api";
import PageEditor from "../../../../components/PageEditor";

export default function NewPage() {
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (pageData) => {
    try {
      setIsLoading(true);
      setError("");

      await api.post("/content", pageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful creation
      router.push("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Page</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <PageEditor onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}
