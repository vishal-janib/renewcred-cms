"use client";

import { useState } from "react";

export default function PageEditor({ initialData, onSubmit, isLoading }) {
  const [title, setTitle] = useState(initialData?.title || "");

  const [slug, setSlug] = useState(initialData?.slug || "");

  const [status, setStatus] = useState(initialData?.status || "draft");

  const [blocks, setBlocks] = useState(initialData?.blocks || []);

  // Add a new content block
  const addBlock = (type) => {
    let data = {};

    if (type === "header" || type === "paragraph") {
      data = {
        text: "",
      };
    }

    if (type === "list") {
      data = {
        items: [""],
      };
    }

    if (type === "table") {
      data = {
        headers: ["Column 1", "Column 2"],
        rows: [["", ""]],
      };
    }

    if (type === "equation") {
      data = {
        equation: "",
        displayMode: true,
      };
    }

    const newBlock = {
      type,
      data,
      order: blocks.length,
    };

    setBlocks((prev) => [...prev, newBlock]);
  };

  // Update block data
  const updateBlock = (index, data) => {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index
          ? {
              ...block,
              data,
            }
          : block,
      ),
    );
  };

  // Remove block
  const removeBlock = (index) => {
    setBlocks((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((block, i) => ({
          ...block,
          order: i,
        })),
    );
  };

  // Update list item
  const updateListItem = (blockIndex, itemIndex, value) => {
    const updatedItems = [...blocks[blockIndex].data.items];

    updatedItems[itemIndex] = value;

    updateBlock(blockIndex, {
      ...blocks[blockIndex].data,
      items: updatedItems,
    });
  };

  // Add list item
  const addListItem = (blockIndex) => {
    const items = [...blocks[blockIndex].data.items, ""];

    updateBlock(blockIndex, {
      ...blocks[blockIndex].data,
      items,
    });
  };

  // Remove list item
  const removeListItem = (blockIndex, itemIndex) => {
    const items = blocks[blockIndex].data.items.filter(
      (_, i) => i !== itemIndex,
    );

    updateBlock(blockIndex, {
      ...blocks[blockIndex].data,
      items,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      title,
      slug,
      status,
      blocks,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Page Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter page title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="about-us"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="draft">Draft</option>

              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Blocks */}
      <div className="bg-white p-6 rounded-lg shadow">
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
      </div>

      {/* Blocks */}
      <div className="space-y-4">
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
                value={block.data.text}
                onChange={(e) =>
                  updateBlock(index, {
                    text: e.target.value,
                  })
                }
                placeholder="Enter heading"
                className="w-full border rounded-md px-3 py-2"
              />
            )}

            {/* Paragraph */}
            {block.type === "paragraph" && (
              <textarea
                value={block.data.text}
                onChange={(e) =>
                  updateBlock(index, {
                    text: e.target.value,
                  })
                }
                placeholder="Enter paragraph"
                rows={5}
                className="w-full border rounded-md px-3 py-2"
              />
            )}

            {/* List */}
            {block.type === "list" && (
              <div className="space-y-3">
                {block.data.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateListItem(index, itemIndex, e.target.value)
                      }
                      className="flex-1 border rounded-md px-3 py-2"
                      placeholder={`List item ${itemIndex + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeListItem(index, itemIndex)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addListItem(index)}
                  className="text-blue-600"
                >
                  + Add Item
                </button>
              </div>
            )}

            {/* Table */}
            {block.type === "table" && (
              <div className="space-y-4">
                <h4 className="font-medium">Table Headers</h4>

                {block.data.headers.map((header, headerIndex) => (
                  <div key={headerIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => {
                        const headers = [...block.data.headers];

                        headers[headerIndex] = e.target.value;

                        updateBlock(index, {
                          ...block.data,
                          headers,
                        });
                      }}
                      className="flex-1 border rounded-md px-3 py-2"
                      placeholder={`Header ${headerIndex + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const headers = block.data.headers.filter(
                          (_, i) => i !== headerIndex,
                        );

                        const rows = block.data.rows.map((row) =>
                          row.filter((_, i) => i !== headerIndex),
                        );

                        updateBlock(index, {
                          ...block.data,
                          headers,
                          rows,
                        });
                      }}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const headers = [
                      ...block.data.headers,
                      `Column ${block.data.headers.length + 1}`,
                    ];

                    const rows = block.data.rows.map((row) => [...row, ""]);

                    updateBlock(index, {
                      ...block.data,
                      headers,
                      rows,
                    });
                  }}
                  className="text-blue-600"
                >
                  + Add Column
                </button>

                <h4 className="font-medium mt-6">Table Rows</h4>

                {block.data.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="border p-4 rounded-md space-y-2"
                  >
                    {row.map((cell, cellIndex) => (
                      <input
                        key={cellIndex}
                        type="text"
                        value={cell}
                        onChange={(e) => {
                          const rows = block.data.rows.map((existingRow) => [
                            ...existingRow,
                          ]);

                          rows[rowIndex][cellIndex] = e.target.value;

                          updateBlock(index, {
                            ...block.data,
                            rows,
                          });
                        }}
                        className="w-full border rounded-md px-3 py-2"
                        placeholder={`Row ${rowIndex + 1}, Column ${
                          cellIndex + 1
                        }`}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const rows = block.data.rows.filter(
                          (_, i) => i !== rowIndex,
                        );

                        updateBlock(index, {
                          ...block.data,
                          rows,
                        });
                      }}
                      className="text-red-600"
                    >
                      Remove Row
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newRow = block.data.headers.map(() => "");

                    updateBlock(index, {
                      ...block.data,
                      rows: [...block.data.rows, newRow],
                    });
                  }}
                  className="text-blue-600"
                >
                  + Add Row
                </button>
              </div>
            )}

            {/* Equation */}
            {block.type === "equation" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={block.data.equation}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block.data,
                      equation: e.target.value,
                    })
                  }
                  placeholder="Example: E = mc^2"
                  className="w-full border rounded-md px-3 py-2"
                />

                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={block.data.displayMode}
                    onChange={(e) =>
                      updateBlock(index, {
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
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Page"}
      </button>
    </form>
  );
}
