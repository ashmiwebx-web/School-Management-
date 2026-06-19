import React from "react";

export default function PageTabs({ tabs = [], activeTab, onTabChange }) {
  return (
    <div className="border-b border-[#e5e9f2] bg-white">
      <div className="flex h-[52px] items-end gap-8 px-5">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative h-[52px] px-1 text-[15px] font-semibold transition-colors ${
                active ? "text-[#506ee4]" : "text-[#34415d]"
              }`}
            >
              {tab.label}

              <span
                className={`absolute bottom-0 left-0 h-[3px] rounded-t bg-[#506ee4] transition-all ${
                  active ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}