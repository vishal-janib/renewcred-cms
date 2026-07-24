const express = require("express");
const { loginAdmin } = require("../controllers/authController");

const protectRoute = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/profile", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You have access to the protected route",
    admin: req.admin,
  });
});

module.exports = router;
