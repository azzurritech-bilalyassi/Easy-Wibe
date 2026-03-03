const express = require("express");
const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPassword,
  ResetPassword,
  CheckUserByEmail,
  googleLogin,
//   appleLogin,
} = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", auth, LogoutUser);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);
router.post("/check-user", CheckUserByEmail);
router.post("/google-login", googleLogin);
// router.post("/apple-login", appleLogin);

module.exports = router;
