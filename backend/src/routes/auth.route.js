const express = require("express");
const authController = require("../controllers/auth.controller");
const authRequired = require("../middlewares/authRequired");

const router = express.Router();

// [POST] /api/register
router.post("/register", authController.register);

// [POST] /api/login
router.post("/login", authController.login);

// [POST] /api/login
router.post("/refresh-token", authController.refreshToken);

// [GET] /api/me
router.get("/me", authRequired, authController.getCurrentUser);

// [POST] /api/verify-email
router.post("/verify-email", authController.verifyEmail);

// [POST] /api/resend-verify-email
router.post(
  "/resend-verify-email",
  authRequired,
  authController.resendVerifyEmail,
);

module.exports = router;
