const express = require("express");
const router = express.Router();

const {
  getAlloteSubjects,
  createAlloteSubject,
  updateAlloteSubject,
} = require("../controllers/alloteSubjectController");

router.get("/", getAlloteSubjects);
router.post("/", createAlloteSubject);
router.put("/:id", updateAlloteSubject);

module.exports = router;