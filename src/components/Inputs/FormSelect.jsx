import React from "react";

export default function FormSelect({
  label = "",
  value = "",
  onChange = () => {},
  options = [],
  placeholder = "Select",
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-[14px] font-semibold text-[#061b49]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[35px] w-full cursor-pointer rounded-[6px] border border-[#e5e9f2] bg-white px-3 text-[14px] text-[#202c4b] outline-none transition focus:border-[#506ee4] disabled:cursor-not-allowed disabled:bg-[#f8f9fc] ${className}`}
      >
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
