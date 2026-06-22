import React from "react";
import { FiUsers } from "react-icons/fi";

import FormInput from "../../../components/Inputs/FormInput";
import TeacherSectionCard from "./TeacherSectionCard";

export default function MedicalHistory({ formData, updateField }) {
  return (
    <TeacherSectionCard icon={FiUsers} title="Leaves">
      <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
        <FormInput label="Medical Leaves" value={formData.medicalLeaves} numbersOnly maxLength={3} onChange={(v) => updateField("medicalLeaves", v)} />
        <FormInput label="Casual Leaves" value={formData.casualLeaves} numbersOnly maxLength={3} onChange={(v) => updateField("casualLeaves", v)} />
        <FormInput label="Maternity Leaves" value={formData.maternityLeaves} numbersOnly maxLength={3} onChange={(v) => updateField("maternityLeaves", v)} />
        <FormInput label="Sick Leaves" value={formData.sickLeaves} numbersOnly maxLength={3} onChange={(v) => updateField("sickLeaves", v)} />
      </div>
    </TeacherSectionCard>
  );
}
