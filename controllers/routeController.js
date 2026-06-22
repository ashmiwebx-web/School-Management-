const pool = require("../config/db");

exports.getRoutes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM routes ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const { area, routeName, busName } = req.body;

    const result = await pool.query(
      `
      INSERT INTO routes (area, route_name, bus_name)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [area, routeName, busName]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { area, routeName, busName } = req.body;

    const result = await pool.query(
      `
      UPDATE routes
      SET area=$1,
          route_name=$2,
          bus_name=$3
      WHERE id=$4
      RETURNING *
      `,
      [area, routeName, busName, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};