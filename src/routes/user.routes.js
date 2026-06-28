const express = require("express");
const userRouter = express.Router();
const { updateUserRole } = require("../controllers/auth.controller.js");
const { requireAuth, requireRole, isVerified } = require("../middleware/auth.middleware.js");

// All routes here require authentication (using requireAuth instead of protect)
userRouter.use(requireAuth);

/**
 * @route   GET /api/users/admin/dashboard
 * @access  Private (Admin Only)
 */
userRouter.get(
  "/admin/dashboard",
  requireRole("admin"), // Changed authorize -> requireRole
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the Admin Dashboard.",
      data: {
        systemStatus: "Healthy",
        totalUsers: 482,
        activeGigs: 128,
        pendingReports: 3,
      },
    });
  }
);

/**
 * @route   PUT /api/users/:id/role
 * @access  Private (Admin Only)
 */
userRouter.put("/:id/role", requireRole("admin"), updateUserRole); // Changed authorize -> requireRole

/**
 * @route   GET /api/users/freelancer/gigs
 * @access  Private (Freelancer Only + Verified Email Required)
 */
userRouter.get(
  "/freelancer/gigs",
  requireRole("freelancer"), // Changed authorize -> requireRole
  isVerified, 
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Freelancer! Here are your gigs.",
      gigs: [
        { id: 1, title: "Build Portfolio Website", client: "Acme Corp", budget: "$1,200", status: "In Progress" },
        { id: 2, title: "Optimize Database Schema", client: "ScaleUp", budget: "$800", status: "Under Review" },
      ],
    });
  }
);

/**
 * @route   GET /api/users/client/projects
 * @access  Private (Client Only)
 */
userRouter.get(
  "/client/projects",
  requireRole("client"), // Changed authorize -> requireRole
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Client! Here are your active project contracts.",
      projects: [
        { id: 101, title: "Mobile App Development", freelancer: "Sarah Dev", status: "Active" },
        { id: 102, title: "SEO Copywriting", freelancer: "John Writer", status: "Pending Hire" },
      ],
    });
  }
);

/**
 * @route   GET /api/users/shared/workspace
 * @access  Private (Freelancer and Client Shared Workspace)
 */
userRouter.get(
  "/shared/workspace",
  requireRole("freelancer", "client"), // Changed authorize -> requireRole
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the Shared Collaboration Workspace.",
      notices: [
        { id: 1, from: "System", message: "Weekly maintenance on Sunday at 02:00 UTC." },
      ],
    });
  }
);

module.exports = userRouter;