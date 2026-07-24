const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RenewCred CMS API is running",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjI2YzM0YzNmOGUzNGNiMjAxYjA3OSIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHJlbmV3Y3JlZC5jb20iLCJpYXQiOjE3ODQ4MzU0MzQsImV4cCI6MTc4NDkyMTgzNH0.lsZbTV_nEHh1C-ociJV7rrMP3hdONC30OpX6qAdViSo"
