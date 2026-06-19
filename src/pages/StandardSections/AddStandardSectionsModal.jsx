import React, { useState } from "react";

import CommonModal from "../../components/Modal/CommonModal";
import PageTabs from "../../components/Tabs/PageTabs";
import SectionTab from "./SectionTab";
import StandardTab from "./StandardTab";

export default function AddStandardSectionsModal({ open, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("section");

  return (
    <CommonModal
      open={open}
      title="Add Standard & Sections"
      onClose={onClose}
      width="max-w-[760px]"
      showFooter={false}
    >
      <PageTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "section", label: "Section" },
          { id: "standard", label: "Standard" },
        ]}
      />

      <div className="mt-4">
        <div className={activeTab === "section" ? "block" : "hidden"}>
          <SectionTab onRefresh={onRefresh} />
        </div>

        <div className={activeTab === "standard" ? "block" : "hidden"}>
          <StandardTab onRefresh={onRefresh} />
        </div>
      </div>
    </CommonModal>
  );
}
