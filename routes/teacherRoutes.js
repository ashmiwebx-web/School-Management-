const express = require("express");
const upload = require("../middleware/upload");
const {
  getNextTeacherId,
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

const fileFieldNames = {
  photo: "Teacher Photo",
  resume: "Resume",
  joiningLetter: "Joining Letter",
};

const teacherUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "joiningLetter", maxCount: 1 },
]);

const uploadTeacherFiles = (req, res, next) => {
  teacherUpload(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        const fileName = fileFieldNames[error.field] || error.field || "File";
        return res.status(400).json({
          success: false,
          message: `${fileName} size should not exceed 2 MB`,
        });
      }
      return res.status(400).json({ success: false, message: error.message });
    }
    next();
  });
};

router.get("/next-id", getNextTeacherId);
router.get("/", getTeachers);
router.get("/:id", getTeacherById);
router.post("/", uploadTeacherFiles, createTeacher);
router.put("/:id", uploadTeacherFiles, updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
