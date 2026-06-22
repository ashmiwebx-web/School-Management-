const express = require("express");
const router = express.Router();

const standardController = require("../controllers/standardController");

router.get("/", standardController.getStandards);
router.post("/", standardController.createStandard);
router.put("/:id", standardController.updateStandard);

module.exports = router;