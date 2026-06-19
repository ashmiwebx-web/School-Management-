import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PersonalInfo from "./components/PersonalInfo";
import ParentGuardianInfo from "./components/ParentGuardianInfo";
import SiblingInfo from "./components/SiblingInfo";
import AddressInfo from "./components/AddressInfo";
import TransportInfo from "./components/TransportInfo";
import HostelInfo from "./components/HostelInfo";
import DocumentsInfo from "./components/DocumentsInfo";
import MedicalHistory from "./components/MedicalHistory";
import PreviousSchoolInfo from "./components/PreviousSchoolInfo";
import OtherDetails from "./components/OtherDetails";

import {
  getNextStudentIds,
  createStudent,
  getStudentById,
  updateStudent,
} from "../../services/studentService";

import { showError, showSuccess } from "../../components/Toast/AppToast";

const emptyForm = {
  academicYear: "2026-2027",
  admissionNumber: "",
  adRollNo: "",
  admissionDate: "",
  firstName: "",
  lastName: "",
  className: "",
  sectionName: "",
  gender: "",
  status: "Active",
  dateOfBirth: "",
  bloodGroup: "",
  house: "",
  religion: "",
  category: "",
  caste: "",
  motherTongue: "",
  languageKnown: ["Tamil", "English"],
  primaryContact: "",
  email: "",

  fatherName: "",
  fatherEmail: "",
  fatherPhone: "",
  fatherOccupation: "",
  motherName: "",
  motherEmail: "",
  motherPhone: "",
  motherOccupation: "",

  guardianType: "",
  guardianName: "",
  guardianRelation: "",
  guardianPhone: "",
  guardianEmail: "",
  guardianOccupation: "",
  guardianAddress: "",

siblingInSchool: "Yes",
siblings: [],

  currentAddress: "",
  permanentAddress: "",

  route: "",
  vehicleNumber: "",
  pickupPoint: "",
  hostel: "",
  roomNo: "",

  medicalCondition: "",
  allergies: "",
  medications: "",

  previousSchoolName: "",
  previousSchoolAddress: "",

  bankName: "",
  branch: "",
  ifscNumber: "",
  otherInfo: "",

  photo: null,
  fatherPhoto: null,
  motherPhoto: null,
  guardianPhoto: null,
  birthCertificate: null,
  medicalDocument: null,
  transferCertificate: null,
};

