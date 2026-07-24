"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function BlockRenderer({ blocks = [] }) {
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {sortedBlocks.map((block, index) => {
        switch (block.type) {
          // Header
          case "header":
            return (
              <h2
                key={block._id || index}
                className="text-3xl font-bold text-gray-900"
              >
                {block.data.text}
              </h2>
            );

          // Paragraph
          case "paragraph":
            return (
              <p
                key={block._id || index}
                className="text-lg leading-8 text-gray-700"
              >
                {block.data.text}
              </p>
            );

          // List
          case "list":
            return (
              <ul
                key={block._id || index}
                className="list-disc pl-8 space-y-2 text-lg text-gray-700"
              >
                {block.data.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {typeof item === "string" ? item : item.text}
                  </li>
                ))}
              </ul>
            );

          // Table
          case "table":
            return (
              <div key={block._id || index} className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      {block.data.headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          className="border border-gray-300 px-6 py-3 text-left font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {block.data.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border border-gray-300 px-6 py-3"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          // Equation
          case "equation":
            return (
              <div
                key={block._id || index}
                className="bg-gray-50 p-6 rounded-lg overflow-x-auto"
              >
                {block.data.displayMode ? (
                  <BlockMath math={block.data.equation} />
                ) : (
                  <p className="text-lg">
                    <InlineMath math={block.data.equation} />
                  </p>
                )}
              </div>
            );

          // Unknown block
          default:
            return (
              <div
                key={block._id || index}
                className="p-4 bg-yellow-100 text-yellow-800 rounded"
              >
                Unsupported block type: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
}
