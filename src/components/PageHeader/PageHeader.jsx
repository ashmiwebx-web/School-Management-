import React from "react";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="rounded-[8px] border border-[#e5e9f2] bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#061b49]">{title}</h1>

          {subtitle && (
            <p className="mt-2 text-[15px] text-[#536484]">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
