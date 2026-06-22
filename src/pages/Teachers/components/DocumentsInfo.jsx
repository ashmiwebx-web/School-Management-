import React from "react";
import { FiFileText } from "react-icons/fi";

import DocumentUploadBox from "../../../components/Upload/DocumentUploadBox";
import TeacherSectionCard from "./TeacherSectionCard";

export default function DocumentsInfo({ formData, updateField }) {
  return (
    <TeacherSectionCard icon={FiFileText} title="Documents">
      <div className="grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-2">
        <DocumentUploadBox label="Upload Resume" displayName="Resume.pdf" file={formData.resume} onChange={(file) => updateField("resume", file)} />
        <DocumentUploadBox label="Upload Joining Letter" displayName="JoiningLetter.pdf" file={formData.joiningLetter} onChange={(file) => updateField("joiningLetter", file)} />
      </div>
    </TeacherSectionCard>
  );
}
