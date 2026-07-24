"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import api from "../../../store/services/api";

export default function CreatePage() {
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");

  const [slug, setSlug] = useState("");

  const [status, setStatus] = useState("draft");

  const [blocks, setBlocks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  // Add a new block
  const addBlock = (type) => {
    const newBlock = {
      type,
      order: blocks.length,
      data: getDefaultData(type),
    };

    setBlocks([...blocks, newBlock]);
  };

  // Default data for each block type
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

  // Update block data
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

  // Create page
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      await api.post(
        "/content",
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
      setError(error.response?.data?.message || "Failed to create page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create Page</h1>

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
                placeholder="Page Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md px-4 py-3"
                required
              />

              <input
                type="text"
                placeholder="Page Slug"
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
              <button
                type="button"
                onClick={() => addBlock("header")}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                + Header
              </button>

              <button
                type="button"
                onClick={() => addBlock("paragraph")}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                + Paragraph
              </button>

              <button
                type="button"
                onClick={() => addBlock("list")}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                + List
              </button>

              <button
                type="button"
                onClick={() => addBlock("table")}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                + Table
              </button>

              <button
                type="button"
                onClick={() => addBlock("equation")}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                + Equation
              </button>
            </div>
          </section>

          {/* Content Blocks */}
          <section className="space-y-6">
            {blocks.map((block, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
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
                    placeholder="Header text"
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
                    placeholder="Write paragraph..."
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
                    placeholder="Enter each list item on a new line"
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
                  <div className="space-y-6">
                    {/* Headers */}
                    <div>
                      <label className="block font-medium mb-2">
                        Table Headers
                      </label>

                      <div className="space-y-2">
                        {block.data.headers.map((header, headerIndex) => (
                          <div key={headerIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={header}
                              onChange={(e) => {
                                const newHeaders = [...block.data.headers];

                                newHeaders[headerIndex] = e.target.value;

                                updateBlockData(index, {
                                  ...block.data,
                                  headers: newHeaders,
                                });
                              }}
                              className="flex-1 border rounded px-4 py-2"
                              placeholder={`Header ${headerIndex + 1}`}
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const newHeaders = block.data.headers.filter(
                                  (_, i) => i !== headerIndex,
                                );

                                const newRows = block.data.rows.map((row) =>
                                  row.filter((_, i) => i !== headerIndex),
                                );

                                updateBlockData(index, {
                                  ...block.data,
                                  headers: newHeaders,
                                  rows: newRows,
                                });
                              }}
                              className="text-red-600 px-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateBlockData(index, {
                            ...block.data,
                            headers: [
                              ...block.data.headers,
                              `Header ${block.data.headers.length + 1}`,
                            ],
                            rows: block.data.rows.map((row) => [...row, ""]),
                          });
                        }}
                        className="mt-3 text-blue-600"
                      >
                        + Add Column
                      </button>
                    </div>

                    {/* Rows */}
                    <div>
                      <label className="block font-medium mb-2">
                        Table Rows
                      </label>

                      <div className="space-y-4">
                        {block.data.rows.map((row, rowIndex) => (
                          <div key={rowIndex} className="border p-4 rounded">
                            <div className="flex gap-2">
                              {row.map((cell, cellIndex) => (
                                <input
                                  key={cellIndex}
                                  type="text"
                                  value={cell}
                                  onChange={(e) => {
                                    const newRows = [...block.data.rows];

                                    newRows[rowIndex][cellIndex] =
                                      e.target.value;

                                    updateBlockData(index, {
                                      ...block.data,
                                      rows: newRows,
                                    });
                                  }}
                                  placeholder={`Cell ${cellIndex + 1}`}
                                  className="flex-1 border rounded px-3 py-2"
                                />
                              ))}

                              <button
                                type="button"
                                onClick={() => {
                                  const newRows = block.data.rows.filter(
                                    (_, i) => i !== rowIndex,
                                  );

                                  updateBlockData(index, {
                                    ...block.data,
                                    rows: newRows,
                                  });
                                }}
                                className="text-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateBlockData(index, {
                            ...block.data,
                            rows: [
                              ...block.data.rows,
                              block.data.headers.map(() => ""),
                            ],
                          });
                        }}
                        className="mt-3 text-blue-600"
                      >
                        + Add Row
                      </button>
                    </div>
                  </div>
                )}

                {/* Equation */}
                {block.type === "equation" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter LaTeX equation, e.g. x^2 + y^2 = z^2"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Page"}
          </button>
        </form>
      </div>
    </main>
  );
}
