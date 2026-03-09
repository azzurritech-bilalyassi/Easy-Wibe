const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

// Create or Get Room
const createOrGetRoom = async (req, res) => {
  const { user1, user2 } = req.body;

  let room = await ChatRoom.findOne({
    participants: { $all: [user1, user2] }
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [user1, user2]
    });
  }

  res.json(room);
};

// Get Messages
const getMessages = async (req, res) => {
  const { roomId } = req.params;

  const messages = await Message.find({ roomId })
    .sort({ createdAt: 1 });

  res.json(messages);
};

// Get User Chats
const getUserChats = async (req, res) => {
  const { userId } = req.params;

  const rooms = await ChatRoom.find({
    participants: userId
  }).populate("participants");

  res.json(rooms);
};


// 🔹 Export all functions at the bottom
module.exports = {
  createOrGetRoom,
  getMessages,
  getUserChats
};