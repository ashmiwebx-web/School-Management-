import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiBriefcase,
  FiFileText,
  FiInfo,
  FiMap,
  FiMapPin,
  FiShare2,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import FormDate from "../../components/Inputs/FormDate";
import FormInput from "../../components/Inputs/FormInput";
import FormSelect from "../../components/Inputs/FormSelect";
import FormTextarea from "../../components/Inputs/FormTextarea";
import { showError, showSuccess } from "../../components/Toast/AppToast";
import {
  createTeacher,
  getNextTeacherId,
  getTeacherById,
  updateTeacher,
} from "../../services/teacherService";

const emptyForm = {
  teacherId: "",
  firstName: "",
  lastName: "",
  className: "",
  subject: "",
  gender: "",
  primaryContact: "",
  email: "",
  bloodGroup: "",
  dateOfJoining: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  maritalStatus: "",
  languageKnown: ["Tamil", "English"],
  qualification: "",
  workExperience: "",
  previousSchool: "",
  previousSchoolAddress: "",
  previousSchoolPhone: "",
  address: "",
  permanentAddress: "",
  panNumber: "",
  status: "Active",
  notes: "",
  epfNo: "",
  basicSalary: "",
  contractType: "",
  workShift: "",
  workLocation: "",
  dateOfLeaving: "",
  medicalLeaves: "",
  casualLeaves: "",
  maternityLeaves: "",
  sickLeaves: "",
  accountName: "",
  accountNumber: "",
  bankName: "",
  ifscCode: "",
  branchName: "",
  route: "",
  vehicleNumber: "",
  pickupPoint: "",
  hostel: "",
  roomNo: "",
  facebook: "",
  instagram: "",
  linkedIn: "",
  youtube: "",
  twitterUrl: "",
  photo: null,
  resume: null,
  joiningLetter: null,
  newPassword: "",
  confirmPassword: "",
};

const opt = (arr) => arr.map((value) => ({ label: value, value }));
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const uniqueOptions = (values = []) =>
  opt([...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))]);

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const getAcademicLevelByClass = (className = "") => {
  const value = String(className || "").trim().toLowerCase();

  if (["pre kg", "prekg", "lkg", "ukg"].includes(value)) return "KINDER";

  if (
    [
      "first standard",
      "second standard",
      "third standard",
      "fourth standard",
      "fifth standard",
    ].includes(value)
  ) {
    return "PRIMARY";
  }

  if (["sixth standard", "seventh standard", "eighth standard"].includes(value)) {
    return "MIDDLE SCHOOL";
  }

  if (["ninth standard", "tenth standard"].includes(value)) {
    return "HIGH SCHOOL";
  }

  if (["eleventh standard", "twelfth standard"].includes(value)) {
    return "HIGHER SECONDARY";
  }

  return "";
};

const defaultClassOptions = opt([
  "Pre KG",
  "LKG",
  "UKG",
  "First Standard",
  "Second Standard",
  "Third Standard",
  "Fourth Standard",
  "Fifth Standard",
  "Sixth Standard",
  "Seventh Standard",
  "Eighth Standard",
  "Ninth Standard",
  "Tenth Standard",
  "Eleventh Standard",
  "Twelfth Standard",
]);


const genderOptions = opt(["Male", "Female", "Other"]);
const bloodOptions = opt(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);
const maritalOptions = opt(["Single", "Married"]);
const statusOptions = opt(["Active", "Inactive"]);
const contractOptions = opt(["Permanent", "Temporary", "Contract"]);
const shiftOptions = opt(["Morning", "Day", "Evening"]);

