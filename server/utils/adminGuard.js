const User = require("../models/User");

/**
 * Ensures there is always at least one active admin in the system.
 * Call this before any operation that could remove/demote an admin.
 *
 * @param {string} targetUserId - the user being modified
 * @param {object} changes - what's being changed { role, status }
 */
const ensureAdminExists = async (targetUserId, changes = {}) => {
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return; // user not found, let controller handle it

  const isCurrentlyAdmin = targetUser.role === "admin";
  const isCurrentlyActive = targetUser.status === "active";

  const willLoseAdminRole = changes.role && changes.role !== "admin";
  const willBecomeInactive = changes.status && changes.status === "inactive";

  // Only matters if this person IS currently an active admin
  // and the change will remove their admin access
  if (isCurrentlyAdmin && isCurrentlyActive && (willLoseAdminRole || willBecomeInactive)) {
    const activeAdminCount = await User.countDocuments({
      role: "admin",
      status: "active",
    });

    if (activeAdminCount <= 1) {
      const error = new Error(
        "This is the last active admin. Promote another user to admin before making this change."
      );
      error.statusCode = 400;
      throw error;
    }
  }
};

module.exports = ensureAdminExists;