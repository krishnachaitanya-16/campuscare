const express = require("express");
const router = express.Router();
const {
  getSubjects,
  markAttendance,
  getMyAttendance,
  getStudents,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Student
router.get("/my", authMiddleware, roleMiddleware("student"), getMyAttendance);

// Faculty
router.get("/subjects", authMiddleware, roleMiddleware("faculty"), getSubjects);
router.get("/students", authMiddleware, roleMiddleware("faculty"), getStudents);
router.post("/mark", authMiddleware, roleMiddleware("faculty"), markAttendance);

module.exports = router;