import React from "react";

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-[40px] rounded-[6px] bg-[#506ee4] px-5 text-[14px] font-semibold text-white hover:bg-[#3d5ee1] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
