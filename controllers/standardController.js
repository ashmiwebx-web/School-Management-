const pool = require("../config/db");

const pad = (num) => String(num).padStart(4, "0");

exports.getStandards = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        std_id AS "stdId",
        std_name AS "stdName"
      FROM standards
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStandard = async (req, res) => {
  try {
    const { stdName } = req.body;
    const name = String(stdName || "").trim().toUpperCase();

    if (!name) {
      return res.status(400).json({ message: "Std Name is required" });
    }

    const exists = await pool.query(
      `SELECT id FROM standards WHERE LOWER(TRIM(std_name)) = LOWER(TRIM($1))`,
      [name]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: `${name} already created` });
    }

    const count = await pool.query(`SELECT COUNT(*) FROM standards`);
    const stdId = `STD${pad(Number(count.rows[0].count) + 1)}`;

    const result = await pool.query(
      `
      INSERT INTO standards (std_id, std_name)
      VALUES ($1, $2)
      RETURNING
        id,
        std_id AS "stdId",
        std_name AS "stdName"
      `,
      [stdId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStandard = async (req, res) => {
  try {
    const { stdName } = req.body;
    const name = String(stdName || "").trim().toUpperCase();

    if (!name) {
      return res.status(400).json({ message: "Std Name is required" });
    }

    const result = await pool.query(
      `
      UPDATE standards
      SET std_name = $1
      WHERE id = $2
      RETURNING
        id,
        std_id AS "stdId",
        std_name AS "stdName"
      `,
      [name, Number(req.params.id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Standard not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};