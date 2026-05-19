const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");
const grievanceRoutes = require("./routes/grievance");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grievance", grievanceRoutes);
app.use("/api/head", require("./routes/head"));

app.get("/", (req, res) => res.send("CampusCare API running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));