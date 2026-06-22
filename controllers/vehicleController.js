const pool = require("../config/db");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getNextCode = (num) => `BUS${String(num).padStart(3, "0")}`;

exports.getNextBusId = async (req, res) => {
  try {
    const result = await pool.query("SELECT bus_id, bus_name FROM vehicles ORDER BY id ASC");

    const nextNo = result.rows.length + 1;
    const usedNames = result.rows.map((r) => r.bus_name);

    let nextName = "A";
    for (const letter of alphabet) {
      if (!usedNames.includes(letter)) {
        nextName = letter;
        break;
      }
    }

    res.json({
      busId: getNextCode(nextNo),
      busName: nextName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const { busId, busName, busRegistrationNo, driverName, driverNo } = req.body;

    const exists = await pool.query(
      "SELECT id FROM vehicles WHERE bus_id=$1 OR bus_name=$2",
      [busId, busName]
    );

    if (exists.rows.length) {
      return res.status(400).json({ message: "Bus already exists" });
    }

    const result = await pool.query(
      `
      INSERT INTO vehicles
      (bus_id, bus_name, bus_registration_no, driver_name, driver_no)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [busId, busName, busRegistrationNo, driverName, driverNo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { busName, busRegistrationNo, driverName, driverNo } = req.body;

    const result = await pool.query(
      `
      UPDATE vehicles
      SET bus_name=$1,
          bus_registration_no=$2,
          driver_name=$3,
          driver_no=$4
      WHERE id=$5
      RETURNING *
      `,
      [busName, busRegistrationNo, driverName, driverNo, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
      req.params.id,
    ]);

    if (!result.rows.length) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};