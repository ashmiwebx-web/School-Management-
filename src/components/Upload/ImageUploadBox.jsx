import React, { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    const src = getImageSrc(file);
    setPreview(src);

    return () => {
      if (file instanceof File && src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [file]);

  const inputId = useMemo(
    () => `upload-${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-[6px] border border-dashed border-[#dbe3f0] bg-white">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[24px]">📷</span>
        )}
      </div>

      <div>
        <div className="mb-4 flex gap-3">
          <label
            htmlFor={inputId}
            className="flex h-[44px] cursor-pointer items-center justify-center rounded-[6px] border border-[#e5e9f2] px-7 text-[14px] font-semibold text-black"
          >
            Upload
          </label>

          <button
            type="button"
            onClick={() => onChange(null)}
            className="h-[44px] rounded-[6px] bg-[#506ee4] px-7 text-[14px] font-semibold text-white"
          >
            Remove
          </button>
        </div>

        <p className="text-[14px] text-[#64748b]">
          Upload image size 2MB, Format JPG, JPEG only
        </p>

        <input
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