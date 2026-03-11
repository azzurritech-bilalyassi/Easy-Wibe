const {
  createOrGetRoom,
  getUserChats,
  getMessages,
} = require("../controllers/chatController");
const router = require("express").Router();

router.post("/room", createOrGetRoom);
router.get("/rooms/:userId", getUserChats);
router.get("/messages/:roomId", getMessages);

module.exports = router;
