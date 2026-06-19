import React from "react";
import FormInput from "../../../components/Inputs/FormInput";
import FormTextarea from "../../../components/Inputs/FormTextarea";

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

export default function OtherDetails({ formData, updateField }) {
  return (
    <Card title="Other Details">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <FormInput
          label="Bank Name"
          value={formData.bankName}
          maxLength={20}
          onChange={(v) => updateField("bankName", v)}
        />

        <FormInput
          label="Branch"
          value={formData.branch}
          maxLength={20}
          onChange={(v) => updateField("branch", v)}
        />

        <FormInput
          label="IFSC Number"
          value={formData.ifscNumber}
          maxLength={20}
          onChange={(v) => updateField("ifscNumber", v)}
        />
      </div>

      <div className="mt-5">
        <FormTextarea
          label="Other Information"
          value={formData.otherInfo}
          maxLength={50}
          rows={4}
          placeholder="Enter Other Information"
          onChange={(v) => updateField("otherInfo", v)}
        />
      </div>
    </Card>
  );
}