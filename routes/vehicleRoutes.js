const express = require("express");
const router = express.Router();

const {
  getNextBusId,
  getVehicles,
  createVehicle,
  updateVehicle,
  getVehicleById,
} = require("../controllers/vehicleController");

router.get("/", getVehicles);
router.get("/next-id", getNextBusId);
router.get("/:id", getVehicleById);

router.post("/", createVehicle);
router.put("/:id", updateVehicle);

module.exports = router;