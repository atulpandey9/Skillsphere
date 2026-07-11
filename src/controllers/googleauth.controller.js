const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const googleCallbackHandler = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=google_failed`);
    }

    const token = generateToken(req.user._id, req.user.role);

    // Encode user as base64 JSON so it travels safely in the query string
    const userPayload = Buffer.from(JSON.stringify(req.user)).toString("base64");

    // Redirect browser to the frontend callback page with credentials
    return res.redirect(
      `${FRONTEND_URL}/auth/google/callback?token=${token}&user=${userPayload}`
    );
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return res.redirect(`${FRONTEND_URL}/login?error=server_error`);
  }
};

     
     const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      message: "Successfully logged out from active sessions.",
    });
  });
};


module.exports={
    googleCallbackHandler,
    logoutUser
}
