import React from "react";
import FormInput from "../../../components/Inputs/FormInput";
import ImageUploadBox from "../../../components/Upload/ImageUploadBox";

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

export default function ParentGuardianInfo({ formData, updateField }) {
  return (
    <Card title="Parents & Guardian Information">
      <h3 className="mb-4 text-[17px] font-bold text-[#061b49]">
        Father's Info
      </h3>

      <div className="mb-5">
        <ImageUploadBox
          file={formData.fatherPhoto}
          onChange={(f) => updateField("fatherPhoto", f)}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
        <FormInput
          label="Father Name"
          required
          value={formData.fatherName}
          maxLength={20}
          onChange={(v) => updateField("fatherName", v)}
        />

        <FormInput
          label="Email"
          value={formData.fatherEmail}
          maxLength={50}
          onChange={(v) => updateField("fatherEmail", v)}
        />

        <FormInput
          label="Phone Number"
          required
          value={formData.fatherPhone}
          numbersOnly
          maxLength={10}
          onChange={(v) => updateField("fatherPhone", v)}
        />

        <FormInput
          label="Father Occupation"
          value={formData.fatherOccupation}
          maxLength={20}
          onChange={(v) => updateField("fatherOccupation", v)}
        />
      </div>

      <hr className="mb-5" />

      <h3 className="mb-4 text-[17px] font-bold text-[#061b49]">
        Mother's Info
      </h3>

      <div className="mb-5">
        <ImageUploadBox
          file={formData.motherPhoto}
          onChange={(f) => updateField("motherPhoto", f)}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
        <FormInput
          label="Mother Name"
          required
          value={formData.motherName}
          maxLength={20}
          onChange={(v) => updateField("motherName", v)}
        />

        <FormInput
          label="Email"
          value={formData.motherEmail}
          maxLength={50}
          onChange={(v) => updateField("motherEmail", v)}
        />

        <FormInput
          label="Phone Number"
          required
          value={formData.motherPhone}
          numbersOnly
          maxLength={10}
          onChange={(v) => updateField("motherPhone", v)}
        />

        <FormInput
          label="Mother Occupation"
          value={formData.motherOccupation}
          maxLength={20}
          onChange={(v) => updateField("motherOccupation", v)}
        />
      </div>

      <hr className="mb-5" />

      <h3 className="mb-4 text-[17px] font-bold text-[#061b49]">
        Guardian Details
      </h3>

      <div className="mb-5 flex gap-5">
        <span>If Guardian Is</span>

        {["Parents", "Guardian", "Others"].map((x) => (
          <label key={x} className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.guardianType === x}
              onChange={() => updateField("guardianType", x)}
            />
            {x}
          </label>
        ))}
      </div>

      <div className="mb-5">
        <ImageUploadBox
          file={formData.guardianPhoto}
          onChange={(f) => updateField("guardianPhoto", f)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <FormInput
          label="Guardian Name"
          value={formData.guardianName}
          maxLength={20}
          onChange={(v) => updateField("guardianName", v)}
        />

        <FormInput
          label="Guardian Relation"
          value={formData.guardianRelation}
          maxLength={20}
          onChange={(v) => updateField("guardianRelation", v)}
        />

        <FormInput
          label="Phone Number"
          value={formData.guardianPhone}
          numbersOnly
          maxLength={10}
          onChange={(v) => updateField("guardianPhone", v)}
        />

        <FormInput
          label="Email"
          value={formData.guardianEmail}
          maxLength={50}
          onChange={(v) => updateField("guardianEmail", v)}
        />

        <FormInput
          label="Occupation"
          value={formData.guardianOccupation}
          maxLength={20}
          onChange={(v) => updateField("guardianOccupation", v)}
        />

        <FormInput
          label="Address"
          value={formData.guardianAddress}
          maxLength={50}
          onChange={(v) => updateField("guardianAddress", v)}
        />
      </div>
    </Card>
  );
}