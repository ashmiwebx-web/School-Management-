import React from "react";

const variantClasses = {
  primary:
    "border border-[#506ee4] bg-[#506ee4] text-white hover:border-[#3d5ee1] hover:bg-[#3d5ee1]",
  add:
    "border border-[#506ee4] bg-[#506ee4] text-white shadow-sm hover:border-[#3d5ee1] hover:bg-[#3d5ee1]",
  secondary:
    "border border-[#e5e9f2] bg-white text-[#34415d] hover:bg-[#f8f9fc]",
  soft:
    "border border-[#e5e9f2] bg-[#f5f7fb] text-[#34415d] hover:bg-[#eef2ff]",
  success:
    "border border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700",
  danger:
    "border border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700",
  ghost:
    "border border-transparent bg-transparent text-[#061b49] hover:bg-[#f5f7ff]",
  dark:
    "border border-[#162341] bg-[#162341] text-white hover:border-[#0f172a] hover:bg-[#0f172a]",
};

const sizeClasses = {
  xs: "h-[28px] px-3 text-[12px]",
  sm: "h-[34px] px-4 text-[13px]",
  md: "h-[40px] px-5 text-[14px]",
  lg: "h-[40px] px-[14px] text-[14px]",
  xl: "h-[48px] px-6 text-[15px]",
  icon: "h-[32px] w-[32px] p-0 text-[14px]",
};

export default function CommonButton({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  title = "",
  ariaLabel = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || title || undefined}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] font-semibold leading-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
