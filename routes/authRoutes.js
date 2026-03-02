const express = require("express");
const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPassword,
  ResetPassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", auth, LogoutUser);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);

module.exports = router;
