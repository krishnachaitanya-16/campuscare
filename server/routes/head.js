const express = require("express");
const router = express.Router();
const { getStats, getEscalations, getAttendanceSummary } = require("../controllers/headController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/stats", authMiddleware, roleMiddleware("head"), getStats);
router.get("/escalations", authMiddleware, roleMiddleware("head"), getEscalations);
router.get("/attendance-summary", authMiddleware, roleMiddleware("head"), getAttendanceSummary);

module.exports = router;