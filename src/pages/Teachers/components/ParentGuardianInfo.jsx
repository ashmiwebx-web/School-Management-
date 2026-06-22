import React from "react";
import { FiUsers } from "react-icons/fi";

import FormInput from "../../../components/Inputs/FormInput";
import TeacherSectionCard from "./TeacherSectionCard";

export default function ParentGuardianInfo({ formData, updateField }) {
  return (
    <TeacherSectionCard icon={FiUsers} title="Emergency Contact Information">
      <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
        <FormInput label="Father’s Name" value={formData.fatherName} maxLength={80} onChange={(v) => updateField("fatherName", v.replace(/[^a-zA-Z ]/g, ""))} />
        <FormInput label="Mother’s Name" value={formData.motherName} maxLength={80} onChange={(v) => updateField("motherName", v.replace(/[^a-zA-Z ]/g, ""))} />
        <FormInput label="Primary Contact Number" value={formData.primaryContact} numbersOnly maxLength={10} onChange={(v) => updateField("primaryContact", v)} />
        <FormInput label="Email Address" value={formData.email} maxLength={100} onChange={(v) => updateField("email", v)} />
      </div>
    </TeacherSectionCard>
  );
}
