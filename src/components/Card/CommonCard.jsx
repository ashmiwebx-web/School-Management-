import React from "react";

export default function CommonCard({ children, className = "" }) {
  return (
    <div className={`rounded-[8px] border border-[#e5e9f2] bg-white ${className}`}>
      {children}
    </div>
  );
}
