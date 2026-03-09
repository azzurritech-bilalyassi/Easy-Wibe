const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({

  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom"
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: String,

  seen: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);