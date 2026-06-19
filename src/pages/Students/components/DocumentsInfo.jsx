import React from "react";
import DocumentUploadBox from "../../../components/Upload/DocumentUploadBox";

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

export default function DocumentsInfo({ formData, updateField }) {
  return (
    <Card title="Documents">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DocumentUploadBox
          label="Birth Certificate"
          displayName="BirthCertificate.pdf"
          file={formData.birthCertificate}
          onChange={(f) => updateField("birthCertificate", f)}
        />

        <DocumentUploadBox
          label="Upload Transfer Certificate"
          displayName="TransferCertificate.pdf"
          file={formData.transferCertificate}
          onChange={(f) => updateField("transferCertificate", f)}
        />
      </div>
    </Card>
  );
}