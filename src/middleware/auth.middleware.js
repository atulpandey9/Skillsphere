const AuthService = require("../services/auth.service");
const User = require("../models/user.model");

// Verify JWT Token
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token not provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = AuthService.verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 2FA Check
    const isVerifying2FA =
      req.path === "/verify-2fa" ||
      req.path === "/2fa/verify";

    if (
      user.isTwoFactorEnabled &&
      !decoded.isTwoFactorVerified &&
      !isVerifying2FA
    ) {
      return res.status(403).json({
        success: false,
        message: "Two-factor authentication required",
        require2FA: true,
      });
    }

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.twoFactorSecret;

    req.user = userObj;
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Role Based Access Control
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

const isVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      success: false,
      message: "Verification check called without authentication protection.",
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email address to access this resource.",
    });
  }

  next();
};


module.exports = {
  requireAuth,
  requireRole,
  isVerified
};