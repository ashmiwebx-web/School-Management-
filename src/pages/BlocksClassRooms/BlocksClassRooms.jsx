import React, { useState } from "react";
import { FiGrid, FiHome } from "react-icons/fi";

import PageTabs from "../../components/Tabs/PageTabs";
import BlocksTab from "./BlocksTab";
import ClassRoomsTab from "./ClassRoomsTab";

export default function BlocksClassRooms() {
  const [activeTab, setActiveTab] = useState("blocks");

  const tabs = [
    { id: "blocks", label: "Blocks", icon: <FiGrid /> },
    { id: "classrooms", label: "Class Rooms", icon: <FiHome /> },
  ];

  return (
    <div className="rounded-[6px] border border-[#e5e9f2] bg-white">
      <PageTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="bg-[#f6f7fb] p-5">
        {activeTab === "blocks" && <BlocksTab />}
        {activeTab === "classrooms" && <ClassRoomsTab />}
      </div>
    </div>
  );
}