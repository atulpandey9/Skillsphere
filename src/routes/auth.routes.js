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

router.get("/me", requireAuth, getMe);

router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);






module.exports = router;