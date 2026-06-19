import React, { useMemo } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getDocUrl = (file) => {
  if (!file) return "";

  if (file instanceof File) {
    return URL.createObjectURL(file);
  }

  if (typeof file === "string") {
    if (file.startsWith("http")) return file;
    return `${API}/${file.replace(/^\/+/, "")}`;
  }

  return "";
};

const getDocName = (file, displayName) => {
  if (!file) return "";

  if (displayName) return displayName;

  if (file instanceof File) return file.name;

  if (typeof file === "string") {
    return file.split("/").pop() || "Document.pdf";
  }

  return "Document.pdf";
};

export default function DocumentUploadBox({
  label,
  file,
  onChange,
  displayName = "",
}) {
  const inputId = useMemo(
    () => `doc-${Math.random().toString(36).slice(2)}`,
    []
  );

  const docUrl = getDocUrl(file);
  const docName = getDocName(file, displayName);

  return (
    <div>
      <h3 className="mb-3 text-[16px] font-bold text-[#061b49]">{label}</h3>

      <p className="mb-4 text-[14px] text-[#64748b]">
        Upload image size of 2MB, Accepted Format PDF only
      </p>

      <div className="flex items-center gap-4">
        <label
          htmlFor={inputId}
          className="flex h-[44px] cursor-pointer items-center justify-center rounded-[6px] bg-[#506ee4] px-6 text-[14px] font-semibold text-white"
        >
          Upload Document
        </label>

        {docName && (
          <a
            href={docUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[14px] font-medium text-[#3158ff]"
          >
            {docName}
          </a>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        hidden
        accept="application/pdf"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}