const express = require("express");

const {
  createPage,
  getAllPages,
  getPublishedPages,
  getPublishedPage,
  updatePage,
  deletePage,
} = require("../controllers/contentController");

const protectRoute = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/public", getPublishedPages);
router.get("/public/:slug", getPublishedPage);

// Protected admin routes
router.use(protectRoute);

// Get all pages
router.get("/", getAllPages);

// Create page
router.post("/", createPage);

// Update page
router.put("/:id", updatePage);

// Delete page
router.delete("/:id", deletePage);

module.exports = router;
