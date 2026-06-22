const pool = require("../config/db");

const pad = (num) => String(num).padStart(4, "0");

exports.getSections = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        section_id AS "sectionId",
        section_name AS "sectionName"
      FROM sections
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { sectionName } = req.body;
    const name = String(sectionName || "").trim().toUpperCase();

    if (!name) {
      return res.status(400).json({ message: "Section Name is required" });
    }

    const exists = await pool.query(
      `SELECT id FROM sections WHERE LOWER(TRIM(section_name)) = LOWER(TRIM($1))`,
      [name]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: `Section ${name} already created` });
    }

    const count = await pool.query(`SELECT COUNT(*) FROM sections`);
    const sectionId = `SEC${pad(Number(count.rows[0].count) + 1)}`;

    const result = await pool.query(
      `
      INSERT INTO sections (section_id, section_name)
      VALUES ($1, $2)
      RETURNING
        id,
        section_id AS "sectionId",
        section_name AS "sectionName"
      `,
      [sectionId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName } = req.body;
    const name = String(sectionName || "").trim().toUpperCase();

    if (!name) {
      return res.status(400).json({ message: "Section Name is required" });
    }

    const result = await pool.query(
      `
      UPDATE sections
      SET section_name = $1
      WHERE id = $2
      RETURNING
        id,
        section_id AS "sectionId",
        section_name AS "sectionName"
      `,
      [name, Number(req.params.id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};