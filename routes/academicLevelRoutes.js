const express = require("express");
const router = express.Router();

const academicLevelController = require("../controllers/academicLevelController");

router.get("/", academicLevelController.getAcademicLevels);
router.post("/", academicLevelController.createAcademicLevel);

module.exports = router;