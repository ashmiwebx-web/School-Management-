import React from "react";
import { FiInfo } from "react-icons/fi";

import FormDate from "../../../components/Inputs/FormDate";
import FormInput from "../../../components/Inputs/FormInput";
import FormSelect from "../../../components/Inputs/FormSelect";
import ImageUploadBox from "../../../components/Upload/ImageUploadBox";
import TeacherSectionCard from "./TeacherSectionCard";

function LanguageBox({ value = [], onChange = () => {} }) {
  const languageText = Array.isArray(value) ? value.join(", ") : value || "";

  return (
    <FormInput
      label="Language Known"
      value={languageText}
      onChange={(v) =>
        onChange(
          String(v || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      }
    />
  );
}

export default function PersonalInfo({
  formData,
  updateField,
  classOptions,
  subjectOptions,
  genderOptions,
  bloodOptions,
  maritalOptions,
  statusOptions,
}) {
  return (
    <TeacherSectionCard icon={FiInfo} title="Personal Information">
      <div className="mb-5">
        <ImageUploadBox
          file={formData.photo}
          onChange={(file) => updateField("photo", file)}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-5">
        <FormInput label="Teacher ID" value={formData.teacherId} readOnly />

        <FormInput
          label="First Name"
          value={formData.firstName}
          maxLength={50}
          onChange={(v) =>
            updateField("firstName", v.replace(/[^a-zA-Z ]/g, ""))
          }
        />

        <FormInput
          label="Last Name"
          value={formData.lastName}
          maxLength={50}
          onChange={(v) =>
            updateField("lastName", v.replace(/[^a-zA-Z ]/g, ""))
          }
        />

        <FormSelect
          label="Class"
          value={formData.className}
          options={classOptions}
          onChange={(v) => updateField("className", v)}
        />

        <FormSelect
          label="Subject"
          value={formData.subject}
          options={subjectOptions}
          onChange={(v) => updateField("subject", v)}
        />

        <FormSelect
          label="Gender"
          value={formData.gender}
          options={genderOptions}
          onChange={(v) => updateField("gender", v)}
        />

        <FormInput
          label="Primary Contact Number"
          value={formData.primaryContact}
          numbersOnly
          maxLength={10}
          onChange={(v) => updateField("primaryContact", v)}
        />

        <FormInput
          label="Email Address"
          value={formData.email}
          maxLength={100}
          onChange={(v) => updateField("email", v)}
        />

        <FormSelect
          label="Blood Group"
          value={formData.bloodGroup}
          options={bloodOptions}
          onChange={(v) => updateField("bloodGroup", v)}
        />

        <FormDate
          label="Date of Joining"
          value={formData.dateOfJoining}
          onChange={(v) => updateField("dateOfJoining", v)}
        />

        <FormInput
          label="Father’s Name"
          value={formData.fatherName}
          maxLength={80}
          onChange={(v) =>
            updateField("fatherName", v.replace(/[^a-zA-Z ]/g, ""))
          }
        />

        <FormInput
          label="Mother’s Name"
          value={formData.motherName}
          maxLength={80}
          onChange={(v) =>
            updateField("motherName", v.replace(/[^a-zA-Z ]/g, ""))
          }
        />

        <FormDate
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(v) => updateField("dateOfBirth", v)}
        />

        <FormSelect
          label="Marital Status"
          value={formData.maritalStatus}
          options={maritalOptions}
          onChange={(v) => updateField("maritalStatus", v)}
        />

        <LanguageBox
          value={formData.languageKnown}
          onChange={(v) => updateField("languageKnown", v)}
        />

        <FormInput
          label="Qualification"
          value={formData.qualification}
          maxLength={120}
          onChange={(v) => updateField("qualification", v)}
        />

        <FormInput
          label="Work Experience"
          value={formData.workExperience}
          maxLength={50}
          onChange={(v) => updateField("workExperience", v)}
        />

        <FormSelect
          label="Status"
          value={formData.status}
          options={statusOptions}
          onChange={(v) => updateField("status", v)}
        />
      </div>
    </TeacherSectionCard>
  );
}