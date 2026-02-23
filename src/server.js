const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./configs/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
dotenv.config();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 5001;
ConnectDB();

// app.get("/test", (req, res) => {
//   res.json({ message: "Api is running" });
// });

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