export default function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (isEdit) {
      loadStudent();
    } else {
      loadIds();
    }
  }, [id]);

  const loadIds = async () => {
    try {
      const data = await getNextStudentIds();

      setFormData((prev) => ({
        ...prev,
        admissionNumber: data.admissionNumber || "",
        adRollNo: data.adRollNo || "",
      }));
    } catch {
      showError("Failed to load student IDs");
    }
  };

  const loadStudent = async () => {
    try {
      const student = await getStudentById(id);

      setFormData((prev) => ({
        ...prev,
        academicYear: student.academicYear || "2026-2027",
        admissionNumber: student.admissionNumber || "",
        adRollNo: student.adRollNo || "",
        admissionDate: student.admissionDate || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        className: student.className || "",
        sectionName: student.sectionName || "",
        gender: student.gender || "",
        status: student.status || "Active",
        dateOfBirth: student.dateOfBirth || "",
        bloodGroup: student.bloodGroup || "",
        house: student.house || "",
        religion: student.religion || "",
        category: student.category || "",
        caste: student.caste || "",
        motherTongue: student.motherTongue || "",
        languageKnown: Array.isArray(student.languageKnown)
          ? student.languageKnown
          : ["Tamil", "English"],
        primaryContact: student.primaryContact || "",
        email: student.email || "",

        fatherName: student.fatherName || "",
        fatherEmail: student.fatherEmail || "",
        fatherPhone: student.fatherPhone || "",
        fatherOccupation: student.fatherOccupation || "",
        motherName: student.motherName || "",
        motherEmail: student.motherEmail || "",
        motherPhone: student.motherPhone || "",
        motherOccupation: student.motherOccupation || "",

        guardianType: student.guardianType || "",
        guardianName: student.guardianName || "",
        guardianRelation: student.guardianRelation || "",
        guardianPhone: student.guardianPhone || "",
        guardianEmail: student.guardianEmail || "",
        guardianOccupation: student.guardianOccupation || "",
        guardianAddress: student.guardianAddress || "",

   siblingInSchool:
  student.siblingInSchool || (student.siblings?.length ? "Yes" : "No"),
siblings: Array.isArray(student.siblings) ? student.siblings : [],
        currentAddress: student.currentAddress || "",
        permanentAddress: student.permanentAddress || "",

        route: student.route || "",
        vehicleNumber: student.vehicleNumber || "",
        pickupPoint: student.pickupPoint || "",
        hostel: student.hostel || "",
        roomNo: student.roomNo || "",

        medicalCondition: student.medicalCondition || "",
        allergies: student.allergies || "",
        medications: student.medications || "",

        previousSchoolName: student.previousSchoolName || "",
        previousSchoolAddress: student.previousSchoolAddress || "",

        bankName: student.bankName || "",
        branch: student.branch || "",
        ifscNumber: student.ifscNumber || "",
        otherInfo: student.otherInfo || "",

        photo: student.photo || null,
        fatherPhoto: student.fatherPhoto || null,
        motherPhoto: student.motherPhoto || null,
        guardianPhoto: student.guardianPhoto || null,
        birthCertificate: student.birthCertificate || null,
        medicalDocument: student.medicalDocument || null,
        transferCertificate: student.transferCertificate || null,
      }));
    } catch (error) {
      showError(error.message);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.admissionNumber) return "Admission Number is required";
    if (!formData.adRollNo) return "Ad.Roll No is required";
    if (!formData.firstName.trim()) return "First Name is required";
    if (!formData.className) return "Class is required";
    if (!formData.gender) return "Gender is required";
    if (!formData.dateOfBirth) return "Date of Birth is required";

    if (formData.primaryContact.length !== 10) {
      return "Primary Contact Number must be 10 digits";
    }

    if (!formData.email.trim()) return "Email is required";
    if (!formData.email.endsWith("@gmail.com")) {
      return "Email must end with @gmail.com";
    }

    if (!formData.fatherName.trim()) return "Father Name is required";
    if (formData.fatherPhone.length !== 10) {
      return "Father Phone must be 10 digits";
    }

    if (!formData.motherName.trim()) return "Mother Name is required";
    if (formData.motherPhone.length !== 10) {
      return "Mother Phone must be 10 digits";
    }

    if (!formData.currentAddress.trim()) {
      return "Current Address is required";
    }

    return "";
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        payload.append(key, value);
        return;
      }

      if (typeof value === "string" && value.startsWith("uploads/")) {
        return;
      }

      if (Array.isArray(value)) {
        payload.append(key, JSON.stringify(value));
        return;
      }

      payload.append(key, value);
    });

    return payload;
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      showError(error);
      return;
    }

    try {
      const payload = buildPayload();

      if (isEdit) {
        await updateStudent(id, payload);
        showSuccess("Student updated successfully");
      } else {
        await createStudent(payload);
        showSuccess("Student added successfully");
      }

      navigate("/student-list");
    } catch (err) {
      showError(err.message || "Something went wrong");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#061b49]">
          {isEdit ? "Edit Student" : "Add Student"}
        </h1>
        <p className="mt-1 text-[14px] text-[#64748b]">
          Dashboard / Students / {isEdit ? "Edit Student" : "Add Student"}
        </p>
      </div>

      <PersonalInfo formData={formData} updateField={updateField} />
      <ParentGuardianInfo formData={formData} updateField={updateField} />
      <SiblingInfo formData={formData} updateField={updateField} />
      <AddressInfo formData={formData} updateField={updateField} />
      <TransportInfo formData={formData} updateField={updateField} />
      <HostelInfo formData={formData} updateField={updateField} />
      <DocumentsInfo formData={formData} updateField={updateField} />
      <MedicalHistory formData={formData} updateField={updateField} />
      <PreviousSchoolInfo formData={formData} updateField={updateField} />
      <OtherDetails formData={formData} updateField={updateField} />

      <div className="flex justify-end gap-4 pb-6">
        <button
          type="button"
          onClick={() => navigate("/student-list")}
          className="h-[44px] rounded-[6px] bg-[#edf1f7] px-6 text-[14px] font-semibold text-[#34415d]"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="h-[44px] rounded-[6px] bg-[#506ee4] px-6 text-[14px] font-semibold text-white"
        >
          {isEdit ? "Update Student" : "Add Student"}
        </button>
      </div>
    </form>
  );
}