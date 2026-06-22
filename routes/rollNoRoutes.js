const express = require("express");
const router = express.Router();

const {
  generateClassRollNo,
  swapStudentSection,
} = require("../controllers/rollNoController");

router.post("/generate-rollno", generateClassRollNo);
router.put("/swap-section", swapStudentSection);

module.exports = router;