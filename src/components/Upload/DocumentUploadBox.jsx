import React, { useMemo, useRef } from "react";
import CommonButton from "../Buttons/CommonButton";

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
  const inputRef = useRef(null);

  const inputId = useMemo(
    () => `doc-${Math.random().toString(36).slice(2)}`,
    []
  );

  const docUrl = getDocUrl(file);
  const docName = getDocName(file, displayName);

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  };

  return (
    <div>
      <h3 className="mb-2 text-[15px] font-bold text-[#061b49]">{label}</h3>

      <p className="mb-3 text-[13px] text-[#64748b]">
        Upload document size 2MB, Accepted Format PDF only
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <CommonButton
          type="button"
          variant="primary"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Upload Document
        </CommonButton>

        {file && (
          <CommonButton
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemove}
          >
            Remove
          </CommonButton>
        )}

        {docName && (
          <a
            href={docUrl}
            target="_blank"
            rel="noreferrer"
            className="max-w-[220px] truncate text-[13px] font-medium text-[#3158ff]"
            title={docName}
          >
            {docName}
          </a>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        hidden
        accept="application/pdf"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
