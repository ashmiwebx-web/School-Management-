import React, { useEffect, useMemo, useRef, useState } from "react";
import CommonButton from "../Buttons/CommonButton";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageSrc = (file) => {
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

export default function ImageUploadBox({ file, onChange }) {
  const [preview, setPreview] = useState("");
  const inputRef = useRef(null);

  const inputId = useMemo(
    () => `upload-${Math.random().toString(36).slice(2)}`,
    []
  );

  useEffect(() => {
    const src = getImageSrc(file);
    setPreview(src);

    return () => {
      if (file instanceof File && src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [file]);

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-[85px] w-[85px] items-center justify-center overflow-hidden rounded-[6px] border border-dashed border-[#dbe3f0] bg-white">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[15px]">📷</span>
        )}
      </div>

      <div>
        <div className="mb-4 flex gap-2">
          <CommonButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </CommonButton>

          <CommonButton
            type="button"
            variant="primary"
            size="sm"
            onClick={handleRemove}
          >
            Remove
          </CommonButton>
        </div>

        <p className="text-[13px] text-[#64748b]">
          Upload image size 2MB, Format JPG, JPEG, PNG only
        </p>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          hidden
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );
}