function Card({ icon: Icon, title, children }) {
  return (
    <section className="overflow-hidden rounded-[6px] border border-[#e5e9f2] bg-white shadow-sm">
      <div className="flex h-[68px] items-center gap-3 bg-[#e9edf5] px-6">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-white text-[#061b49]">
          <Icon size={17} />
        </span>
        <h2 className="text-[22px] font-bold leading-none text-[#061b49]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function TeacherImageUpload({ file, onChange }) {
  const [preview, setPreview] = useState("");
  const inputId = useMemo(() => `teacher-photo-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    if (typeof file === "string" && file) {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      setPreview(file.startsWith("http") ? file : `${API}/${file.replace(/^\/+/, "")}`);
      return undefined;
    }

    setPreview("");
    return undefined;
  }, [file]);

  return (
    <div className="mb-5 flex items-center gap-4">
      <div className="flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-[6px] border border-dashed border-[#dbe3f0] bg-white text-[#061b49]">
        {preview ? <img src={preview} alt="Teacher" className="h-full w-full object-cover" /> : <span className="text-[26px]">📷</span>}
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <label
            htmlFor={inputId}
            className="flex h-[38px] cursor-pointer items-center justify-center rounded-[5px] border border-[#e5e9f2] bg-white px-6 text-[13px] font-semibold text-[#34415d]"
          >
            Upload
          </label>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="h-[38px] cursor-pointer rounded-[5px] bg-[#506ee4] px-6 text-[13px] font-semibold text-white hover:bg-[#3d5ee1]"
          >
            Remove
          </button>
        </div>
        <p className="text-[14px] text-[#64748b]">Upload image size 2MB, Format JPG, JPEG, PNG, SVG</p>
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/svg+xml"
        hidden
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}

function LanguageBox({ value = [], onRemove }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">Language Known</label>
      <div className="flex h-[44px] items-center gap-2 overflow-hidden rounded-[6px] border border-[#e5e9f2] bg-white px-3 text-[14px] text-[#202c4b]">
        {value.map((lang) => (
          <span key={lang} className="flex items-center rounded-[4px] bg-[#f1f5f9] px-2 py-1 text-[13px] text-[#34415d]">
            {lang}
            <button type="button" onClick={() => onRemove(lang)} className="ml-2 cursor-pointer font-bold text-[#061b49]">
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function DocumentUpload({ title, buttonText, file, onChange }) {
  const inputId = useMemo(() => `doc-${Math.random().toString(36).slice(2)}`, []);
  const fileName = file instanceof File ? file.name : file ? String(file).split("/").pop() : "Resume.pdf";

  return (
    <div>
      <label className="mb-3 block text-[14px] font-semibold text-[#061b49]">{title}</label>
      <p className="mb-4 text-[14px] text-[#64748b]">Upload document size 2MB, Accepted Format PDF</p>
      <div className="flex items-center gap-3">
        <label htmlFor={inputId} className="flex h-[36px] cursor-pointer items-center rounded-[5px] bg-[#506ee4] px-5 text-[13px] font-semibold text-white hover:bg-[#3d5ee1]">
          {buttonText}
        </label>
        <span className="text-[14px] text-[#64748b]">{fileName}</span>
      </div>
      <input id={inputId} type="file" accept="application/pdf" hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </div>
  );
}

export default function AddTeacher() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [classOptions, setClassOptions] = useState(defaultClassOptions);
  const [alloteSubjects, setAlloteSubjects] = useState([]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [standardRes, alloteRes] = await Promise.allSettled([
          fetch(`${API}/api/standards`).then((res) => res.json()),
          fetch(`${API}/api/allote-subjects`).then((res) => res.json()),
        ]);

        if (standardRes.status === "fulfilled") {
          const standards = normalizeList(standardRes.value);
          const values = standards.map(
            (item) =>
              item.stdName ||
              item.std_name ||
              item.standardName ||
              item.className ||
              item.name ||
              item.title
          );

          const options = uniqueOptions(values);
          if (options.length) setClassOptions(options);
        }

        if (alloteRes.status === "fulfilled") {
          setAlloteSubjects(normalizeList(alloteRes.value));
        }
      } catch {
        // Keep form working even if dropdown APIs are not ready.
      }
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        if (isEdit) {
          const teacher = await getTeacherById(id);
          setForm({ ...emptyForm, ...teacher });
        } else {
          const teacherId = await getNextTeacherId();
          setForm((prev) => ({ ...prev, teacherId }));
        }
      } catch (error) {
        showError(error.message);
      }
    };

    loadTeacher();
  }, [id, isEdit]);

  const removeLanguage = (lang) => {
    setField(
      "languageKnown",
      form.languageKnown.filter((item) => item !== lang)
    );
  };
  const filteredSubjectOptions = useMemo(() => {
    if (!form.className) return [];

    const academicLevel = getAcademicLevelByClass(form.className);
    if (!academicLevel) return [];

    const matched = alloteSubjects.find((item) => {
      const level = String(
        item.academicLevel ||
          item.academicLevelName ||
          item.levelName ||
          item.level_name ||
          ""
      )
        .trim()
        .toUpperCase();

      return level === academicLevel;
    });

    if (!matched || !Array.isArray(matched.subjects)) return [];

    return matched.subjects
      .map((subject) => {
        const name =
          subject.subjectName ||
          subject.subject_name ||
          subject.name ||
          subject.title ||
          "";

        return name ? { label: name, value: name } : null;
      })
      .filter(Boolean);
  }, [form.className, alloteSubjects]);

  const validate = () => {
    if (!form.teacherId) return "Teacher ID is required";
    if (!form.firstName.trim()) return "First Name is required";
    if (!form.lastName.trim()) return "Last Name is required";
    if (form.primaryContact && form.primaryContact.length !== 10) {
      return "Primary Contact Number must be 10 digits";
    }
    if (form.email && !/^[^\s@]+@gmail\.com$/i.test(form.email)) {
      return "Email Address must be a valid Gmail address";
    }
    if (form.newPassword || form.confirmPassword) {
      if (form.newPassword !== form.confirmPassword) return "Password and Confirm Password must match";
    }
    return "";
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (["photo", "resume", "joiningLetter"].includes(key)) {
        if (value instanceof File) payload.append(key, value);
        return;
      }

      if (key === "languageKnown") {
        payload.append(key, JSON.stringify(value || []));
        return;
      }

      payload.append(key, value ?? "");
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorMessage = validate();
    if (errorMessage) {
      showError(errorMessage);
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateTeacher(id, buildPayload());
        showSuccess("Teacher updated successfully");
      } else {
        await createTeacher(buildPayload());
        showSuccess("Teacher added successfully");
      }

      navigate("/teacher-list");
    } catch (error) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 pb-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#061b49]">{isEdit ? "Edit Teacher" : "Add Teacher"}</h1>
        <div className="mt-2 flex items-center gap-2 text-[15px] text-[#536484]">
          <span>Dashboard</span>
          <span>/</span>
          <span>Teachers</span>
          <span>/</span>
          <span className="font-medium text-[#061b49]">{isEdit ? "Edit Teacher" : "Add Teacher"}</span>
        </div>
      </div>

      <Card icon={FiInfo} title="Personal Information">
        <TeacherImageUpload file={form.photo} onChange={(file) => setField("photo", file)} />

        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-5">
          <FormInput label="Teacher ID" value={form.teacherId} readOnly onChange={(v) => setField("teacherId", v)} />
          <FormInput label="First Name" value={form.firstName} onChange={(v) => setField("firstName", v.replace(/[^a-zA-Z ]/g, ""))} maxLength={50} />
          <FormInput label="Last Name" value={form.lastName} onChange={(v) => setField("lastName", v.replace(/[^a-zA-Z ]/g, ""))} maxLength={50} />
          <FormSelect
            label="Class"
            value={form.className}
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                className: v,
                subject: "",
              }))
            }
            options={classOptions}
          />
          <FormSelect
            label="Subject"
            value={form.subject}
            onChange={(v) => setField("subject", v)}
            options={filteredSubjectOptions}
          />

          <FormSelect label="Gender" value={form.gender} onChange={(v) => setField("gender", v)} options={genderOptions} />
          <FormInput label="Primary Contact Number" value={form.primaryContact} onChange={(v) => setField("primaryContact", v)} numbersOnly maxLength={10} />
          <FormInput label="Email Address" value={form.email} onChange={(v) => setField("email", v)} maxLength={100} />
          <FormSelect label="Blood Group" value={form.bloodGroup} onChange={(v) => setField("bloodGroup", v)} options={bloodOptions} />
          <FormDate label="Date of Joining" value={form.dateOfJoining} onChange={(v) => setField("dateOfJoining", v)} />

          <FormInput label="Father’s Name" value={form.fatherName} onChange={(v) => setField("fatherName", v.replace(/[^a-zA-Z ]/g, ""))} maxLength={80} />
          <FormInput label="Mother’s Name" value={form.motherName} onChange={(v) => setField("motherName", v.replace(/[^a-zA-Z ]/g, ""))} maxLength={80} />
          <FormDate label="Date of Birth" value={form.dateOfBirth} onChange={(v) => setField("dateOfBirth", v)} />
          <FormSelect label="Marital Status" value={form.maritalStatus} onChange={(v) => setField("maritalStatus", v)} options={maritalOptions} />
          <LanguageBox value={form.languageKnown} onRemove={removeLanguage} />

          <FormInput label="Qualification" value={form.qualification} onChange={(v) => setField("qualification", v)} maxLength={120} />
          <FormInput label="Work Experience" value={form.workExperience} onChange={(v) => setField("workExperience", v)} maxLength={50} />
          <FormInput label="Previous School if Any" value={form.previousSchool} onChange={(v) => setField("previousSchool", v)} maxLength={120} />
          <FormInput label="Previous School Address" value={form.previousSchoolAddress} onChange={(v) => setField("previousSchoolAddress", v)} maxLength={180} />
          <FormInput label="Previous School Phone No" value={form.previousSchoolPhone} onChange={(v) => setField("previousSchoolPhone", v)} numbersOnly maxLength={10} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
          <FormInput label="Address" value={form.address} onChange={(v) => setField("address", v)} maxLength={250} />
          <FormInput label="Permanent Address" value={form.permanentAddress} onChange={(v) => setField("permanentAddress", v)} maxLength={250} />
          <FormInput label="PAN Number / ID Number" value={form.panNumber} onChange={(v) => setField("panNumber", v.toUpperCase())} maxLength={20} />
          <FormSelect label="Status" value={form.status} onChange={(v) => setField("status", v)} options={statusOptions} />
        </div>

        <div className="mt-5">
          <FormTextarea label="Notes" value={form.notes} onChange={(v) => setField("notes", v)} placeholder="Other Information" rows={5} maxLength={500} />
        </div>
      </Card>

      <Card icon={FiBriefcase} title="Payroll">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FormInput label="EPF No" value={form.epfNo} onChange={(v) => setField("epfNo", v)} maxLength={50} />
          <FormInput label="Basic Salary" value={form.basicSalary} onChange={(v) => setField("basicSalary", v)} numbersOnly maxLength={10} />
          <FormSelect label="Contract Type" value={form.contractType} onChange={(v) => setField("contractType", v)} options={contractOptions} />
          <FormSelect label="Work Shift" value={form.workShift} onChange={(v) => setField("workShift", v)} options={shiftOptions} />
          <FormInput label="Work Location" value={form.workLocation} onChange={(v) => setField("workLocation", v)} maxLength={120} />
          <FormDate label="Date of Leaving" value={form.dateOfLeaving} onChange={(v) => setField("dateOfLeaving", v)} />
        </div>
      </Card>

      <Card icon={FiUsers} title="Leaves">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
          <FormInput label="Medical Leaves" value={form.medicalLeaves} onChange={(v) => setField("medicalLeaves", v)} numbersOnly maxLength={3} />
          <FormInput label="Casual Leaves" value={form.casualLeaves} onChange={(v) => setField("casualLeaves", v)} numbersOnly maxLength={3} />
          <FormInput label="Maternity Leaves" value={form.maternityLeaves} onChange={(v) => setField("maternityLeaves", v)} numbersOnly maxLength={3} />
          <FormInput label="Sick Leaves" value={form.sickLeaves} onChange={(v) => setField("sickLeaves", v)} numbersOnly maxLength={3} />
        </div>
      </Card>

      <Card icon={FiMap} title="Bank Account Detail">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FormInput label="Account Name" value={form.accountName} onChange={(v) => setField("accountName", v)} maxLength={120} />
          <FormInput label="Account Number" value={form.accountNumber} onChange={(v) => setField("accountNumber", v)} numbersOnly maxLength={20} />
          <FormInput label="Bank Name" value={form.bankName} onChange={(v) => setField("bankName", v)} maxLength={100} />
          <FormInput label="IFSC Code" value={form.ifscCode} onChange={(v) => setField("ifscCode", v.toUpperCase())} maxLength={20} />
          <FormInput label="Branch Name" value={form.branchName} onChange={(v) => setField("branchName", v)} maxLength={100} />
        </div>
      </Card>

      <Card icon={FiMapPin} title="Transport Information">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FormSelect label="Route" value={form.route} onChange={(v) => setField("route", v)} options={opt(["Route 1", "Route 2", "Route 3"])} />
          <FormSelect label="Vehicle Number" value={form.vehicleNumber} onChange={(v) => setField("vehicleNumber", v)} options={opt(["TN 01 AB 1234", "TN 02 CD 5678"])} />
          <FormSelect label="Pickup Point" value={form.pickupPoint} onChange={(v) => setField("pickupPoint", v)} options={opt(["Main Gate", "Bus Stop", "Railway Station"])} />
        </div>
      </Card>

      <Card icon={FiUserCheck} title="Hostel Information">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
          <FormSelect label="Hostel" value={form.hostel} onChange={(v) => setField("hostel", v)} options={opt(["Yes", "No"])} />
          <FormSelect label="Room No" value={form.roomNo} onChange={(v) => setField("roomNo", v)} options={opt(["101", "102", "103"])} />
        </div>
      </Card>

      <Card icon={FiShare2} title="Social Media Links">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-5">
          <FormInput label="Facebook" value={form.facebook} onChange={(v) => setField("facebook", v)} maxLength={200} />
          <FormInput label="Instagram" value={form.instagram} onChange={(v) => setField("instagram", v)} maxLength={200} />
          <FormInput label="Linked In" value={form.linkedIn} onChange={(v) => setField("linkedIn", v)} maxLength={200} />
          <FormInput label="Youtube" value={form.youtube} onChange={(v) => setField("youtube", v)} maxLength={200} />
          <FormInput label="Twitter URL" value={form.twitterUrl} onChange={(v) => setField("twitterUrl", v)} maxLength={200} />
        </div>
      </Card>

      <Card icon={FiFileText} title="Documents">
        <div className="grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-2">
          <DocumentUpload title="Upload Resume" buttonText={form.resume ? "Change" : "Upload Document"} file={form.resume} onChange={(file) => setField("resume", file)} />
          <DocumentUpload title="Upload Joining Letter" buttonText="Upload Document" file={form.joiningLetter} onChange={(file) => setField("joiningLetter", file)} />
        </div>
      </Card>

      <Card icon={FiFileText} title="Password">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
          <FormInput label="New Password" type="password" value={form.newPassword} onChange={(v) => setField("newPassword", v)} maxLength={30} />
          <FormInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(v) => setField("confirmPassword", v)} maxLength={30} />
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => navigate(-1)} className="h-[44px] cursor-pointer rounded-[6px] bg-[#eef2f8] px-7 text-[14px] font-semibold text-[#34415d] hover:bg-[#e2e8f0]">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="h-[44px] cursor-pointer rounded-[6px] bg-[#506ee4] px-7 text-[14px] font-semibold text-white hover:bg-[#3d5ee1] disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Saving..." : isEdit ? "Update Teacher" : "Add Teacher"}
        </button>
      </div>
    </form>
  );
}
