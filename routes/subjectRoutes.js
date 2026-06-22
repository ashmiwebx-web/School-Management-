const express = require("express");

const {
  getSubjectCode,
  getSubjects,
  createSubject,
  updateSubject,
} = require("../controllers/subjectController");

const router = express.Router();

router.get("/code", getSubjectCode);
router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);

module.exports = router;