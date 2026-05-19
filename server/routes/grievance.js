const express = require("express");
const router = express.Router();
const {
  submitGrievance,
  getMyGrievances,
  getAllGrievances,
  respondToGrievance,
} = require("../controllers/grievanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Student
router.post("/", authMiddleware, roleMiddleware("student"), submitGrievance);
router.get("/my", authMiddleware, roleMiddleware("student"), getMyGrievances);

// Warden
router.get("/all", authMiddleware, roleMiddleware("warden"), getAllGrievances);
router.patch("/:id/respond", authMiddleware, roleMiddleware("warden"), respondToGrievance);

module.exports = router;