const pool = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [[{ totalStudents }]] = await pool.query(
      "SELECT COUNT(*) as totalStudents FROM users WHERE role = 'student'"
    );
    const [[{ totalGrievances }]] = await pool.query(
      "SELECT COUNT(*) as totalGrievances FROM grievances"
    );
    const [[{ resolved }]] = await pool.query(
      "SELECT COUNT(*) as resolved FROM grievances WHERE status = 'Resolved'"
    );
    const [[{ pending }]] = await pool.query(
      "SELECT COUNT(*) as pending FROM grievances WHERE status != 'Resolved'"
    );

    res.json({ totalStudents, totalGrievances, resolved, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEscalations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.*, u.name as student_name 
       FROM grievances g 
       JOIN users u ON g.student_id = u.id 
       WHERE g.status != 'Resolved' 
       ORDER BY g.created_at DESC 
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.name as subject, 
        COUNT(*) as total,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.id
       GROUP BY s.id, s.name`
    );

    const result = rows.map((r) => ({
      subject: r.subject,
      percentage: r.total > 0 ? Math.round((r.present / r.total) * 100) : 0,
      total: r.total,
      present: r.present,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};