const pool = require("../config/db");

// Faculty — get their subjects
exports.getSubjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM subjects WHERE faculty_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Faculty — mark attendance
exports.markAttendance = async (req, res) => {
  const { subject_id, date, records } = req.body;
  // records = [{ student_id, status }]

  try {
    for (const record of records) {
      await pool.query(
        `INSERT INTO attendance (student_id, subject_id, date, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?`,
        [record.student_id, subject_id, date, record.status, record.status]
      );
    }
    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Student — get their attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, s.name as subject_name
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.student_id = ?
       ORDER BY a.date DESC`,
      [req.user.id]
    );

    // Group by subject
    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.subject_name]) {
        grouped[row.subject_name] = { total: 0, present: 0, records: [] };
      }
      grouped[row.subject_name].total++;
      if (row.status === "present") grouped[row.subject_name].present++;
      grouped[row.subject_name].records.push(row);
    }

    const result = Object.entries(grouped).map(([subject, data]) => ({
      subject,
      total: data.total,
      present: data.present,
      percentage: Math.round((data.present / data.total) * 100),
      records: data.records,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Faculty — get all students
exports.getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, roll_no, department FROM users WHERE role = 'student'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};