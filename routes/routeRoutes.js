const express = require("express");
const router = express.Router();

const {
  getRoutes,
  createRoute,
  updateRoute,
} = require("../controllers/routeController");

router.get("/", getRoutes);
router.post("/", createRoute);
router.put("/:id", updateRoute);

module.exports = router;