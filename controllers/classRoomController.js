const pool = require("../config/db");

exports.getClassRooms = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        block_id AS "blockId",
        block_name AS "blockName",
        floor,
        room_no AS "roomNo",
        class_type AS "classType",
        no_of_benches AS "noOfBenches",
        students_per_bench AS "studentsPerBench",
        capacity
      FROM class_rooms
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
  if (error.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "This Floor already exists in the selected Block",
    });
  }

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

exports.createClassRoom = async (req, res) => {
  try {
    const {
      blockId,
      blockName,
      floor,
      roomNo,
      classType,
      noOfBenches,
      studentsPerBench,
    } = req.body;

    const capacity = Number(noOfBenches) * Number(studentsPerBench);

    const result = await pool.query(
      `
      INSERT INTO class_rooms (
        block_id,
        block_name,
        floor,
        room_no,
        class_type,
        no_of_benches,
        students_per_bench,
        capacity
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        Number(blockId),
        blockName,
        floor,
        roomNo,
        classType,
        Number(noOfBenches),
        Number(studentsPerBench),
        capacity,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClassRoom = async (req, res) => {
  try {
    const {
      blockId,
      blockName,
      floor,
      roomNo,
      classType,
      noOfBenches,
      studentsPerBench,
    } = req.body;

    const capacity = Number(noOfBenches) * Number(studentsPerBench);

    const result = await pool.query(
      `
      UPDATE class_rooms
      SET block_id = $1,
          block_name = $2,
          floor = $3,
          room_no = $4,
          class_type = $5,
          no_of_benches = $6,
          students_per_bench = $7,
          capacity = $8
      WHERE id = $9
      RETURNING id
      `,
      [
        Number(blockId),
        blockName,
        floor,
        roomNo,
        classType,
        Number(noOfBenches),
        Number(studentsPerBench),
        capacity,
        Number(req.params.id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Class room not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};