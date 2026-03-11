const Message = require("../models/Message");
const User = require("../models/User");

const onlineUsers = {};

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    setupUser(socket, io);
    joinRoom(socket);
    typingHandler(socket);
    stopTypingHandler(socket);
    sendMessageHandler(socket, io);
    disconnectHandler(socket, io);
  });
};

// Setup user
const setupUser = (socket, io) => {
  socket.on("setup", async (userId) => {
    socket.userId = userId;

    onlineUsers[userId] = socket.id;

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });

    io.emit("user_online", userId);
  });
};

// Join room
const joinRoom = (socket) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });
};

// Typing
const typingHandler = (socket) => {
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", data);
  });
};

// Stop typing
const stopTypingHandler = (socket) => {
  socket.on("stop_typing", (roomId) => {
    socket.to(roomId).emit("stop_typing");
  });
};

// Send message
const sendMessageHandler = (socket, io) => {
  socket.on("send_message", async (data) => {
    const message = await Message.create({
      roomId: data.roomId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
    });

    io.to(data.roomId).emit("receive_message", message);
  });
};

// Disconnect
const disconnectHandler = (socket, io) => {
  socket.on("disconnect", async () => {
    const userId = socket.userId;

    if (userId) {
      delete onlineUsers[userId];

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      io.emit("user_offline", userId);
    }

    console.log("User disconnected");
  });
};

// 🔹 Export at bottom
module.exports = {
  initializeSocket,
};
