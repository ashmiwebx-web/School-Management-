const pool = require("../config/db");

exports.getClassAllocations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ca.id,
        cs.id AS "combinedStdId",
        s.std_name AS "stdName",
        sec.section_name AS "sectionName",
        al.level_name AS "academicLevel",
        cr.id AS "classRoomId",
        cr.block_id AS "blockId",
        cr.block_name AS "blockName",
        cr.floor,
        cr.room_no AS "roomNo",
        cr.capacity
      FROM class_allocations ca
      JOIN combined_stds cs ON cs.id = ca.combined_std_id
      JOIN standards s ON s.id = cs.standard_id
      JOIN sections sec ON sec.id = cs.section_id
      JOIN academic_levels al ON al.id = cs.academic_level_id
      JOIN class_rooms cr ON cr.id = ca.class_room_id
      ORDER BY ca.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createClassAllocation = async (req, res) => {
  try {
    const { combinedStdId, classRoomId } = req.body;

    if (!combinedStdId || !classRoomId) {
      return res.status(400).json({
        message: "Standard & Sec and Room No are required",
      });
    }

    const roomExists = await pool.query(
      `SELECT id, room_no FROM class_rooms WHERE id = $1`,
      [Number(classRoomId)]
    );

    if (roomExists.rows.length === 0) {
      return res.status(404).json({ message: "Class room not found" });
    }

    const duplicateStd = await pool.query(
      `SELECT id FROM class_allocations WHERE combined_std_id = $1`,
      [Number(combinedStdId)]
    );

    if (duplicateStd.rows.length > 0) {
      return res.status(409).json({
        message: "This standard & section already allocated",
      });
    }

    const duplicateRoom = await pool.query(
      `SELECT id FROM class_allocations WHERE class_room_id = $1`,
      [Number(classRoomId)]
    );

    if (duplicateRoom.rows.length > 0) {
      return res.status(409).json({
        message: `Room No ${roomExists.rows[0].room_no} already allocated`,
      });
    }

    const result = await pool.query(
      `
      INSERT INTO class_allocations (combined_std_id, class_room_id)
      VALUES ($1, $2)
      RETURNING id
      `,
      [Number(combinedStdId), Number(classRoomId)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClassAllocation = async (req, res) => {
  try {
    const { combinedStdId, classRoomId } = req.body;
    const id = Number(req.params.id);

    const result = await pool.query(
      `
      UPDATE class_allocations
      SET combined_std_id = $1,
          class_room_id = $2
      WHERE id = $3
      RETURNING id
      `,
      [Number(combinedStdId), Number(classRoomId), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Class allocation not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};