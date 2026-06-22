const express = require("express");
const upload = require("../middleware/upload");

const {
  getNextStudentIds,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  generateClassRollNo,
  swapStudentSection,
} = require("../controllers/rollNoController");

const router = express.Router();

const fieldNames = {
  photo: "Student Photo",
  fatherPhoto: "Father Photo",
  motherPhoto: "Mother Photo",
  guardianPhoto: "Guardian Photo",
  birthCertificate: "Birth Certificate",
  medicalDocument: "Medical Document",
  transferCertificate: "Transfer Certificate",
};

const uploadAny = (req, res, next) => {
  upload.any()(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        const fileName = fieldNames[error.field] || error.field || "File";

        return res.status(400).json({
          success: false,
          message: `${fileName} size should not exceed 2 MB`,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

router.get("/next", getNextStudentIds);
router.get("/next-ids", getNextStudentIds);

router.post("/generate-rollno", generateClassRollNo);
router.put("/swap-section", swapStudentSection);

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", uploadAny, createStudent);
router.put("/:id", uploadAny, updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;