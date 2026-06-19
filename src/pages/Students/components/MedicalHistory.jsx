import React from "react";
import FormInput from "../../../components/Inputs/FormInput";

function Card({ title, children }) {
  return (
    <section className="rounded-[8px] border border-[#e5e9f2] bg-white">
      <div className="bg-[#e9edf5] px-6 py-4">
        <h2 className="text-[20px] font-bold text-[#061b49]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function MedicalHistory({ formData, updateField }) {
  return (
    <Card title="Medical History">
      <div className="mb-5 flex gap-5">
        <span>Medical Condition of a Student</span>
        {["Good", "Bad", "Others"].map((x) => (
          <label key={x} className="flex items-center gap-2">
            <input type="radio" checked={formData.medicalCondition === x} onChange={() => updateField("medicalCondition", x)} />
            {x}
          </label>
        ))}
      </div>

      <FormInput label="Allergies" value={formData.allergies} maxLength={20} onChange={(v) => updateField("allergies", v)} />

      <div className="mt-5">
        <FormInput label="Medications" value={formData.medications} maxLength={20} onChange={(v) => updateField("medications", v)} />
      </div>
    </Card>
  );
}