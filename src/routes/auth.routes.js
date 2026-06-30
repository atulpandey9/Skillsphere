const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller.js");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth.middleware.js");

const{ registeruserController,
    loginuserController,
    logoutUserController,
    verifyEmail,
    updateUserRole,
    getMe,
    forgotPassword,
    resetPassword}=require('../controllers/auth.controller.js')


router.post("/register", AuthController.registeruserController);

router.post("/login", AuthController.loginuserController);

router.get("/logout", AuthController. logoutUserController);

router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);




// router.get("/admin/dashboard",requireAuth,requireRole("admin"),AdminController.getAllUsers)

// router.get("/freelancerdashboard",requireAuth,requireRole("freelancer"),freelancercontroller.dashboard)

// router.get(
//     "/projects",
//     requireAuth,
//     requireRole("admin", "client"),
//     ProjectController.getProjects
// );

// router.post(
//   "/forgot-password",
//   AuthController.requestPasswordReset
// );

// router.post(
//   "/reset-password",
//   AuthController.resetPassword
// );

// router.post(
//   "/google-login",
//   AuthController.googleOAuthLogin
// );



// router.post(
//   "/setup-2fa",
//   requireAuth,
//   AuthController.setup2FA
// );

// router.post(
//   "/verify-2fa",
//   AuthController.verify2FA
// );


// router.post(
//   "/logout",
//   requireAuth,
//   AuthController.logout
// );

module.exports = router;