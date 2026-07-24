const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["header", "paragraph", "list", "table", "equation"],
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: true,
  },
);

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;
