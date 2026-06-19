import React, { useState } from "react";

import PageHeader from "../../components/PageHeader/PageHeader";
import AddStandardSectionsModal from "./AddStandardSectionsModal";
import CombinedStdModal from "./CombinedStdModal";
import CombinedStdTable from "./CombinedStdTable";
import GenerateRollNoPanel from "./GenerateRollNoPanel";

export default function StandardSections() {
  const [mainOpen, setMainOpen] = useState(false);
  const [combinedOpen, setCombinedOpen] = useState(false);
  const [activeView, setActiveView] = useState("combined");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCombined = () => setRefreshKey((prev) => prev + 1);

  const actionButtonClass = (active, width = "min-w-[150px]") =>
    `h-[40px] ${width} rounded-[6px] border px-4 text-[14px] font-semibold transition-all ${
      active
        ? "border-[#506ee4] bg-[#506ee4] text-white hover:bg-[#3d5ee1]"
        : "border-[#e5e9f2] bg-white text-[#202c4b] hover:bg-[#f8f9fc]"
    }`;

  return (
    <>
      <PageHeader
        title="Standard & Sections"
        subtitle="Manage standards, sections and combined standards"
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                setActiveView("add");
                setMainOpen(true);
              }}
              className={actionButtonClass(activeView === "add", "min-w-[190px]")}
            >
              Add Standard & Sections
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView("combined");
                setCombinedOpen(true);
              }}
              className={actionButtonClass(activeView === "combined")}
            >
              Combined Std
            </button>

            <button
              type="button"
              onClick={() => setActiveView("rollno")}
              className={actionButtonClass(activeView === "rollno", "min-w-[215px]")}
            >
              Swap & Generate Roll No
            </button>
          </>
        }
      />

      <div className="mt-5">
        {activeView === "rollno" ? (
          <GenerateRollNoPanel refreshKey={refreshKey} />
        ) : (
          <CombinedStdTable refreshKey={refreshKey} />
        )}
      </div>

      <AddStandardSectionsModal
        open={mainOpen}
        onClose={() => {
          setMainOpen(false);
          setActiveView("combined");
        }}
        onRefresh={refreshCombined}
      />

      <CombinedStdModal
        open={combinedOpen}
        onClose={() => {
          setCombinedOpen(false);
          setActiveView("combined");
        }}
        onSaved={refreshCombined}
      />
    </>
  );
}
