const pool = require("../config/db");

// Student — submit grievance
exports.submitGrievance = async (req, res) => {
  const { title, category, description } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    await pool.query(
      `INSERT INTO grievances (student_id, title, category, description, status)
       VALUES (?, ?, ?, ?, 'Submitted')`,
      [req.user.id, title, category, description]
    );
    res.json({ message: "Grievance submitted successfully." });
  } catch (err) {
    console.error("Submit grievance error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Student — get their grievances
exports.getMyGrievances = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM grievances WHERE student_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get grievances error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Warden — get all grievances
exports.getAllGrievances = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.*, u.name as student_name, u.room_no 
       FROM grievances g 
       JOIN users u ON g.student_id = u.id 
       ORDER BY g.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Get all grievances error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Warden — respond to grievance
exports.respondToGrievance = async (req, res) => {
  const { id } = req.params;
  const { response, status } = req.body;

  try {
    await pool.query(
      `UPDATE grievances SET response = ?, status = ? WHERE id = ?`,
      [response, status, id]
    );
    res.json({ message: "Response sent successfully." });
  } catch (err) {
    console.error("Respond grievance error:", err);
    res.status(500).json({ message: err.message });
  }
};