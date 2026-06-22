import React from "react";
import { FiMapPin } from "react-icons/fi";

import FormInput from "../../../components/Inputs/FormInput";
import TeacherSectionCard from "./TeacherSectionCard";

export default function AddressInfo({ formData, updateField }) {
  return (
    <TeacherSectionCard icon={FiMapPin} title="Address">
      <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-3">
        <FormInput label="Address" value={formData.address} maxLength={250} onChange={(v) => updateField("address", v)} />
        <FormInput label="Permanent Address" value={formData.permanentAddress} maxLength={250} onChange={(v) => updateField("permanentAddress", v)} />
        <FormInput label="PAN Number / ID Number" value={formData.panNumber} maxLength={20} onChange={(v) => updateField("panNumber", v.toUpperCase())} />
      </div>
    </TeacherSectionCard>
  );
}
