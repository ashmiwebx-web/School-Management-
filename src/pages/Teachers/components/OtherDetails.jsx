import React from "react";
import { FiBriefcase, FiFileText, FiMap, FiMapPin, FiShare2, FiUserCheck } from "react-icons/fi";

import FormDate from "../../../components/Inputs/FormDate";
import FormInput from "../../../components/Inputs/FormInput";
import FormSelect from "../../../components/Inputs/FormSelect";
import FormTextarea from "../../../components/Inputs/FormTextarea";
import TeacherSectionCard from "./TeacherSectionCard";

const opt = (arr) => arr.map((value) => ({ label: value, value }));
const contractOptions = opt(["Permanent", "Temporary", "Contract"]);
const shiftOptions = opt(["Morning", "Day", "Evening"]);

export default function OtherDetails({ formData, updateField }) {
  return (
    <>
      <TeacherSectionCard icon={FiBriefcase} title="Payroll">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FormInput label="EPF No" value={formData.epfNo} maxLength={50} onChange={(v) => updateField("epfNo", v)} />
          <FormInput label="Basic Salary" value={formData.basicSalary} numbersOnly maxLength={10} onChange={(v) => updateField("basicSalary", v)} />
          <FormSelect label="Contract Type" value={formData.contractType} options={contractOptions} onChange={(v) => updateField("contractType", v)} />
          <FormSelect label="Work Shift" value={formData.workShift} options={shiftOptions} onChange={(v) => updateField("workShift", v)} />
          <FormInput label="Work Location" value={formData.workLocation} maxLength={120} onChange={(v) => updateField("workLocation", v)} />
          <FormDate label="Date of Leaving" value={formData.dateOfLeaving} onChange={(v) => updateField("dateOfLeaving", v)} />
        </div>
      </TeacherSectionCard>

      <TeacherSectionCard icon={FiMap} title="Bank Account Detail">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FormInput label="Account Name" value={formData.accountName} maxLength={120} onChange={(v) => updateField("accountName", v)} />
          <FormInput label="Account Number" value={formData.accountNumber} numbersOnly maxLength={20} onChange={(v) => updateField("accountNumber", v)} />
          <FormInput label="Bank Name" value={formData.bankName} maxLength={100} onChange={(v) => updateField("bankName", v)} />
          <FormInput label="IFSC Code" value={formData.ifscCode} maxLength={20} onChange={(v) => updateField("ifscCode", v.toUpperCase())} />
          <FormInput label="Branch Name" value={formData.branchName} maxLength={100} onChange={(v) => updateField("branchName", v)} />
        </div>
      </TeacherSectionCard>

      <TeacherSectionCard icon={FiMapPin} title="Transport Information">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FormSelect label="Route" value={formData.route} options={opt(["Route 1", "Route 2", "Route 3"])} onChange={(v) => updateField("route", v)} />
          <FormSelect label="Vehicle Number" value={formData.vehicleNumber} options={opt(["TN 01 AB 1234", "TN 02 CD 5678"])} onChange={(v) => updateField("vehicleNumber", v)} />
          <FormSelect label="Pickup Point" value={formData.pickupPoint} options={opt(["Main Gate", "Bus Stop", "Railway Station"])} onChange={(v) => updateField("pickupPoint", v)} />
        </div>
      </TeacherSectionCard>

      <TeacherSectionCard icon={FiUserCheck} title="Hostel Information">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
          <FormSelect label="Hostel" value={formData.hostel} options={opt(["Yes", "No"])} onChange={(v) => updateField("hostel", v)} />
          <FormSelect label="Room No" value={formData.roomNo} options={opt(["101", "102", "103"])} onChange={(v) => updateField("roomNo", v)} />
        </div>
      </TeacherSectionCard>

      <TeacherSectionCard icon={FiShare2} title="Social Media Links">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 xl:grid-cols-5">
          <FormInput label="Facebook" value={formData.facebook} maxLength={200} onChange={(v) => updateField("facebook", v)} />
          <FormInput label="Instagram" value={formData.instagram} maxLength={200} onChange={(v) => updateField("instagram", v)} />
          <FormInput label="Linked In" value={formData.linkedIn} maxLength={200} onChange={(v) => updateField("linkedIn", v)} />
          <FormInput label="Youtube" value={formData.youtube} maxLength={200} onChange={(v) => updateField("youtube", v)} />
          <FormInput label="Twitter URL" value={formData.twitterUrl} maxLength={200} onChange={(v) => updateField("twitterUrl", v)} />
        </div>
      </TeacherSectionCard>

      <TeacherSectionCard icon={FiFileText} title="Password">
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
          <FormInput label="New Password" type="password" value={formData.newPassword} maxLength={30} onChange={(v) => updateField("newPassword", v)} />
          <FormInput label="Confirm Password" type="password" value={formData.confirmPassword} maxLength={30} onChange={(v) => updateField("confirmPassword", v)} />
        </div>
      </TeacherSectionCard>

      <TeacherSectionCard icon={FiFileText} title="Other Details">
        <FormTextarea label="Notes" value={formData.notes} placeholder="Other Information" rows={5} maxLength={500} onChange={(v) => updateField("notes", v)} />
      </TeacherSectionCard>
    </>
  );
}
