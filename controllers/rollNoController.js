const pool = require("../config/db");

const padRoll = (num) => `RN${String(num).padStart(3, "0")}`;

const clean = (value) => String(value || "").trim();

const resequenceClassSection = async (className, sectionName) => {
  const result = await pool.query(
    `
    SELECT id
    FROM students
    WHERE LOWER(TRIM(class_name)) = LOWER(TRIM($1))
      AND LOWER(TRIM(section_name)) = LOWER(TRIM($2))
    ORDER BY
      LOWER(TRIM(first_name)) ASC,
      LOWER(TRIM(last_name)) ASC,
      admission_number ASC
    `,
    [clean(className), clean(sectionName)]
  );

  for (let index = 0; index < result.rows.length; index += 1) {
    await pool.query(
      `UPDATE students SET class_roll_no = $1 WHERE id = $2`,
      [padRoll(index + 1), result.rows[index].id]
    );
  }
};

const resequenceAllClassSections = async () => {
  const result = await pool.query(`
    SELECT DISTINCT class_name, section_name
    FROM students
    WHERE COALESCE(TRIM(class_name), '') != ''
      AND COALESCE(TRIM(section_name), '') != ''
    ORDER BY class_name ASC, section_name ASC
  `);

  for (const row of result.rows) {
    await resequenceClassSection(row.class_name, row.section_name);
  }
};

exports.generateClassRollNo = async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE students
      ADD COLUMN IF NOT EXISTS class_roll_no VARCHAR(20) DEFAULT ''
    `);

    await resequenceAllClassSections();

    res.json({
      success: true,
      message: "Section wise roll numbers generated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.swapStudentSection = async (req, res) => {
  try {
    const { studentIds, sectionName } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select student",
      });
    }

    if (!clean(sectionName)) {
      return res.status(400).json({
        success: false,
        message: "Section is required",
      });
    }

    const ids = studentIds.map(Number).filter(Boolean);

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student selected",
      });
    }

    await pool.query(
      `
      UPDATE students
      SET section_name = $1
      WHERE id = ANY($2::int[])
      `,
      [clean(sectionName).toUpperCase(), ids]
    );

    res.json({
      success: true,
      message:
        "Student section changed successfully. Click Generate Class to sort roll numbers.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};