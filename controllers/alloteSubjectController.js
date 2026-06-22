const pool = require("../config/db");

exports.getAlloteSubjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.academic_level_id AS "academicLevelId",
        al.level_name AS "academicLevel",
        a.subject_ids AS "subjectIds",
        a.created_at AS "createdAt"
      FROM allote_subjects a
      LEFT JOIN academic_levels al ON al.id = a.academic_level_id
      ORDER BY a.id DESC
    `);

    const data = [];

    for (const row of result.rows) {
      const ids = String(row.subjectIds || "")
        .split(",")
        .filter(Boolean)
        .map(Number);

      let subjects = [];

      if (ids.length > 0) {
        const sub = await pool.query(
          `
          SELECT id, subject_name AS "subjectName", subject_code AS "subjectCode"
          FROM subjects
          WHERE id = ANY($1::int[])
          ORDER BY subject_name ASC
          `,
          [ids]
        );

        subjects = sub.rows;
      }

      data.push({
        ...row,
        subjects,
        noOfSubjects: subjects.length,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAlloteSubject = async (req, res) => {
  try {
    const academicLevelId = Number(req.body.academicLevelId);
    const subjectIds = Array.isArray(req.body.subjectIds)
      ? req.body.subjectIds.map(Number).filter(Boolean)
      : [];

    if (!academicLevelId) {
      return res.status(400).json({
        success: false,
        message: "Academic Level is required",
      });
    }

    if (subjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one subject",
      });
    }

    const exists = await pool.query(
      `SELECT id FROM allote_subjects WHERE academic_level_id = $1`,
      [academicLevelId]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This Academic Level already allotted",
      });
    }

    await pool.query(
      `
      INSERT INTO allote_subjects (academic_level_id, subject_ids)
      VALUES ($1, $2)
      `,
      [academicLevelId, subjectIds.join(",")]
    );

    res.status(201).json({
      success: true,
      message: "Subjects allotted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAlloteSubject = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const academicLevelId = Number(req.body.academicLevelId);
    const subjectIds = Array.isArray(req.body.subjectIds)
      ? req.body.subjectIds.map(Number).filter(Boolean)
      : [];

    if (!academicLevelId) {
      return res.status(400).json({
        success: false,
        message: "Academic Level is required",
      });
    }

    if (subjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one subject",
      });
    }

    const exists = await pool.query(
      `
      SELECT id
      FROM allote_subjects
      WHERE academic_level_id = $1 AND id <> $2
      `,
      [academicLevelId, id]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This Academic Level already allotted",
      });
    }

    await pool.query(
      `
      UPDATE allote_subjects
      SET academic_level_id = $1,
          subject_ids = $2
      WHERE id = $3
      `,
      [academicLevelId, subjectIds.join(","), id]
    );

    res.json({
      success: true,
      message: "Subjects updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};