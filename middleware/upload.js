const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempDir = path.join(__dirname, "..", "uploads", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const imageFields = ["photo", "fatherPhoto", "motherPhoto", "guardianPhoto"];
  const documentFields = [
    "birthCertificate",
    "medicalDocument",
    "transferCertificate",
    "resume",
    "joiningLetter",
  ];

  if (imageFields.includes(file.fieldname)) {
    if (["image/jpeg", "image/jpg", "image/png", "image/svg+xml"].includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only JPG, JPEG, PNG, SVG images allowed"));
  }

  if (documentFields.includes(file.fieldname)) {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    return cb(new Error("Only PDF documents allowed"));
  }

  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});