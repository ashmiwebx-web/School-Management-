import React, { useEffect, useState } from "react";
import FormInput from "../../../components/Inputs/FormInput";
import FormSelect from "../../../components/Inputs/FormSelect";
import FormDate from "../../../components/Inputs/FormDate";
import ImageUploadBox from "../../../components/Upload/ImageUploadBox";
import { getStandards } from "../../../services/standardService";
import { getSections } from "../../../services/sectionService";

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

const options = (arr) =>
  arr.map((x) => ({
    label: x,
    value: x,
  }));

export default function PersonalInfo({ formData, updateField }) {
  const [standards, setStandards] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stdData, secData] = await Promise.all([
        getStandards(),
        getSections(),
      ]);

      setStandards(Array.isArray(stdData) ? stdData : []);
      setSections(Array.isArray(secData) ? secData : []);
    } catch (error) {
      console.error(error);
    }
  };

  const classOptions = standards.map((item) => ({
    label: item.stdName,
    value: item.stdName,
  }));

  const sectionOptions = sections.map((item) => ({
    label: item.sectionName,
    value: item.sectionName,
  }));

  return (
    <Card title="Personal Information">
      <div className="mb-5">
        <ImageUploadBox
          file={formData.photo}
          onChange={(file) => updateField("photo", file)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        <FormSelect
          label="Academic Year"
          value={formData.academicYear}
          options={[
            {
              label: "2026-2027",
              value: "2026-2027",
            },
          ]}
          onChange={(v) => updateField("academicYear", v)}
        />

        <FormInput
          label="Admission Number"
          required
          value={formData.admissionNumber}
          readOnly
        />

        <FormDate
          label="Admission Date"
          value={formData.admissionDate}
          onChange={(v) => updateField("admissionDate", v)}
        />

        <FormInput
          label="Ad.Roll No"
          required
          value={formData.adRollNo}
          readOnly
        />

        <FormSelect
          label="Status"
          value={formData.status}
          options={[
            {
              label: "Active",
              value: "Active",
            },
          ]}
          onChange={(v) => updateField("status", v)}
        />

        <FormInput
          label="First Name"
          required
          value={formData.firstName}
          maxLength={20}
          onChange={(v) => updateField("firstName", v)}
        />

        <FormInput
          label="Last Name"
          value={formData.lastName}
          maxLength={20}
          onChange={(v) => updateField("lastName", v)}
        />

        <FormSelect
          label="Class"
          required
          value={formData.className}
          placeholder="Select"
          options={classOptions}
          onChange={(v) => updateField("className", v)}
        />

        <FormSelect
          label="Section"
          value={formData.sectionName}
          placeholder="Select"
          options={sectionOptions}
          onChange={(v) => updateField("sectionName", v)}
        />

        <FormSelect
          label="Gender"
          required
          value={formData.gender}
          placeholder="Select"
          options={options(["Male", "Female", "Others"])}
          onChange={(v) => updateField("gender", v)}
        />

        <FormDate
          label="Date of Birth"
          required
          value={formData.dateOfBirth}
          onChange={(v) => updateField("dateOfBirth", v)}
        />

        <FormSelect
          label="Blood Group"
          value={formData.bloodGroup}
          placeholder="Select"
          options={options([
            "A+",
            "A-",
            "B+",
            "B-",
            "O+",
            "O-",
            "AB+",
            "AB-",
          ])}
          onChange={(v) => updateField("bloodGroup", v)}
        />

        <FormSelect
          label="House"
          value={formData.house}
          placeholder="Select"
          options={options(["Red", "Blue", "Green", "Yellow"])}
          onChange={(v) => updateField("house", v)}
        />

        <FormSelect
          label="Religion"
          value={formData.religion}
          placeholder="Select"
          options={options([
            "Hindu",
            "Christian",
            "Muslim",
            "Others",
          ])}
          onChange={(v) => updateField("religion", v)}
        />

        <FormSelect
          label="Category"
          value={formData.category}
          placeholder="Select"
          options={options([
            "General",
            "BC",
            "MBC",
            "SC",
            "ST",
            "Others",
          ])}
          onChange={(v) => updateField("category", v)}
        />

        <FormInput
          label="Primary Contact Number"
          required
          value={formData.primaryContact}
          numbersOnly
          maxLength={10}
          onChange={(v) => updateField("primaryContact", v)}
        />

        <FormInput
          label="Email Address"
          required
          value={formData.email}
          maxLength={50}
          onChange={(v) => updateField("email", v)}
        />

        <FormInput
          label="Caste"
          value={formData.caste}
          maxLength={20}
          onChange={(v) => updateField("caste", v)}
        />

        <FormSelect
          label="Mother Tongue"
          value={formData.motherTongue}
          placeholder="Select"
          options={options([
            "Tamil",
            "English",
            "Hindi",
            "Malayalam",
            "Telugu",
          ])}
          onChange={(v) => updateField("motherTongue", v)}
        />

        <FormInput
          label="Language Known"
          value={(formData.languageKnown || []).join(", ")}
          onChange={(v) =>
            updateField(
              "languageKnown",
              v
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
    </Card>
  );
}