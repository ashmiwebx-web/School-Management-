const pool = require("../config/db");

exports.getCombinedStds = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cs.id,
        cs.standard_id AS "standardId",
        cs.section_id AS "sectionId",
        cs.academic_level_id AS "academicLevelId",
        s.std_name AS "stdName",
        sec.section_name AS "sectionName",
        al.level_name AS "academicLevel"
      FROM combined_stds cs
      JOIN standards s ON s.id = cs.standard_id
      JOIN sections sec ON sec.id = cs.section_id
      JOIN academic_levels al ON al.id = cs.academic_level_id
      ORDER BY cs.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCombinedStd = async (req, res) => {
  try {
    const { standardId, sectionId, academicLevelId } = req.body;

    const result = await pool.query(
      `
      INSERT INTO combined_stds (standard_id, section_id, academic_level_id)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [Number(standardId), Number(sectionId), Number(academicLevelId)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Combined standard already created" });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.updateCombinedStd = async (req, res) => {
  try {
    const { standardId, sectionId, academicLevelId } = req.body;

    const result = await pool.query(
      `
      UPDATE combined_stds
      SET standard_id = $1,
          section_id = $2,
          academic_level_id = $3
      WHERE id = $4
      RETURNING id
      `,
      [
        Number(standardId),
        Number(sectionId),
        Number(academicLevelId),
        Number(req.params.id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Combined Std not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};