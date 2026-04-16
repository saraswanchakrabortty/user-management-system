const ensureAdminExists = require("../utils/adminGuard");
const User = require("../models/User");

// @desc    Get all users (paginated + searchable + filterable)
// @route   GET /api/users
// @access  Admin, Manager
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Managers cannot see admin users
    if (req.user.role === "manager") {
      filter.role = { $ne: "admin" };
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin, Manager, Self
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Regular users can only see themselves
    if (req.user.role === "user" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Managers cannot see admin details
    if (req.user.role === "manager" && user.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Admin only
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      status: status || "active",
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin (all fields), Manager (non-admins, limited), User (own profile only)
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const requesterId = req.user._id.toString();
    const targetId = req.params.id;
    const requesterRole = req.user.role;

    // Regular user: can only update themselves, cannot change role or status
    if (requesterRole === "user") {
      if (requesterId !== targetId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const { name, password } = req.body;
      if (name) user.name = name;
      if (password) user.password = password;
      user.updatedBy = req.user._id;
      await user.save();
      return res.status(200).json({ success: true, user });
    }

    // Manager: cannot update admins, cannot change status or password, cannot assign admin role
    if (requesterRole === "manager") {
      if (user.role === "admin") {
        return res.status(403).json({ message: "Cannot modify admin users" });
      }

      // Block admin role assignment
      if (req.body.role && req.body.role === "admin") {
        return res.status(403).json({ message: "Managers cannot assign admin role" });
      }

      // Block status change only if explicitly sent with a value
      if (req.body.status !== undefined && req.body.status !== null && req.body.status !== "") {
        return res.status(403).json({ message: "Managers cannot change user status" });
      }

      // Block password change only if explicitly sent with a value
      if (req.body.password !== undefined && req.body.password !== null && req.body.password !== "") {
        return res.status(403).json({ message: "Managers cannot change user password" });
      }

      const { name, email, role } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      user.updatedBy = req.user._id;
      await user.save();
      return res.status(200).json({ success: true, user });
    }

    // Admin: check if this change would lock out the system
    await ensureAdminExists(targetId, {
      role: req.body.role,
      status: req.body.status,
    });

    const { name, email, role, status, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) user.password = password;
    user.updatedBy = req.user._id;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete (deactivate) user
// @route   DELETE /api/users/:id
// @access  Admin only
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    // Check if deleting this user would lock out the system
    await ensureAdminExists(req.params.id, { status: "inactive" });

    user.status = "inactive";
    user.updatedBy = req.user._id;
    await user.save();

    res.status(200).json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };