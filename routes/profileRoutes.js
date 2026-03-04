const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const { auth } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.get("/", auth, getProfile);
router.put("/", auth, upload.single("profileImage"), updateProfile);

module.exports = router;
