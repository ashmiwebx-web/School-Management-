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

export default function PreviousSchoolInfo({ formData, updateField }) {
  return (
    <Card title="Previous School Details">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput label="School Name" value={formData.previousSchoolName} maxLength={20} onChange={(v) => updateField("previousSchoolName", v)} />
        <FormInput label="Address" value={formData.previousSchoolAddress} maxLength={50} onChange={(v) => updateField("previousSchoolAddress", v)} />
      </div>
    </Card>
  );
}