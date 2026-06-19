import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiHome,
  FiLayers,
  FiBook,
  FiClipboard,
  FiSettings,
  FiTruck,
  FiChevronDown,
} from "react-icons/fi";

const menuItems = [
  {
    label: "Students",
    to: "/student-list",
    icon: FiUsers,
    activePaths: ["/student-list", "/add-student", "/edit-student", "/student-view"],
  },
  {
    label: "Teachers",
    to: "/teacher-list",
    icon: FiUserCheck,
    activePaths: ["/teacher-list", "/add-teacher", "/edit-teacher", "/teacher-view"],
  },
  {
    label: "Blocks & Class Rooms",
    to: "/blocks-classrooms",
    icon: FiHome,
    activePaths: ["/blocks-classrooms", "/blocks", "/classrooms"],
  },
  {
    label: "Class Allocation",
    to: "/class-allocation",
    icon: FiLayers,
    activePaths: ["/class-allocation"],
  },
  {
    label: "All Subjects",
    to: "/subjects",
    icon: FiBook,
    activePaths: ["/subjects"],
  },
  {
    label: "Allote Subject",
    to: "/allote-subject",
    icon: FiClipboard,
    activePaths: ["/allote-subject"],
  },
  {
    label: "Standard & Sections",
    to: "/standard-sections",
    icon: FiSettings,
    activePaths: ["/standard-sections", "/generate-rollno", "/combined-std"],
  },
];

const transportItems = [
  {
    label: "Routes",
    to: "/transport/routes",
  },
  {
    label: "Vehicles",
    to: "/transport/vehicles",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [transportOpen, setTransportOpen] = useState(
    location.pathname.startsWith("/transport")
  );

  const isMenuActive = (item) =>
    Array.isArray(item.activePaths) &&
    item.activePaths.some((path) => location.pathname.startsWith(path));

  const menuClass = (active) =>
    `flex h-[44px] items-center gap-3 rounded-[6px] px-3 text-[14px] font-medium transition-all ${
      active
        ? "bg-[#eef2ff] text-[#3158ff]"
        : "text-[#34415d] hover:bg-[#f5f7ff] hover:text-[#3158ff]"
    }`;

  const transportActive = location.pathname.startsWith("/transport");

  return (
    <aside className="fixed left-0 top-0 z-[1000] h-screen w-[260px] border-r border-[#e5e9f2] bg-white">
      <div className="flex h-[64px] items-center border-b border-[#e5e9f2] px-5">
        <h1 className="text-[20px] font-bold text-[#061b49]">School</h1>
      </div>

      <nav className="space-y-2 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isMenuActive(item);

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={() => menuClass(active)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={() => setTransportOpen((prev) => !prev)}
          className={`${menuClass(transportActive)} w-full cursor-pointer justify-between`}
        >
          <span className="flex items-center gap-3">
            <FiTruck size={18} />
            <span>Transport</span>
          </span>

          <FiChevronDown
            size={16}
            className={`transition-transform ${
              transportOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {transportOpen && (
          <div className="ml-9 space-y-1">
            {transportItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-[5px] px-3 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#eef2ff] text-[#3158ff]"
                      : "text-[#34415d] hover:bg-[#f5f7ff] hover:text-[#3158ff]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}