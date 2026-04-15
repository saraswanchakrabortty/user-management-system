require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const seed = async () => {
  await connectDB();

  await User.deleteMany({});

  const users = [
    {
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
      status: "active",
    },
    {
      name: "Jane Manager",
      email: "manager@example.com",
      password: "Manager@123",
      role: "manager",
      status: "active",
    },
    {
      name: "John User",
      email: "user@example.com",
      password: "User@123",
      role: "user",
      status: "active",
    },
  ];

  // Use .save() on each user individually so the pre('save') hook runs
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
  }

  console.log("✅ Database seeded successfully with hashed passwords");
  process.exit();
};

seed();