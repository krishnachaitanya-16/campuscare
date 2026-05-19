const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found." });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password." });

    if (user.role !== role.toLowerCase()) {
      return res.status(400).json({ message: "Role mismatch." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, roll_no, department, room_no, phone, face_descriptor FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveFaceDescriptor = async (req, res) => {
  const { descriptor } = req.body;
  try {
    await pool.query(
      "UPDATE users SET face_descriptor = ? WHERE id = ?",
      [JSON.stringify(descriptor), req.user.id]
    );
    res.json({ message: "Face registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentFaces = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, roll_no, face_descriptor FROM users WHERE role = 'student' AND face_descriptor IS NOT NULL"
    );
    const result = rows.map((r) => ({
      ...r,
      face_descriptor: JSON.parse(r.face_descriptor),
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};