const express = require("express");
const passport = require("passport");
const router = express.Router();
const { googleCallbackHandler, logoutUser } = require("../controllers/googleauth.controller");

require("../config/passport.js");

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth 2.0 authentication flow
 * @access  Public
 */

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth redirect callback landing endpoint
 * @access  Public
 */

router.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }),
  googleCallbackHandler
);

/**
 * @route   GET /api/auth/google/failure
 * @desc    Failure landing endpoint for failed or rejected authentication
 * @access  Public
 */
router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google OAuth authentication failed or was cancelled.",
  });
});

/**
 * @route   POST /api/auth/google/logout
 * @desc    Destroys active session
 * @access  Public
 */
router.post("/logout", logoutUser);

module.exports = router;
