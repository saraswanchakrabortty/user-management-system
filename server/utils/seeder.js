require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const users = [
  {
    name: "Super Admin",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
    status: "active",
  },
  {
    name: "Miss Manager",
    email: "manager@example.com",
    password: "Manager@123",
    role: "manager",
    status: "active",
  },
  {
    name: "Karamchari User",
    email: "user@example.com",
    password: "User@123",
    role: "user",
    status: "active",
  },
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to DB");

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⚠️ Skipped: ${userData.email} already exists`);
        continue;
      }

      const user = new User(userData);
      await user.save(); // triggers password hashing via pre-save hook

      console.log(`✅ Created: ${userData.email}`);
    }

    console.log("🌱 Seeding process completed");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUsers();