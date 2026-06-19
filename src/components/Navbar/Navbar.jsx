import React from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-[999] h-[64px] border-b border-[#e5e9f2] bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <h1 className="text-[18px] font-bold text-[#061b49]">
          School Management
        </h1>

        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#506ee4] font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}