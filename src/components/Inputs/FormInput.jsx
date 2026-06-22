import React from "react";

export default function FormInput({
  label = "",
  value = "",
  onChange = () => {},
  placeholder = "",
  type = "text",
  readOnly = false,
  maxLength = 20,
  numbersOnly = false,
  required = false,
  disabled = false,
  className = "",
}) {
  const handleChange = (e) => {
    let nextValue = e.target.value;

    if (numbersOnly) nextValue = nextValue.replace(/\D/g, "");
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

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength || undefined}
        onChange={handleChange}
        className={`h-[35px] w-full rounded-[6px] border border-[#e5e9f2] px-3 text-[14px] text-[#202c4b] outline-none transition focus:border-[#506ee4] disabled:cursor-not-allowed disabled:bg-[#f8f9fc] ${
          readOnly ? "bg-[#f8f9fc] font-semibold text-[#506ee4]" : "bg-white"
        } ${className}`}
      />
    </div>
  );
}
