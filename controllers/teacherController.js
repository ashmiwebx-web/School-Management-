const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const clean = (value = "") => String(value || "").trim();
const onlyDigits = (value = "") => clean(value).replace(/\D/g, "");

const parseJson = (value, fallback = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const toCamel = (row = {}) => ({
  id: row.id,
  teacherId: row.teacher_id,
  firstName: row.first_name,
  lastName: row.last_name,
  className: row.class_name,
  subject: row.subject,
  gender: row.gender,
  primaryContact: row.primary_contact,
  email: row.email,
  bloodGroup: row.blood_group,
  dateOfJoining: row.date_of_joining,
  fatherName: row.father_name,
  motherName: row.mother_name,
  dateOfBirth: row.date_of_birth,
  maritalStatus: row.marital_status,
  languageKnown: parseJson(row.language_known, []),
  qualification: row.qualification,
  workExperience: row.work_experience,
  previousSchool: row.previous_school,
  previousSchoolAddress: row.previous_school_address,
  previousSchoolPhone: row.previous_school_phone,
  address: row.address,
  permanentAddress: row.permanent_address,
  panNumber: row.pan_number,
  status: row.status,
  notes: row.notes,
  epfNo: row.epf_no,
  basicSalary: row.basic_salary,
  contractType: row.contract_type,
  workShift: row.work_shift,
  workLocation: row.work_location,
  dateOfLeaving: row.date_of_leaving,
  medicalLeaves: row.medical_leaves,
  casualLeaves: row.casual_leaves,
  maternityLeaves: row.maternity_leaves,
  sickLeaves: row.sick_leaves,
  accountName: row.account_name,
  accountNumber: row.account_number,
  bankName: row.bank_name,
  ifscCode: row.ifsc_code,
  branchName: row.branch_name,
  route: row.route,
  vehicleNumber: row.vehicle_number,
  pickupPoint: row.pickup_point,
  hostel: row.hostel,
  roomNo: row.room_no,
  facebook: row.facebook,
  instagram: row.instagram,
  linkedIn: row.linked_in,
  youtube: row.youtube,
  twitterUrl: row.twitter_url,
  photo: row.photo,
  resume: row.resume,
  joiningLetter: row.joining_letter,
  createdAt: row.created_at,
});

const nextTeacherId = async () => {
  const result = await pool.query(`
    SELECT teacher_id
    FROM teachers
    WHERE teacher_id ~ '^TCH[0-9]+$'
    ORDER BY CAST(REGEXP_REPLACE(teacher_id, '[^0-9]', '', 'g') AS INTEGER) DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) return "TCH001";

  const lastNo = Number(
    String(result.rows[0].teacher_id).replace(/[^0-9]/g, "")
  );

  return `TCH${String(lastNo + 1).padStart(3, "0")}`;
};

const ensureDir = (teacherId, firstName, lastName) => {
  const safeName = `${teacherId}-${firstName}-${lastName}`
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-");
  const dir = path.join(__dirname, "..", "uploads", "teachers", safeName);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const moveFile = (file, dir, finalName) => {
  if (!file) return "";
  const ext = path.extname(file.originalname).toLowerCase();
  const target = path.join(dir, `${finalName}${ext}`);
  fs.renameSync(file.path, target);
  return path.relative(path.join(__dirname, ".."), target).replace(/\\/g, "/");
};

const bodyData = (body = {}) => ({
  firstName: clean(body.firstName),
  lastName: clean(body.lastName),
  className: clean(body.className),
  subject: clean(body.subject),
  gender: clean(body.gender),
  primaryContact: onlyDigits(body.primaryContact).slice(0, 10),
  email: clean(body.email),
  bloodGroup: clean(body.bloodGroup),
  dateOfJoining: clean(body.dateOfJoining),
  fatherName: clean(body.fatherName),
  motherName: clean(body.motherName),
  dateOfBirth: clean(body.dateOfBirth),
  maritalStatus: clean(body.maritalStatus),
  languageKnown: body.languageKnown || "[]",
  qualification: clean(body.qualification),
  workExperience: clean(body.workExperience),
  previousSchool: clean(body.previousSchool),
  previousSchoolAddress: clean(body.previousSchoolAddress),
  previousSchoolPhone: onlyDigits(body.previousSchoolPhone).slice(0, 10),
  address: clean(body.address),
  permanentAddress: clean(body.permanentAddress),
  panNumber: clean(body.panNumber).toUpperCase(),
  status: clean(body.status) || "Active",
  notes: clean(body.notes),
  epfNo: clean(body.epfNo),
  basicSalary: clean(body.basicSalary),
  contractType: clean(body.contractType),
  workShift: clean(body.workShift),
  workLocation: clean(body.workLocation),
  dateOfLeaving: clean(body.dateOfLeaving),
  medicalLeaves: clean(body.medicalLeaves),
  casualLeaves: clean(body.casualLeaves),
  maternityLeaves: clean(body.maternityLeaves),
  sickLeaves: clean(body.sickLeaves),
  accountName: clean(body.accountName),
  accountNumber: onlyDigits(body.accountNumber),
  bankName: clean(body.bankName),
  ifscCode: clean(body.ifscCode).toUpperCase(),
  branchName: clean(body.branchName),
  route: clean(body.route),
  vehicleNumber: clean(body.vehicleNumber),
  pickupPoint: clean(body.pickupPoint),
  hostel: clean(body.hostel),
  roomNo: clean(body.roomNo),
  facebook: clean(body.facebook),
  instagram: clean(body.instagram),
  linkedIn: clean(body.linkedIn),
  youtube: clean(body.youtube),
  twitterUrl: clean(body.twitterUrl),
});

const validate = (data) => {
  if (!data.firstName) return "First Name is required";
  if (!data.lastName) return "Last Name is required";
  if (data.primaryContact && data.primaryContact.length !== 10) {
    return "Primary Contact Number must be 10 digits";
  }
  if (data.email && !/^[^\s@]+@gmail\.com$/i.test(data.email)) {
    return "Email Address must be a valid Gmail address";
  }
  return "";
};

exports.getNextTeacherId = async (_, res) => {
  try {
    res.json({ success: true, teacherId: await nextTeacherId() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeachers = async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM teachers ORDER BY id DESC");
    res.json({ success: true, data: rows.map(toCamel) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM teachers WHERE id=$1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Teacher not found" });
    res.json({ success: true, data: toCamel(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const data = bodyData(req.body);
    const message = validate(data);
    if (message) return res.status(400).json({ success: false, message });

    const teacherId = clean(req.body.teacherId) || (await nextTeacherId());
    const dir = ensureDir(teacherId, data.firstName, data.lastName);
    const photo = moveFile(req.files?.photo?.[0], dir, "photo");
    const resume = moveFile(req.files?.resume?.[0], dir, "Resume");
    const joiningLetter = moveFile(req.files?.joiningLetter?.[0], dir, "JoiningLetter");

    const values = [teacherId, ...Object.values(data), photo, resume, joiningLetter];
    const columns = `teacher_id, first_name, last_name, class_name, subject, gender, primary_contact, email, blood_group, date_of_joining,
      father_name, mother_name, date_of_birth, marital_status, language_known, qualification, work_experience, previous_school,
      previous_school_address, previous_school_phone, address, permanent_address, pan_number, status, notes, epf_no, basic_salary,
      contract_type, work_shift, work_location, date_of_leaving, medical_leaves, casual_leaves, maternity_leaves, sick_leaves,
      account_name, account_number, bank_name, ifsc_code, branch_name, route, vehicle_number, pickup_point, hostel, room_no,
      facebook, instagram, linked_in, youtube, twitter_url, photo, resume, joining_letter`;
    const placeholders = values.map((_, i) => `$${i + 1}`).join(",");

    const { rows } = await pool.query(
      `INSERT INTO teachers (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    res.status(201).json({ success: true, message: "Teacher added successfully", data: toCamel(rows[0]) });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ success: false, message: "Teacher ID or email already exists" });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { rows: oldRows } = await pool.query("SELECT * FROM teachers WHERE id=$1", [req.params.id]);
    if (!oldRows.length) return res.status(404).json({ success: false, message: "Teacher not found" });

    const data = bodyData(req.body);
    const message = validate(data);
    if (message) return res.status(400).json({ success: false, message });

    const old = oldRows[0];
    const dir = ensureDir(old.teacher_id, data.firstName, data.lastName);
    const photo = req.files?.photo?.[0] ? moveFile(req.files.photo[0], dir, "photo") : old.photo;
    const resume = req.files?.resume?.[0] ? moveFile(req.files.resume[0], dir, "Resume") : old.resume;
    const joiningLetter = req.files?.joiningLetter?.[0] ? moveFile(req.files.joiningLetter[0], dir, "JoiningLetter") : old.joining_letter;

    const values = [...Object.values(data), photo, resume, joiningLetter, req.params.id];
    const setCols = [
      "first_name","last_name","class_name","subject","gender","primary_contact","email","blood_group","date_of_joining",
      "father_name","mother_name","date_of_birth","marital_status","language_known","qualification","work_experience","previous_school",
      "previous_school_address","previous_school_phone","address","permanent_address","pan_number","status","notes","epf_no","basic_salary",
      "contract_type","work_shift","work_location","date_of_leaving","medical_leaves","casual_leaves","maternity_leaves","sick_leaves",
      "account_name","account_number","bank_name","ifsc_code","branch_name","route","vehicle_number","pickup_point","hostel","room_no",
      "facebook","instagram","linked_in","youtube","twitter_url","photo","resume","joining_letter"
    ].map((col, i) => `${col}=$${i + 1}`).join(",");

    const { rows } = await pool.query(`UPDATE teachers SET ${setCols} WHERE id=$${values.length} RETURNING *`, values);
    res.json({ success: true, message: "Teacher updated successfully", data: toCamel(rows[0]) });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ success: false, message: "Teacher ID or email already exists" });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    await pool.query("DELETE FROM teachers WHERE id=$1", [req.params.id]);
    res.json({ success: true, message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
