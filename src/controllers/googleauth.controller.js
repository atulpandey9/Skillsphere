const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const googleCallbackHandler = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed. No user profile was resolved.",
      });
    }

     const token = generateToken(req.user._id, req.user.role);

     return res.status(200).json({
  success: true,
  token,
  user: req.user,
});
  }
     catch (error) {
    console.error("Google Auth Callback Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during OAuth session generation.",
    });
     }}

     
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
