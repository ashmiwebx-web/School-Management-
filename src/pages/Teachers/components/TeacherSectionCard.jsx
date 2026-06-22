import React from "react";
import CommonCard from "../../../components/Card/CommonCard";

export default function TeacherSectionCard({ icon: Icon, title, children }) {
  return (
    <CommonCard className="overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 bg-[#e9edf5] px-6 py-4">
        {Icon && (
          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] bg-white text-[#061b49]">
            <Icon size={16} />
          </span>
        )}
        <h2 className="text-[20px] font-bold text-[#061b49]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </CommonCard>
  );
}
