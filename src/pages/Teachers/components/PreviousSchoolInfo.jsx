import React from "react";
import { FiFileText } from "react-icons/fi";

import FormInput from "../../../components/Inputs/FormInput";
import TeacherSectionCard from "./TeacherSectionCard";

export default function PreviousSchoolInfo({ formData, updateField }) {
  return (
    <TeacherSectionCard icon={FiFileText} title="Previous School Details">
      <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-3">
        <FormInput label="Previous School if Any" value={formData.previousSchool} maxLength={120} onChange={(v) => updateField("previousSchool", v)} />
        <FormInput label="Previous School Address" value={formData.previousSchoolAddress} maxLength={180} onChange={(v) => updateField("previousSchoolAddress", v)} />
        <FormInput label="Previous School Phone No" value={formData.previousSchoolPhone} numbersOnly maxLength={10} onChange={(v) => updateField("previousSchoolPhone", v)} />
      </div>
    </TeacherSectionCard>
  );
}
