const Page = require("../models/Page");

// Create a new page
const createPage = async (req, res) => {
  try {
    const { title, slug, status, blocks } = req.body;

    // Validate required fields
    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required",
      });
    }

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug });

    if (existingPage) {
      return res.status(409).json({
        success: false,
        message: "A page with this slug already exists",
      });
    }

    // Create page
    const page = await Page.create({
      title,
      slug,
      status: status || "draft",
      blocks: blocks || [],
    });

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      page,
    });
  } catch (error) {
    console.error("Create page error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create page",
    });
  }
};

// Get all pages
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: pages.length,
      pages,
    });
  } catch (error) {
    console.error("Get pages error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pages",
    });
  }
};

// Get all published pages
const getPublishedPages = async (req, res) => {
  try {
    const pages = await Page.find({
      status: "published",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: pages.length,
      pages,
    });
  } catch (error) {
    console.error("Get published pages error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch published pages",
    });
  }
};

// Get a single published page by slug
const getPublishedPage = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOne({
      slug,
      status: "published",
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Published page not found",
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("Get published page error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch page",
    });
  }
};

// Update a page
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, slug, status, blocks } = req.body;

    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // Check if new slug belongs to another page
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ slug });

      if (existingPage) {
        return res.status(409).json({
          success: false,
          message: "A page with this slug already exists",
        });
      }
    }

    page.title = title ?? page.title;
    page.slug = slug ?? page.slug;
    page.status = status ?? page.status;
    page.blocks = blocks ?? page.blocks;

    const updatedPage = await page.save();

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      page: updatedPage,
    });
  } catch (error) {
    console.error("Update page error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update page",
    });
  }
};

// Delete a page
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.findByIdAndDelete(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Delete page error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete page",
    });
  }
};

module.exports = {
  createPage,
  getAllPages,
  getPublishedPages,
  getPublishedPage,
  updatePage,
  deletePage,
};
