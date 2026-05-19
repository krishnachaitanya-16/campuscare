const express = require("express");
const router = express.Router();
const {
  login,
  getMe,
  saveFaceDescriptor,
  getStudentFaces,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
 
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/face", authMiddleware, saveFaceDescriptor);
router.get("/faces", authMiddleware, getStudentFaces);
 
module.exports = router;
 