const pool = require("../config/db");

const normalizeSubjectName = (name = "") => String(name || "").trim();

const makeShortForm = (name = "") => {
  const value = String(name || "").trim();

  if (!value) return "";

  const words = value
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  // Single word → First 3 letters
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }

  // Multiple words → First letter of each word
  return words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const normalizeShortForm = (value = "") =>
  String(value || "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();

const padSubjectId = (num) => `SUB${String(num).padStart(3, "0")}`;

const ensureSubjectColumns = async () => {
  await pool.query(`
    ALTER TABLE subjects
    ADD COLUMN IF NOT EXISTS short_form VARCHAR(20) DEFAULT '';
  `);

  await pool.query(`
    UPDATE subjects
    SET short_form = UPPER(REGEXP_REPLACE(short_form, '[^A-Za-z]', '', 'g'))
    WHERE COALESCE(TRIM(short_form), '') <> '';
  `);

  await pool.query(`
    UPDATE subjects
    SET short_form = UPPER(REGEXP_REPLACE(LEFT(subject_name, 3), '[^A-Za-z]', '', 'g'))
    WHERE COALESCE(TRIM(short_form), '') = '';
  `);
};

const getNextSubjectId = async () => {
  const result = await pool.query(`
    SELECT subject_code
    FROM subjects
    WHERE subject_code ~ '^SUB[0-9]+$'
    ORDER BY CAST(REGEXP_REPLACE(subject_code, '[^0-9]', '', 'g') AS INTEGER) DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) return "SUB001";

  const lastNo = Number(
    String(result.rows[0].subject_code).replace(/[^0-9]/g, "")
  );

  return padSubjectId(lastNo + 1);
};

const checkDuplicateSubject = async (subjectName, ignoreId = null) => {
  const result = await pool.query(
    `
    SELECT id
    FROM subjects
    WHERE LOWER(TRIM(subject_name)) = LOWER(TRIM($1))
      AND ($2::INT IS NULL OR id <> $2::INT)
    LIMIT 1
    `,
    [subjectName, ignoreId]
  );

  return result.rows.length > 0;
};

exports.getSubjectCode = async (req, res) => {
  try {
    await ensureSubjectColumns();

    const subjectName = req.query.name || "";
    const subjectCode = await getNextSubjectId();

    res.json({
      success: true,
      subjectCode,
      shortForm: makeShortForm(subjectName),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    await ensureSubjectColumns();

    const result = await pool.query(`
      SELECT
        id,
        subject_name AS "subjectName",
        subject_code AS "subjectCode",
        UPPER(COALESCE(short_form, '')) AS "shortForm",
        status,
        created_at AS "createdAt"
      FROM subjects
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    await ensureSubjectColumns();

    const subjectName = normalizeSubjectName(req.body.subjectName);

    if (!subjectName) {
      return res.status(400).json({
        success: false,
        message: "Subject Name is required",
      });
    }

    const exists = await checkDuplicateSubject(subjectName);

    if (exists) {
      return res.status(409).json({
        success: false,
        message: `${subjectName} already exists`,
      });
    }

    const subjectCode = await getNextSubjectId();
    const shortForm = normalizeShortForm(
      req.body.shortForm || makeShortForm(subjectName)
    );

    const result = await pool.query(
      `
      INSERT INTO subjects (subject_name, subject_code, short_form)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [subjectName, subjectCode, shortForm]
    );

    res.status(201).json({
      success: true,
      message: "Subject added successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Subject already exists",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    await ensureSubjectColumns();

    const id = Number(req.params.id);
    const subjectName = normalizeSubjectName(req.body.subjectName);

    if (!subjectName) {
      return res.status(400).json({
        success: false,
        message: "Subject Name is required",
      });
    }

    const exists = await checkDuplicateSubject(subjectName, id);

    if (exists) {
      return res.status(409).json({
        success: false,
        message: `${subjectName} already exists`,
      });
    }

    const shortForm = normalizeShortForm(
      req.body.shortForm || makeShortForm(subjectName)
    );

    await pool.query(
      `
      UPDATE subjects
      SET subject_name = $1,
          short_form = $2
      WHERE id = $3
      `,
      [subjectName, shortForm, id]
    );

    res.json({
      success: true,
      message: "Subject updated successfully",
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Subject already exists",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};