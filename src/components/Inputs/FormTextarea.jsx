import React from "react";

export default function FormTextarea({
  label = "",
  value = "",
  onChange = () => {},
  placeholder = "",
  maxLength = 50,
  rows = 4,
  required = false,
  className = "",
}) {
  const handleChange = (e) => {
    let nextValue = e.target.value;

    if (maxLength) nextValue = nextValue.slice(0, maxLength);

    onChange(nextValue);
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength || undefined}
        onChange={handleChange}
        className={`w-full resize-none rounded-[6px] border border-[#e5e9f2] px-3 py-3 text-[14px] text-[#202c4b] outline-none transition focus:border-[#506ee4] ${className}`}
      />

      {maxLength && (
        <p className="mt-1 text-right text-[12px] text-[#64748b]">
          {String(value || "").length}/{maxLength}
        </p>
      )}
    </div>
  );
}
