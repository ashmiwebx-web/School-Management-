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

export default function AddressInfo({ formData, updateField }) {
  return (
    <Card title="Address">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Current Address"
          required
          value={formData.currentAddress}
          maxLength={50}
          onChange={(v) => updateField("currentAddress", v)}
        />

        <FormInput
          label="Permanent Address"
          value={formData.permanentAddress}
          maxLength={50}
          onChange={(v) => updateField("permanentAddress", v)}
        />
      </div>
    </Card>
  );
}