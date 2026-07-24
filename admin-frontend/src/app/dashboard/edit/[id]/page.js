"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import api from "../../../../store/services/api";

export default function EditPage({ params }) {
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);

  const [pageId, setPageId] = useState(null);

  const [title, setTitle] = useState("");

  const [slug, setSlug] = useState("");

  const [status, setStatus] = useState("draft");

  const [blocks, setBlocks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  // Get page ID from URL
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;

      setPageId(resolvedParams.id);
    };

    getParams();
  }, [params]);

  // Fetch page
  useEffect(() => {
    if (!pageId || !token) {
      return;
    }

    const fetchPage = async () => {
      try {
        const response = await api.get(`/content/${pageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const page = response.data.page;

        setTitle(page.title);
        setSlug(page.slug);
        setStatus(page.status);
        setBlocks(page.blocks || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch page");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [pageId, token]);

  // Update block
  const updateBlockData = (index, data) => {
    const updatedBlocks = [...blocks];

    updatedBlocks[index].data = data;

    setBlocks(updatedBlocks);
  };

  // Remove block
  const removeBlock = (index) => {
    const updatedBlocks = blocks.filter(
      (_, blockIndex) => blockIndex !== index,
    );

    const reorderedBlocks = updatedBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));

    setBlocks(reorderedBlocks);
  };

  // Add block
  const addBlock = (type) => {
    const newBlock = {
      type,
      order: blocks.length,
      data: getDefaultData(type),
    };

    setBlocks([...blocks, newBlock]);
  };

  // Default block data
  const getDefaultData = (type) => {
    switch (type) {
      case "header":
        return {
          text: "",
        };

      case "paragraph":
        return {
          text: "",
        };

      case "list":
        return {
          items: [""],
        };

      case "table":
        return {
          headers: ["Header 1", "Header 2"],
          rows: [["", ""]],
        };

      case "equation":
        return {
          equation: "",
          displayMode: true,
        };

      default:
        return {};
    }
  };

  // Save changes
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");

      await api.put(
        `/content/${pageId}`,
        {
          title,
          slug,
          status,
          blocks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Page</h1>

          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Page Information */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Page Information</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md px-4 py-3"
                required
              />

              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border rounded-md px-4 py-3"
                required
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-md px-4 py-3"
              >
                <option value="draft">Draft</option>

                <option value="published">Published</option>
              </select>
            </div>
          </section>

          {/* Add Blocks */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Content Block</h2>

            <div className="flex flex-wrap gap-3">
              {["header", "paragraph", "list", "table", "equation"].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="bg-gray-800 text-white px-4 py-2 rounded capitalize"
                  >
                    + {type}
                  </button>
                ),
              )}
            </div>
          </section>

          {/* Blocks */}
          <section className="space-y-6">
            {blocks.map((block, index) => (
              <div
                key={block._id || index}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold capitalize">{block.type}</h3>

                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>

                {/* Header */}
                {block.type === "header" && (
                  <input
                    type="text"
                    value={block.data.text}
                    onChange={(e) =>
                      updateBlockData(index, {
                        text: e.target.value,
                      })
                    }
                    className="w-full border rounded px-4 py-3"
                  />
                )}

                {/* Paragraph */}
                {block.type === "paragraph" && (
                  <textarea
                    value={block.data.text}
                    onChange={(e) =>
                      updateBlockData(index, {
                        text: e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full border rounded px-4 py-3"
                  />
                )}

                {/* List */}
                {block.type === "list" && (
                  <textarea
                    value={block.data.items.join("\n")}
                    onChange={(e) =>
                      updateBlockData(index, {
                        items: e.target.value.split("\n"),
                      })
                    }
                    rows={5}
                    className="w-full border rounded px-4 py-3"
                  />
                )}

                {/* Table */}
                {block.type === "table" && (
                  <div className="space-y-4">
                    <p className="font-medium">Table data</p>

                    <textarea
                      value={JSON.stringify(block.data, null, 2)}
                      onChange={(e) => {
                        try {
                          const data = JSON.parse(e.target.value);

                          updateBlockData(index, data);
                        } catch {
                          // Invalid JSON
                        }
                      }}
                      rows={10}
                      className="w-full border rounded px-4 py-3 font-mono text-sm"
                    />
                  </div>
                )}

                {/* Equation */}
                {block.type === "equation" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={block.data.equation}
                      onChange={(e) =>
                        updateBlockData(index, {
                          ...block.data,
                          equation: e.target.value,
                        })
                      }
                      className="w-full border rounded px-4 py-3"
                    />

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={block.data.displayMode}
                        onChange={(e) =>
                          updateBlockData(index, {
                            ...block.data,
                            displayMode: e.target.checked,
                          })
                        }
                      />
                      Display as block equation
                    </label>
                  </div>
                )}
              </div>
            ))}
          </section>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
