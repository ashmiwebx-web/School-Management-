const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const pad = (num) => String(num).padStart(5, "0");

const safeName = (value = "") =>
  String(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

const getFile = (req, fieldName) =>
  Array.isArray(req.files)
    ? req.files.find((file) => file.fieldname === fieldName)
    : null;

const moveUploadedFile = ({
  file,
  admissionNumber,
  firstName,
  lastName,
  type,
}) => {
  if (!file) return "";

  const studentName =
    safeName(`${firstName || ""}-${lastName || ""}`) || "Student";

  const folderName = `${safeName(admissionNumber)}-${studentName}`;
  const folderPath = path.join(
    __dirname,
    "..",
    "uploads",
    "students",
    folderName
  );

  fs.mkdirSync(folderPath, { recursive: true });

  const ext = path.extname(file.originalname).toLowerCase();

  const nameMap = {
    photo: `student${ext}`,
    fatherPhoto: `father${ext}`,
    motherPhoto: `mother${ext}`,
    guardianPhoto: `guardian${ext}`,
    birthCertificate: "BirthCertificate.pdf",
    medicalDocument: "MedicalCondition.pdf",
    transferCertificate: "TransferCertificate.pdf",
  };

  const finalName = nameMap[type] || file.originalname;
  const finalPath = path.join(folderPath, finalName);

  if (fs.existsSync(finalPath)) {
    fs.unlinkSync(finalPath);
  }

  fs.renameSync(file.path, finalPath);

return `uploads/students/${folderName}/${finalName}`;
};

const saveFiles = (req, admissionNumber, firstName, lastName) => ({
  photo: moveUploadedFile({
    file: getFile(req, "photo"),
    admissionNumber,
    firstName,
    lastName,
    type: "photo",
  }),
  fatherPhoto: moveUploadedFile({
    file: getFile(req, "fatherPhoto"),
    admissionNumber,
    firstName,
    lastName,
    type: "fatherPhoto",
  }),
  motherPhoto: moveUploadedFile({
    file: getFile(req, "motherPhoto"),
    admissionNumber,
    firstName,
    lastName,
    type: "motherPhoto",
  }),
  guardianPhoto: moveUploadedFile({
    file: getFile(req, "guardianPhoto"),
    admissionNumber,
    firstName,
    lastName,
    type: "guardianPhoto",
  }),
  birthCertificate: moveUploadedFile({
    file: getFile(req, "birthCertificate"),
    admissionNumber,
    firstName,
    lastName,
    type: "birthCertificate",
  }),
  medicalDocument: moveUploadedFile({
    file: getFile(req, "medicalDocument"),
    admissionNumber,
    firstName,
    lastName,
    type: "medicalDocument",
  }),
  transferCertificate: moveUploadedFile({
    file: getFile(req, "transferCertificate"),
    admissionNumber,
    firstName,
    lastName,
    type: "transferCertificate",
  }),
});

const studentSelect = `
  SELECT
    id,
    admission_number AS "admissionNumber",
    ad_roll_no AS "adRollNo",
    class_roll_no AS "classRollNo",
    academic_year AS "academicYear",

    admission_date AS "admissionDate",
    first_name AS "firstName",
    last_name AS "lastName",
    CONCAT(first_name, ' ', last_name) AS name,
    class_name AS "className",
    section_name AS "sectionName",
    gender,
    date_of_birth AS "dateOfBirth",
    status,
    primary_contact AS "primaryContact",
    email,

    blood_group AS "bloodGroup",
    house,
    religion,
    category,
    caste,
    mother_tongue AS "motherTongue",
    language_known AS "languageKnown",

    father_name AS "fatherName",
    father_email AS "fatherEmail",
    father_phone AS "fatherPhone",
    father_occupation AS "fatherOccupation",

    mother_name AS "motherName",
    mother_email AS "motherEmail",
    mother_phone AS "motherPhone",
    mother_occupation AS "motherOccupation",

    guardian_type AS "guardianType",
    guardian_name AS "guardianName",
    guardian_relation AS "guardianRelation",
    guardian_phone AS "guardianPhone",
    guardian_email AS "guardianEmail",
    guardian_occupation AS "guardianOccupation",
    guardian_address AS "guardianAddress",

    sibling_in_school AS "siblingInSchool",
    siblings,

    current_address AS "currentAddress",
    permanent_address AS "permanentAddress",

    route,
    vehicle_number AS "vehicleNumber",
    pickup_point AS "pickupPoint",
    hostel,
    room_no AS "roomNo",

    medical_condition AS "medicalCondition",
    allergies,
    medications,

    previous_school_name AS "previousSchoolName",
    previous_school_address AS "previousSchoolAddress",

    bank_name AS "bankName",
    branch,
    ifsc_number AS "ifscNumber",
    other_info AS "otherInfo",

    photo,
    father_photo AS "fatherPhoto",
    mother_photo AS "motherPhoto",
    guardian_photo AS "guardianPhoto",
    birth_certificate AS "birthCertificate",
    medical_document AS "medicalDocument",
    transfer_certificate AS "transferCertificate"
  FROM students
`;

const normalizeStudent = (student) => {
  try {
    student.languageKnown = student.languageKnown
      ? JSON.parse(student.languageKnown)
      : ["Tamil", "English"];
  } catch {
    student.languageKnown = ["Tamil", "English"];
  }
try {
  student.siblings = student.siblings ? JSON.parse(student.siblings) : [];
} catch {
  student.siblings = [];
}
  return student;
};

exports.getNextStudentIds = async (req, res) => {
  try {
    const result = await pool.query(`SELECT COUNT(*) FROM students`);
    const next = Number(result.rows[0].count) + 1;

    res.json({
      success: true,
      admissionNumber: `AD${pad(next)}`,
      adRollNo: String(next).padStart(4, "0"),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(`${studentSelect} ORDER BY id DESC`);
    res.json(result.rows.map(normalizeStudent));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const result = await pool.query(`${studentSelect} WHERE id = $1`, [
      Number(req.params.id),
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json(normalizeStudent(result.rows[0]));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkClassCapacity = async ({ className, sectionName, excludeStudentId = null }) => {
  if (!className || !sectionName) {
    const error = new Error("Class and Section are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `
    SELECT
      cr.capacity,
      cr.room_no AS "roomNo",
      cr.block_name AS "blockName",
      cr.floor,
      COUNT(st.id) AS "studentCount"
    FROM combined_stds cs
    JOIN standards s ON s.id = cs.standard_id
    JOIN sections sec ON sec.id = cs.section_id
    JOIN class_allocations ca ON ca.combined_std_id = cs.id
    JOIN class_rooms cr ON cr.id = ca.class_room_id
    LEFT JOIN students st
      ON LOWER(TRIM(st.class_name)) = LOWER(TRIM(s.std_name))
     AND LOWER(TRIM(st.section_name)) = LOWER(TRIM(sec.section_name))
     AND ($3::int IS NULL OR st.id != $3)
    WHERE LOWER(TRIM(s.std_name)) = LOWER(TRIM($1))
      AND LOWER(TRIM(sec.section_name)) = LOWER(TRIM($2))
    GROUP BY cr.capacity, cr.room_no, cr.block_name, cr.floor
    LIMIT 1
    `,
    [
      String(className).trim(),
      String(sectionName).trim(),
      excludeStudentId ? Number(excludeStudentId) : null,
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error(
      `${className} ${sectionName} class allocation not found`
    );
    error.statusCode = 400;
    throw error;
  }

  const capacity = Number(result.rows[0].capacity);
  const studentCount = Number(result.rows[0].studentCount);

  if (capacity <= 0) {
    const error = new Error("Class room capacity is invalid");
    error.statusCode = 409;
    throw error;
  }

  if (studentCount >= capacity) {
    const error = new Error(
      `${className} ${sectionName} capacity full. Room No ${result.rows[0].roomNo} allows only ${capacity} student(s)`
    );
    error.statusCode = 409;
    throw error;
  }
};
exports.createStudent = async (req, res) => {
  try {
    const body = req.body;

    const countResult = await pool.query(`SELECT COUNT(*) FROM students`);
    const next = Number(countResult.rows[0].count) + 1;

    const admissionNumber = body.admissionNumber || `AD${pad(next)}`;
    const adRollNo = body.adRollNo || String(next).padStart(4, "0");

    await checkClassCapacity({
      className: body.className,
      sectionName: body.sectionName,
    });

    const files = saveFiles(
      req,
      admissionNumber,
      body.firstName || "",
      body.lastName || ""
    );

    const result = await pool.query(
      `
      INSERT INTO students (
        admission_number, ad_roll_no, academic_year, admission_date,
        first_name, last_name, class_name, section_name, gender,
        date_of_birth, status, primary_contact, email,
        blood_group, house, religion, category, caste, mother_tongue,
        language_known, father_name, father_email, father_phone,
        father_occupation, mother_name, mother_email, mother_phone,
        mother_occupation, guardian_type, guardian_name, guardian_relation,
        guardian_phone, guardian_email, guardian_occupation, guardian_address,
      sibling_in_school, siblings, current_address, permanent_address,
        route, vehicle_number, pickup_point, hostel, room_no,
        medical_condition, allergies, medications,
        previous_school_name, previous_school_address,
        bank_name, branch, ifsc_number, other_info,
        photo, father_photo, mother_photo, guardian_photo,
        birth_certificate, medical_document, transfer_certificate
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
        $14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,
        $29,$30,$31,$32,$33,$34,$35,
      $36,$37,$38,$39,$40,$41,$42,$43,$44,
$45,$46,$47,$48,$49,$50,$51,$52,$53,
$54,$55,$56,$57,$58,$59,$60
      )
      RETURNING id
      `,
      [
        admissionNumber,
        adRollNo,
        body.academicYear || "",
        body.admissionDate || "",
        body.firstName || "",
        body.lastName || "",
        body.className || "",
        body.sectionName || "",
        body.gender || "",
        body.dateOfBirth || "",
        body.status || "Active",
        body.primaryContact || "",
        body.email || "",

        body.bloodGroup || "",
        body.house || "",
        body.religion || "",
        body.category || "",
        body.caste || "",
        body.motherTongue || "",
        body.languageKnown || JSON.stringify(["Tamil", "English"]),

        body.fatherName || "",
        body.fatherEmail || "",
        body.fatherPhone || "",
        body.fatherOccupation || "",

        body.motherName || "",
        body.motherEmail || "",
        body.motherPhone || "",
        body.motherOccupation || "",

        body.guardianType || "",
        body.guardianName || "",
        body.guardianRelation || "",
        body.guardianPhone || "",
        body.guardianEmail || "",
        body.guardianOccupation || "",
        body.guardianAddress || "",

              body.siblingInSchool || "",
        body.siblings || "[]",
        body.currentAddress || "",
        body.permanentAddress || "",

        body.route || "",
        body.vehicleNumber || "",
        body.pickupPoint || "",
        body.hostel || "",
        body.roomNo || "",

        body.medicalCondition || "",
        body.allergies || "",
        body.medications || "",

        body.previousSchoolName || "",
        body.previousSchoolAddress || "",

        body.bankName || "",
        body.branch || "",
        body.ifscNumber || "",
        body.otherInfo || "",

       files.photo || "",
files.fatherPhoto || "",
files.motherPhoto || "",
files.guardianPhoto || "",
files.birthCertificate || "",
files.medicalDocument || "",
files.transferCertificate || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Admission Number or Roll No already exists",
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const body = req.body;
    const id = Number(req.params.id);

    const oldResult = await pool.query(`SELECT * FROM students WHERE id = $1`, [
      id,
    ]);

    if (oldResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const old = oldResult.rows[0];

    await checkClassCapacity({
      className: body.className,
      sectionName: body.sectionName,
      excludeStudentId: id,
    });

    const files = saveFiles(
      req,
      old.admission_number,
      body.firstName || old.first_name || "",
      body.lastName || old.last_name || ""
    );

    await pool.query(
      `
      UPDATE students SET
        academic_year = $1,
        admission_date = $2,
        first_name = $3,
        last_name = $4,
        class_name = $5,
        section_name = $6,
        gender = $7,
        date_of_birth = $8,
        status = $9,
        primary_contact = $10,
        email = $11,
        blood_group = $12,
        house = $13,
        religion = $14,
        category = $15,
        caste = $16,
        mother_tongue = $17,
        language_known = $18,
        father_name = $19,
        father_email = $20,
        father_phone = $21,
        father_occupation = $22,
        mother_name = $23,
        mother_email = $24,
        mother_phone = $25,
        mother_occupation = $26,
        guardian_type = $27,
        guardian_name = $28,
        guardian_relation = $29,
        guardian_phone = $30,
        guardian_email = $31,
        guardian_occupation = $32,
        guardian_address = $33,
                sibling_in_school = $34,
        siblings = $35,
        current_address = $36,
        permanent_address = $37,
        route = $38,
        vehicle_number = $39,
        pickup_point = $40,
        hostel = $41,
        room_no = $42,
        medical_condition = $43,
        allergies = $44,
        medications = $45,
        previous_school_name = $46,
        previous_school_address = $47,
        bank_name = $48,
        branch = $49,
        ifsc_number = $50,
        other_info = $51,
        photo = $52,
        father_photo = $53,
        mother_photo = $54,
        guardian_photo = $55,
        birth_certificate = $56,
        medical_document = $57,
        transfer_certificate = $58
      WHERE id = $59
      `,
      [
        body.academicYear || "",
        body.admissionDate || "",
        body.firstName || "",
        body.lastName || "",
        body.className || "",
        body.sectionName || "",
        body.gender || "",
        body.dateOfBirth || "",
        body.status || "Active",
        body.primaryContact || "",
        body.email || "",

        body.bloodGroup || "",
        body.house || "",
        body.religion || "",
        body.category || "",
        body.caste || "",
        body.motherTongue || "",
        body.languageKnown || JSON.stringify(["Tamil", "English"]),

        body.fatherName || "",
        body.fatherEmail || "",
        body.fatherPhone || "",
        body.fatherOccupation || "",

        body.motherName || "",
        body.motherEmail || "",
        body.motherPhone || "",
        body.motherOccupation || "",

        body.guardianType || "",
        body.guardianName || "",
        body.guardianRelation || "",
        body.guardianPhone || "",
        body.guardianEmail || "",
        body.guardianOccupation || "",
        body.guardianAddress || "",

           body.siblingInSchool || "",
        body.siblings || "[]",
        body.currentAddress || "",
        body.permanentAddress || "",

        body.route || "",
        body.vehicleNumber || "",
        body.pickupPoint || "",
        body.hostel || "",
        body.roomNo || "",

        body.medicalCondition || "",
        body.allergies || "",
        body.medications || "",

        body.previousSchoolName || "",
        body.previousSchoolAddress || "",

        body.bankName || "",
        body.branch || "",
        body.ifscNumber || "",
        body.otherInfo || "",

        files.photo || old.photo || "",
        files.fatherPhoto || old.father_photo || "",
        files.motherPhoto || old.mother_photo || "",
        files.guardianPhoto || old.guardian_photo || "",
        files.birthCertificate || old.birth_certificate || "",
        files.medicalDocument || old.medical_document || "",
        files.transferCertificate || old.transfer_certificate || "",
        id,
      ]
    );

    res.json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteStudent = async (req, res) => {
  try {
    await pool.query(`DELETE FROM students WHERE id = $1`, [
      Number(req.params.id),
    ]);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};