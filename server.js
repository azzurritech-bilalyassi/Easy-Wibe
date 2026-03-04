const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDB = require("./configs/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["https://easyvibe-admin.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
const PORT = process.env.PORT || 5001;
ConnectDB();

// app.get("/test", (req, res) => {
//   res.json({ message: "Api is running" });
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/quiz", quizRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
