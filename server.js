const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDB = require("./configs/db");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const moodRoutes = require("./routes/moodRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const { initializeSocket } = require("./sockets/chatSocket");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "https://easywibe.azzurritech.com",
      "https://easyvibe-admin.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());
const PORT = process.env.PORT || 5001;
ConnectDB();
app.use(express.static(path.join(__dirname, "public")));

// app.get("/test", (req, res) => {
//   res.json({ message: "Api is running" });
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://easywibe.azzurritech.com",
      "https://easyvibe-admin.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeSocket(io);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
