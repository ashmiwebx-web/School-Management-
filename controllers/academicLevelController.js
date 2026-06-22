const pool = require("../config/db");

const pad = (num) => String(num).padStart(4, "0");

exports.getAcademicLevels = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        level_id AS "levelId",
        level_name AS "levelName"
      FROM academic_levels
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAcademicLevel = async (req, res) => {
  try {
    const { levelName, academicLevel } = req.body;
    const name = String(levelName || academicLevel || "").trim().toUpperCase();

    if (!name) {
      return res.status(400).json({ message: "Academic Level is required" });
    }

    const exists = await pool.query(
      `
      SELECT id FROM academic_levels
      WHERE LOWER(TRIM(level_name)) = LOWER(TRIM($1))
      `,
      [name]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({
        message: `${name} already created`,
      });
    }

    const count = await pool.query(`SELECT COUNT(*) FROM academic_levels`);
    const levelId = `LVL${pad(Number(count.rows[0].count) + 1)}`;

    const result = await pool.query(
      `
      INSERT INTO academic_levels (level_id, level_name)
      VALUES ($1, $2)
      RETURNING
        id,
        level_id AS "levelId",
        level_name AS "levelName"
      `,
      [levelId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};