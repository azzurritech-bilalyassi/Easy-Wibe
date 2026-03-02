const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);

module.exports = router;
