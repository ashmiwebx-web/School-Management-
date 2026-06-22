const pool = require("../config/db");

exports.getBlocks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        block_id AS "blockId",
        block_name AS "blockName",
        no_of_floors AS "noOfFloors",
        description
      FROM blocks
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBlock = async (req, res) => {
  try {
    const { blockName, noOfFloors, description } = req.body;

    if (!blockName) {
      return res.status(400).json({ message: "Block Name is required" });
    }

    if (!noOfFloors) {
      return res.status(400).json({ message: "No. Of Floors is required" });
    }

    const exists = await pool.query(
      `SELECT id FROM blocks WHERE LOWER(TRIM(block_name)) = LOWER(TRIM($1))`,
      [blockName]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ message: `${blockName} already created` });
    }

    const count = await pool.query(`SELECT COUNT(*) FROM blocks`);
    const blockId = `BLK${String(Number(count.rows[0].count) + 1).padStart(4, "0")}`;

    const result = await pool.query(
      `
      INSERT INTO blocks (block_id, block_name, no_of_floors, description)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        block_id AS "blockId",
        block_name AS "blockName",
        no_of_floors AS "noOfFloors",
        description
      `,
      [blockId, blockName.trim(), Number(noOfFloors), description || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const { blockName, noOfFloors, description } = req.body;
    const id = Number(req.params.id);

    const result = await pool.query(
      `
      UPDATE blocks
      SET block_name = $1,
          no_of_floors = $2,
          description = $3
      WHERE id = $4
      RETURNING
        id,
        block_id AS "blockId",
        block_name AS "blockName",
        no_of_floors AS "noOfFloors",
        description
      `,
      [blockName.trim(), Number(noOfFloors), description || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Block not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};