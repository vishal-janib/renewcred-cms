const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./src/models/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingAdmin = await Admin.findOne({
      email: "admin@renewcred.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await Admin.create({
      username: "admin",
      email: "admin@renewcred.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
