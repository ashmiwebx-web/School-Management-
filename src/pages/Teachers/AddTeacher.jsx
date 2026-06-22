import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CommonButton from "../../components/Buttons/CommonButton";
import PersonalInfo from "./components/PersonalInfo";
import ParentGuardianInfo from "./components/ParentGuardianInfo";
import AddressInfo from "./components/AddressInfo";
import DocumentsInfo from "./components/DocumentsInfo";
import MedicalHistory from "./components/MedicalHistory";
import PreviousSchoolInfo from "./components/PreviousSchoolInfo";
import OtherDetails from "./components/OtherDetails";
import { showError, showSuccess } from "../../components/Toast/AppToast";
import {
  createTeacher,
  getNextTeacherId,
  getTeacherById,
  updateTeacher,
} from "../../services/teacherService";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  if (["ninth standard", "tenth standard"].includes(value)) return "HIGH SCHOOL";

  if (["eleventh standard", "twelfth standard"].includes(value)) {
    return "HIGHER SECONDARY";
  }

  return "";
};

export default function AddTeacher() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [classOptions, setClassOptions] = useState(defaultClassOptions);
  const [alloteSubjects, setAlloteSubjects] = useState([]);

  const updateField = (field, value) => {
    setFormData((prev) => {
      if (field === "className") {
        return { ...prev, className: value, subject: "" };
      }
      return { ...prev, [field]: value };
    });
  };

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
        // Keep page working if optional dropdown APIs are not ready.
      }
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        if (isEdit) {
          const teacher = await getTeacherById(id);
          setFormData({ ...emptyForm, ...teacher });
          return;
        }

        const teacherId = await getNextTeacherId();
        setFormData((prev) => ({ ...prev, teacherId }));
      } catch (error) {
        showError(error.message);
      }
    };

    loadTeacher();
  }, [id, isEdit]);

  const removeLanguage = (lang) => {
    updateField(
      "languageKnown",
      formData.languageKnown.filter((item) => item !== lang)
    );
  };

  const filteredSubjectOptions = useMemo(() => {
    if (!formData.className) return [];

    const academicLevel = getAcademicLevelByClass(formData.className);
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
  }, [formData.className, alloteSubjects]);

  const validate = () => {
    if (!formData.teacherId) return "Teacher ID is required";
    if (!formData.firstName.trim()) return "First Name is required";
    if (!formData.lastName.trim()) return "Last Name is required";

    if (formData.primaryContact && formData.primaryContact.length !== 10) {
      return "Primary Contact Number must be 10 digits";
    }

    if (formData.email && !/^[^\s@]+@gmail\.com$/i.test(formData.email)) {
      return "Email Address must be a valid Gmail address";
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        return "Password and Confirm Password must match";
      }
    }

    return "";
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
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
      <div className="mb-5">
        <h1 className="text-[20px] font-semibold text-[#1f2937]">
          {isEdit ? "Edit Teacher" : "Add Teacher"}
        </h1>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          Dashboard / Teachers / {isEdit ? "Edit Teacher" : "Add Teacher"}
        </p>
      </div>

      <PersonalInfo
        formData={formData}
        updateField={updateField}
        classOptions={classOptions}
        subjectOptions={filteredSubjectOptions}
        genderOptions={genderOptions}
        bloodOptions={bloodOptions}
        maritalOptions={maritalOptions}
        statusOptions={statusOptions}
        onRemoveLanguage={removeLanguage}
      />

      <ParentGuardianInfo formData={formData} updateField={updateField} />
      <AddressInfo formData={formData} updateField={updateField} />
      <PreviousSchoolInfo formData={formData} updateField={updateField} />
      <MedicalHistory formData={formData} updateField={updateField} />
      <OtherDetails formData={formData} updateField={updateField} />
      <DocumentsInfo formData={formData} updateField={updateField} />

      <div className="flex justify-end gap-4 pb-6">
        <CommonButton
          type="button"
          variant="secondary"
          size="lg"
          className="min-w-[120px]"
          onClick={() => navigate("/teacher-list")}
        >
          Cancel
        </CommonButton>

        <CommonButton
          type="submit"
          variant="add"
          size="lg"
          className="min-w-[160px]"
          disabled={saving}
        >
          {saving ? "Saving..." : isEdit ? "Update Teacher" : "Add Teacher"}
        </CommonButton>
      </div>
    </form>
  );
}
